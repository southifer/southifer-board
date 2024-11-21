import React, { useMemo, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import FormatNumber from './FormatNumber';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';
import Swal from 'sweetalert2';
import CONFIG from './config/Config.json'
import { ToastContainer, toast } from 'react-toastify';

const controller = new AbortController();

const FarmTable = ({serverData}) => {
    const [farmData, setFarmData] = useState([]);
    const [selectedRowIds, setSelectedRowIds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
    
            const controller = new AbortController(); // Create an AbortController
            const signal = controller.signal;
    
            const fetchPromises = serverData.map((server) =>
                axios.get(`http://${server}:8000/bot/farm`, { signal }).then((res) => ({
                    server, // Add the server address
                    data: res.data, // Include the response data
                }))
            );
    
            toast.promise(Promise.all(fetchPromises), {
                pending: "Fetching farm data...",
                success: "Farm data loaded successfully!",
                error: "Failed to load farm data. Please try again.",
            });
    
            try {
                const responses = await Promise.all(fetchPromises);
    
                // Flatten the data and add `server` to each row
                const flattenedData = responses
                    .map(({ server, data }) =>
                        data.map((item, index) => ({
                            ...item,
                            id: item.world + item.door, // Unique ID based on server and index
                            server, // Add the server address to each row
                        }))
                    )
                    .flat(); // Flatten the resulting nested array
    
                setFarmData(flattenedData); // Set the processed data
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log("Request canceled:", error.message);
                } else {
                    console.error("Failed to fetch farm data:", error);
                }
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchData();
    
        return () => {
            controller.abort(); // Cleanup on unmount
        };
    }, [serverData]);    
    
    console.log(farmData[0])

    const columnDefs = [
        { field: 'world', width: 200, editable: true, enableCellChangeFlash: true, filter: "agTextColumnFilter" },
        { field: 'door', width: 200, editable: true, enableCellChangeFlash: true, filter: "agTextColumnFilter" },
        { field: 'status', width: 100, editable: true, enableCellChangeFlash: true},
        { field: 'nuked', width: 100, editable: true, enableCellChangeFlash: true, filter: "agSetColumnFilter" },
        { field: 'fire', width: 100, editable: true, enableCellChangeFlash: true, filter: "agSetColumnFilter" },
        { field: 'toxic', width: 100, editable: true, enableCellChangeFlash: true, filter: "agSetColumnFilter" },
        {
            field: 'tree_total', 
            width: 125,
            headerName: 'Tree',
            editable: true,  // Make this column editable
            enableCellChangeFlash: true,
            filter: "agNumberColumnFilter",
            valueFormatter: params => FormatNumber(params.value)
        },
        { 
            field: 'fossil_total', 
            width: 125,
            headerName: 'Fossil',
            editable: true,  // Make this column editable
            enableCellChangeFlash: true,
            filter: "agNumberColumnFilter" ,
            valueFormatter: params => FormatNumber(params.value)
        },
        { 
            field: 'item_float_total', 
            width: 125,
            headerName: 'Item Float',
            editable: true,  // Make this column editable
            enableCellChangeFlash: true,
            filter: "agNumberColumnFilter" ,
            valueFormatter: params => FormatNumber(params.value)
        },
        { 
            field: 'seed_float_total', 
            width: 125,
            headerName: 'Seeds Float',
            editable: true,  // Make this column editable
            enableCellChangeFlash: true,
            filter: "agNumberColumnFilter" ,
            valueFormatter: params => FormatNumber(params.value)
        },
        { 
            field: 'lastUpdated', 
            width: 200,
            headerName: 'Last Update',
            enableCellChangeFlash: true,
            valueFormatter: (params) => {
                const date = new Date(params.value * 1000);
                const options = {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true // Set to false for 24-hour format
                };
                return date.toLocaleString('en-US', options);
            },            
            filter: 'agDateColumnFilter', // Use the built-in date filter
            filterParams: {
                // Define the custom filter options
                comparator: (filterLocalDateAtMidnight, cellValue) => {
                    const cellDate = new Date(cellValue * 1000); // Convert cell value from seconds to milliseconds
                    // Ensure that the cell value is a valid date
                    if (isNaN(cellDate)) return 0; // Return 0 for invalid date
                    if (cellDate < filterLocalDateAtMidnight) return -1; // Before the filter date
                    if (cellDate > filterLocalDateAtMidnight) return 1; // After the filter date
                    return 0; // Equal
                },
            },
        },
    ];

    const rowSelection = useMemo(() => ({
        mode: 'multiRow',
        checkboxes: true,
        headerCheckbox: true,
        enableClickSelection: true,
    }), []);

    const getRowId = (params) => String(params.data.id);

    const gridOptions = {
        columnDefs: columnDefs,
        rowGroupPanelShow: 'always',
        defaultColDef: {
            filter: true,
            floatingFilter: true,
            menuTabs: ['generalMenuTab', 'columnsMenuTab', 'filterMenuTab'],
            resizable: true,
            enableRowGroup: true
        },
        columnMenu: 'legacy',
        statusBar: {
          statusPanels: [
                { statusPanel: 'agTotalAndFilteredRowCountComponent' },
                { statusPanel: 'agTotalRowCountComponent' },
                { statusPanel: 'agFilteredRowCountComponent' },
                { statusPanel: 'agSelectedRowCountComponent' },
                { statusPanel: 'agAggregationComponent' }
            ],
        },
        autoGroupColumnDef: {
            minWidth: 200,
        },
    };

    const onSelectionChanged = useCallback((event) => {
        const selectedIds = event.api.getSelectedRows().map(row => row.id);
        setSelectedRowIds(selectedIds);
    }, []);

    const onCellValueChanged = useCallback((event) => {
        console.log('Cell value changed:', event.data);
    }, []);

    const sendDataToServer = async (server, updatedData, titleText) => {
        
        const newScript = `${JSON.stringify(updatedData, null, 2)}`;
        const responsePromise = axios.post(`http://${server}:8000/bot/farm`, newScript, {
            headers: {
                'Content-Type': 'text/plain',
            },
        });

        toast.promise(responsePromise, {
            pending: "Promise is pending...",
            success: titleText ? titleText : "Success",
            error: "Please check your API connection...",
        });

        try {
            await responsePromise
        } catch (error) {
            console.error(error)
        }
    };

    const DeleteFarmAPI = async (server) => {
        if (selectedRowIds.length === 0) {
            Swal.fire({
                title: "info",
                text: 'No data selected!',
                icon: "warning"
            });
            return;
        }
    
        const selectedLogRow = selectedRowIds.length;
        setFarmData(rows => {
            const updatedData = rows.filter(row => !selectedRowIds.includes(row.id)); // Corrected from setSelectedRowIds to selectedRowIds
            sendDataToServer(server, updatedData, `Deleted x${selectedLogRow} farm`);
            return updatedData;
        });
    }

    const SaveFarmAPI = async (server) => {
        sendDataToServer(server, farmData, 'all data saved!')
    }

    const getContextMenuItems = (params) => [
        {
            name: 'Save Data',
            action: () => {
                SaveFarmAPI(params.node.data.server);
            }
        },
        {
            name: 'Delete data',
            action: () => {
                DeleteFarmAPI(params.node.data.server);
            }
        },
        {
            name: "Set Farm Status",
            subMenu: [
                {
                    name: "OK",
                    action: () => {
                        const selectedNodes = params.api.getSelectedNodes();
                        selectedNodes.forEach((node) => {
                            node.setDataValue("status", "OK");
                            node.setDataValue("nuked", false);
                        });
                        params.api.refreshCells({ force: true });
                    },
                },
                {
                    name: "NUKED",
                    action: () => {
                        const selectedNodes = params.api.getSelectedNodes();
                        selectedNodes.forEach((node) => {
                            node.setDataValue("status", "NUKED");
                            node.setDataValue("nuked", true);
                        });
                        params.api.refreshCells({ force: true });
                    },
                },
                {
                    name: "BAD_DOOR",
                    action: () => {
                        const selectedNodes = params.api.getSelectedNodes();
                        selectedNodes.forEach((node) => {
                            node.setDataValue("status", "BAD_DOOR");
                            node.setDataValue("nuked", false);
                        });
                        params.api.refreshCells({ force: true });
                    },
                },
            ],
        },        
        "separator",
        "copy",
    ]

    return (
        <div className="p-6 bg-mainBg text-white overflow-x-hidden">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                <div className="w-full h-[800px] ag-theme-quartz-dark">
                    <ToastContainer 
                        position='bottom-center'
                        autoClose={2000}
                        theme="dark"
                    />
                    <AgGridReact
                        loading={isLoading}
                        gridOptions={gridOptions}
                        rowData={farmData}
                        columnDefs={columnDefs}
                        rowSelection={rowSelection}
                        getRowId={getRowId}
                        pagination
                        onSelectionChanged={onSelectionChanged}
                        onCellValueChanged={onCellValueChanged}
                        getContextMenuItems={getContextMenuItems}
                    />
                </div>
            </div>
        </div>
    );
};

export default FarmTable;
