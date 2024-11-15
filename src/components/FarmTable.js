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

const controller = new AbortController();

const FarmTable = () => {
    const [farmData, setFarmData] = useState([]);
    const [selectedRowIds, setSelectedRowIds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${CONFIG.BASE_URL}/bot/farm`);
                const dataWithIds = response.data.map((item, index) => ({ ...item, id: index }));
    
                setFarmData(dataWithIds)
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        return () => {
            controller.abort();
        }
    }, []);

    const columnDefs = [
        { field: 'world', width: 200, editable: true, enableCellChangeFlash: true, filter: "agTextColumnFilter" },
        { field: 'door', width: 200, editable: true, enableCellChangeFlash: true, filter: "agTextColumnFilter" },
        { field: 'status', width: 200, editable: true, enableCellChangeFlash: true },
        { field: 'nuked', width: 150, editable: true, enableCellChangeFlash: true, filter: "agSetColumnFilter" },
        { field: 'fire', width: 150, editable: true, enableCellChangeFlash: true, filter: "agSetColumnFilter" },
        { field: 'toxic', width: 150, editable: true, enableCellChangeFlash: true, filter: "agSetColumnFilter" },
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
            width: 200,
            headerName: 'Fossil',
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
                const date = new Date(params.value * 1000); // Multiply by 1000 to convert seconds to milliseconds
                return date.toLocaleDateString(); // Format as date string (adjust if you want a different format)
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

    const getRowId = (params) => params.data.id;

    const gridOptions = {
        columnDefs: columnDefs,
        defaultColDef: {
            filter: true,
            floatingFilter: true,
            menuTabs: ['generalMenuTab', 'columnsMenuTab', 'filterMenuTab'],
            resizable: true,
        },
        columnMenu: 'legacy',
        suppressHeaderMenuButton: true,
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
                <div className="bg-[#1C1C1C] border border-[#434B56] p-5 rounded-lg shadow-md w-full h-[800px] ag-theme-alpine-dark">
                    <AgGridReact
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
