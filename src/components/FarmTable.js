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

const FarmTable = () => {
    const [farmData, setFarmData] = useState([]);
    const [selectedRowIds, setSelectedRowIds] = useState([]);
    const [selectedCount, setSelectedCount] = useState(0);

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(`${CONFIG.BASE_URL}/bot/farm`);
            const dataWithIds = response.data.map((item, index) => ({ ...item, id: index }));

            // Check if data is the same before setting state to prevent duplicates
            if (JSON.stringify(farmData) !== JSON.stringify(dataWithIds)) {
                setFarmData(dataWithIds);
            }
        } catch (error) {
            console.error(error);
        }
    }, [farmData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
            filter: "agNumberColumnFilter" 
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
        suppressHeaderMenuButton: true
    };

    const onSelectionChanged = useCallback((event) => {
        const selectedIds = event.api.getSelectedRows().map(row => row.id);
        setSelectedRowIds(selectedIds);
        setSelectedCount(selectedIds.length);
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

    return (
        <div className="p-6 bg-mainBg text-white min-h-screen overflow-x-hidden">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                <div className="bg-[#28313E] border border-[#434B56] p-5 rounded-lg shadow-md">
                    input here
                </div>
                <div className="bg-[#28313E] border border-[#434B56] p-5 rounded-lg shadow-md w-full h-[800px] ag-theme-quartz-dark">
                <div className="flex items-center justify-between mb-4">
                        {/* Left side: selected bots */}
                        <div className="flex md:col-span-2 gap-2">
                            <p>selected farm : <u>x{selectedCount}</u></p>
                        </div>

                        {/* Right side: buttons */}
                        <div className="flex md:col-span-2 gap-2">
                            <button 
                                title="Click me to delete!"
                                onClick={() => DeleteFarmAPI()}
                                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <button 
                                onClick={() => SaveFarmAPI()}
                                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
                                <path fillRule="evenodd" d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087ZM12 10.5a.75.75 0 0 1 .75.75v4.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72v-4.94a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                            </svg>

                            </button>
                        </div>
                    </div>
                    <AgGridReact
                        gridOptions={gridOptions}
                        rowData={farmData}
                        columnDefs={columnDefs}
                        rowSelection={rowSelection}
                        getRowId={getRowId}
                        pagination
                        onSelectionChanged={onSelectionChanged}
                        onCellValueChanged={onCellValueChanged} // Add this line to handle cell value changes
                    />
                </div>
            </div>
        </div>
    );
};

export default FarmTable;
