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

const FarmTable = () => {
    const [farmData, setFarmData] = useState([]);
    const [selectedRowIds, setSelectedRowIds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            
            const fetchPromise = axios.get(`${CONFIG.BASE_URL}/bot/farm`, { signal: controller.signal });
    
            toast.promise(fetchPromise, {
                position: "bottom-right",
                theme: "colored",
                autoClose: 2000,
                pending: "Fetching farm data...",
                success: "Farm data loaded successfully!",
                error: "Failed to load farm data. Please try again.",
            });
    
            try {
                const response = await fetchPromise;
                const dataWithIds = response.data.map((item, index) => ({ ...item, id: index }));
    
                setFarmData(dataWithIds);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
    
            return () => {
                controller.abort();
            };
        };
    
        fetchData();
    }, []);
    

    const columnDefs = [
        { field: 'world', width: 200, editable: true, enableCellChangeFlash: true, filter: "agTextColumnFilter" },
        { field: 'door', width: 200, editable: true, enableCellChangeFlash: true, filter: "agTextColumnFilter" },
        { field: 'status', width: 100, editable: true, enableCellChangeFlash: true },
        { field: 'nuked', width: 100, editable: true, enableCellChangeFlash: true, filter: "agSetColumnFilter" },
        { field: 'fire', width: 100, editable: true, enableCellChangeFlash: true, filter: "agSetColumnFilter" },
        { field: 'toxic', width: 100, editable: true, enableCellChangeFlash: true, filter: "agSetColumnFilter" },
        {
            field: 'tree_total', 
            width: 150,
            headerName: 'Tree',
            editable: true,  // Make this column editable
            enableCellChangeFlash: true,
            filter: "agNumberColumnFilter",
            valueFormatter: params => FormatNumber(params.value)
        },
        { 
            field: 'fossil_total', 
            width: 150,
            headerName: 'Fossil',
            editable: true,  // Make this column editable
            enableCellChangeFlash: true,
            filter: "agNumberColumnFilter" ,
            valueFormatter: params => FormatNumber(params.value)
        },
        { 
            field: 'item_float_total', 
            width: 150,
            headerName: 'Item Float',
            editable: true,  // Make this column editable
            enableCellChangeFlash: true,
            filter: "agNumberColumnFilter" ,
            valueFormatter: params => FormatNumber(params.value)
        },
        { 
            field: 'seed_float_total', 
            width: 150,
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
        defaultColDef: {
            filter: true,
            floatingFilter: true,
            menuTabs: ['generalMenuTab', 'columnsMenuTab', 'filterMenuTab'],
            resizable: true,
        },
        columnMenu: 'legacy',
        sideBar: {
          toolPanels: [
            {
                id: "columns",
                labelDefault: "Columns",
                labelKey: "columns",
                iconKey: "columns",
                toolPanel: "agColumnsToolPanel",
                minWidth: 225,
                width: 225,
                maxWidth: 225,
            },
            {
                id: "filters",
                labelDefault: "Filters",
                labelKey: "filters",
                iconKey: "filter",
                toolPanel: "agFiltersToolPanel",
                minWidth: 180,
                maxWidth: 400,
                width: 250,
            },
          ],
          position: "left",
          defaultToolPanel: "filters",
        },
        statusBar: {
          statusPanels: [
            { statusPanel: "agSelectedRowCountComponent" },
          ],
        },
    };

    const onSelectionChanged = useCallback((event) => {
        const selectedIds = event.api.getSelectedRows().map(row => row.id);
        setSelectedRowIds(selectedIds);
    }, []);

    const onCellValueChanged = useCallback((event) => {
        console.log('Cell value changed:', event.data);
    }, []);

    const sendDataToServer = async (updatedData, titleText) => {
        try {
            const newScript = `${JSON.stringify(updatedData, null, 2)}`;
            const response = await axios.post(`${CONFIG.BASE_URL}/bot/farm`, newScript, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });

            Swal.fire({
                title: "info",
                text: titleText ? titleText : response.data,
                icon: "success"
            });
    
        } catch (error) {
            Swal.fire({
                title: "The Internet?",
                text: error.message, // Use error.message for clearer output
                icon: "warning"
            });
        }
    };

    const DeleteFarmAPI = async () => {
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
            sendDataToServer(updatedData, `deleted x${selectedLogRow} farm`);
            return updatedData;
        });
    }

    const SaveFarmAPI = async () => {
        sendDataToServer(farmData, 'all data saved!')
    }

    const getContextMenuItems = (params) => [
        {
            name: 'Save Data',
            action: () => {
                SaveFarmAPI();
            }
        },
        {
            name: 'Delete data',
            action: () => {
                DeleteFarmAPI();
            }
        },
        "separator",
        "copy",
    ]

    return (
        <div className="p-6 bg-mainBg text-white min-h-screen overflow-x-hidden">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                {/* <div className="bg-[#1C1C1C] border border-[#434B56] p-5 rounded-lg shadow-md">
                    input here
                </div> */}
                <div className="bg-[#1C1C1C] border border-[#434B56] p-5 rounded-lg shadow-md w-full h-[800px] ag-theme-quartz-dark">
                    <ToastContainer />
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
