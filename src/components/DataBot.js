import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';


// Your showModal function as defined earlier
const showModal = (data) => {
    Swal.fire({
        icon: 'info',
        title: 'Confirm Adding Bot',
        html: `
            Are you sure you want to add the following bot?
            <br>Name: <strong>${data.username}</strong>
            <br>Password: <strong>${data.password}</strong>
            <br>MAC: <strong>${data.mac}</strong>
            <br>Recovery: <strong>${data.recovery}</strong>
            <br>RID: <strong>${data.rid}</strong>
            <br>Proxy: <strong>${data.proxy}</strong>
        `,
        showCancelButton: true,
        confirmButtonText: 'Add Bot',
        customClass: {
            popup: 'swal2-addbot' // Apply custom class to the modal
        }
    }).then((result) => {
        if (result.isConfirmed) {
            handleSubmit(data);  // Pass the collected data to handleSubmit
        }
    });
};

// Your handleSubmit function as defined earlier
const handleSubmit = async (data) => {

    if (!data.username || !data.password) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Name and Password are required fields!'
        });
        return;
    }

    try {
        const response = await axios.post(
            "http://191.96.94.35:8000/bot/add",
            null,
            {
                params: {
                    name: data.username,
                    password: data.password,
                    recovery: data.recovery || "",
                    mac: data.mac || "",
                    rid: data.rid || "",
                    proxy: data.proxy || ""
                }
            }
        );

        // Show success or failure message
        if (response.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Bot Added!',
                text: response.data
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: response.data
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'API Error',
            text: 'Failed to connect to the server.'
        });
        console.error('Error adding bot:', error);
    }
};

const DataBot = () => {
    const [rowData, setRowData] = useState([]);
    const [selectedRowIds, setSelectedRowIds] = useState([]);
    const [selectedCount, setSelectedCount] = useState(0);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        recovery: '',
        mac: '',
        rid: '',
        proxy: '',
    });
    const [fileContent, setFileContent] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
    
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                const isValidFormat = validateFileContent(content);
        
                if (isValidFormat) {
                    setFileContent(content);

                    const newRows = processFileContent(content);
                    setRowData(prevRows => [...prevRows, ...newRows]);
                } else {
                    Swal.fire({
                        title: "The Internet?",
                        text: 'File format is invalid. Please ensure it follows the format: USERNAME|PASSWORD|RECOVERY|MAC|RID|PROXY',
                        icon: "warning"
                    });
                }
            };
            reader.readAsText(file);
        }
    };

    const validateFileContent = (content) => {
        const lines = content.split('\n');
        return lines.every(line => {
            const parts = line.split('|');
            return parts.length >= 3 && parts.length <= 6; // Check for 3 to 6 parts
        });
    };
    
    const processFileContent = (content) => {
        const lines = content.split('\n');
        return lines.map((line, index) => {
            const parts = line.split('|');
            return {
                username: parts[0],
                password: parts[1],
                recovery: parts[2],
                mac: parts[3] || '', // Fallback to empty string if not present
                rid: parts[4] || '', // Fallback to empty string if not present
                proxy: parts[5] || '', // Fallback to empty string if not present
                id: rowData.length + index + 1, // Generate a unique ID
            };
        });
    };

    const countProxies = (rowData) => {
        const proxyCount = rowData.reduce((acc, user) => {
            const proxy = user.proxy;
            if (user.proxy !== '') {
                acc[proxy] = (acc[proxy] || 0) + 1;
            } else {
                acc[proxy] = 0;
            }
            
            return acc;
        }, {});
    
        // Map the original rowData to include the user count in the proxy field
        return rowData.map(user => ({
            ...user,
            proxyCount: `x${proxyCount[user.proxy]}` // Update the proxy field to include count
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://191.96.94.35:8000/bot/bot-backup');
                const dataWithIds = response.data.map((item, index) => ({ ...item, id: index }));
                const dataWithProxyCount = countProxies(dataWithIds); // Count proxies here
                setRowData(dataWithProxyCount);
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchData();
    }, []);

    // Define AG Grid columns
    const columns = [
        { headerName: 'Name', field: 'username', editable: true, minWidth: 300, filter: "agTextColumnFilter"},
        { headerName: 'Password', field: 'password', editable: true, minWidth: 200, filter: "agTextColumnFilter"},
        { headerName: 'Recovery', field: 'recovery', editable: true, minWidth: 300, filter: "agTextColumnFilter"},
        { headerName: 'MAC', field: 'mac', editable: true, minWidth: 200, filter: "agTextColumnFilter"},
        { headerName: 'RID', field: 'rid', editable: true, minWidth: 350, filter: "agTextColumnFilter"},
        { headerName: 'Proxy', field: 'proxy', editable: true, minWidth: 250, filter: "agTextColumnFilter"},
        { headerName: 'Proxy', field: 'proxyCount', editable: true, minWidth: 100, filter: "agNumberColumnFilter"},
    ];

    const onSelectionChanged = useCallback((event) => {
        const selectedIds = event.api.getSelectedRows().map(row => row.id);
        setSelectedRowIds(selectedIds);
        setSelectedCount(selectedIds.length); // Update selected count
    }, []);

    const handleCellEditingStopped = useCallback((event) => {
        const updatedData = rowData.map(row => 
            row.id === event.data.id ? { ...row, [event.column.colId]: event.value } : row
        );
        setRowData(updatedData);
    }, [rowData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission
    
        const NewData = {
            username: formData.username,
            password: formData.password,
            recovery: formData.recovery,
            mac: formData.mac,
            rid: formData.rid,
            proxy: formData.proxy,
            id: rowData.length // Assuming you want to keep it sequential
        };
        
        // Update the rows state using a functional update
        setRowData(prevRows => {
            const updatedData = [...prevRows, NewData]; // Append the new data
            console.table(updatedData);
            sendDataToServer(updatedData, 'bot added success'); // Send updated data to server
            return updatedData; // Return updated state
        });
    };

    const sendDataToServer = async (updatedData, titleText) => {
        try {
            const newScript = `${JSON.stringify(updatedData, null, 2)}`; // Convert updated data to JSON
            const response = await axios.post('http://191.96.94.35:8000/bot/bot-backup', newScript, {
                headers: {
                    'Content-Type': 'text/plain', // Change this as needed
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

    const RemoveDataAPI = async () => {
        if (selectedRowIds.length === 0) {
            Swal.fire({
                title: "info",
                text: 'No data selected!',
                icon: "warning"
            });
            return;
        }
    
        const selectedLogRow = selectedRowIds.length;
        setRowData(rows => {
            const updatedData = rows.filter(row => !selectedRowIds.includes(row.id)); // Corrected from setSelectedRowIds to selectedRowIds
            sendDataToServer(updatedData, `deleted x${selectedLogRow} bot`);
            return updatedData;
        });
    };
    

    const SaveDataAPI = async () => {
        sendDataToServer(rowData, 'all data saved!')
    };

    const rowSelection = useMemo(() => ({
        mode: 'multiRow',
        checkboxes: true,
        headerCheckbox: true,
        enableClickSelection: true,
    }), []);
    
    const gridOptions = {
        columnDefs: columns,
        defaultColDef: {
            flex: 1,
            filter: true,
            floatingFilter: true,
            menuTabs: ['generalMenuTab', 'filterMenuTab', 'columnsMenuTab'],
            enableCellChangeFlash: true,
        },
        columnMenu: 'legacy',
        suppressMenuHide: true,
    };

    const getRowClass = useCallback((params) => {
        return selectedRowIds.includes(params.data.id) ? 'selected-row' : '';
    }, [selectedRowIds]);

    const getContextMenuItems = (params) => [
        {
            name: 'Save Data',
            action: () => {
                SaveDataAPI();
            }
        },
        {
            name: 'Add Bot',
            action: () => {
                showModal(params.node.data);
            }
        },
        {
            name: 'Remove',
            action: () => {
                RemoveDataAPI();
            }
        },
        "separator",
        "copy",
    ]

    return (
        <div className="ag-theme-quartz-dark" style={{ height: 760, width: '100%' }}>
            <div className="p-6 bg-mainBg text-white min-h-screen overflow-x-hidden">
                <div className="bg-[#1C1C1C] p-4 rounded-lg shadow-md mb-4 border border-[#424242]">
                    <form className='grid grid-cols-1 md:grid-cols-2 gap-4' onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full h-[60px] text-white bg-[#222628] border border-[#424242] focus:ring-1 focus:outline-none font-medium rounded px-2.5 py-2.5"
                            required
                        />
                        <input
                            type="text"
                            name="password"
                            placeholder="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full h-[60px] text-white bg-[#222628] border border-[#424242] focus:ring-1 focus:outline-none font-medium rounded text-sm px-2.5 py-2.5"
                            required
                        />
                        <input
                            type="text"
                            name="recovery"
                            placeholder="recovery"
                            value={formData.recovery}
                            onChange={handleChange}
                            className="w-full h-[60px] text-white bg-[#222628] border border-[#424242] focus:ring-1 focus:outline-none font-medium rounded text-sm px-2.5 py-2.5"
                        />
                        <input
                            type="text"
                            name="mac"
                            placeholder="mac"
                            value={formData.mac}
                            onChange={handleChange}
                            className="w-full h-[60px] text-white bg-[#222628] border border-[#424242] focus:ring-1 focus:outline-none font-medium rounded text-sm px-2.5 py-2.5"
                        />
                        <input
                            type="text"
                            name="rid"
                            placeholder="rid"
                            value={formData.rid}
                            onChange={handleChange}
                            className="w-full h-[60px] text-white bg-[#222628] border border-[#424242] focus:ring-1 focus:outline-none font-medium rounded text-sm px-2.5 py-2.5"
                        />
                        <input
                            type="text"
                            name="proxy"
                            placeholder="proxy"
                            value={formData.proxy}
                            onChange={handleChange}
                            className="w-full h-[60px] text-white bg-[#222628] border border-[#424242] focus:ring-1 focus:outline-none font-medium rounded text-sm px-2.5 py-2.5"
                        />
                        <div className="flex items-center">
                            <button type="submit" className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
                                </svg>
                                add
                            </button>
                        </div>

                    </form>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="file-upload">Upload File:</label>
                            <input
                            type="file"
                            id="file-upload"
                            accept=".txt"
                            onChange={handleFileChange}
                            />
                        </div>

                        <button type="submit">Submit</button>
                    </form>
                </div>
                <div className="bg-[#1C1C1C] p-4 rounded-lg shadow-md mb-4 border border-[#424242]">
                    <div id="myGrid" class="ag-theme-alpine-dark" style={{ height: 760, width: '100%' }}>
                        <AgGridReact
                            gridOptions={gridOptions}
                            rowData={rowData}
                            columnDefs={columns}
                            rowSelection={rowSelection}
                            onSelectionChanged={onSelectionChanged}
                            onCellEditingStopped={handleCellEditingStopped}
                            getRowClass={getRowClass}
                            pagination
                            getContextMenuItems={getContextMenuItems}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataBot;
