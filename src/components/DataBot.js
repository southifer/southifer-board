import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import CONFIG from './config/Config.json'
import LoadingSpinner from './Loading';
import { toast } from 'react-toastify';

const controller = new AbortController();

const showModal = (data) => {
    if (data.length > 1) {
        Swal.fire({
            icon: 'info',
            title: 'Confirmation',
            text: `Confirm adding x${data.length} bots?`,
            showCancelButton: true,
            confirmButtonText: 'Add Bots',
        }).then((result) => {
            if (result.isConfirmed) {
                AddBot(data);
            }
        });
    } else {
        const bot = data[0];
        Swal.fire({
            icon: 'info',
            title: 'Confirm Adding Bot',
            html: `
                Are you sure you want to add the following bot?
                <br>Name: <strong>${bot.username}</strong>
                <br>Password: <strong>${bot.password}</strong>
                <br>MAC: <strong>${bot.mac}</strong>
                <br>Recovery: <strong>${bot.recovery}</strong>
                <br>RID: <strong>${bot.rid}</strong>
                <br>Proxy: <strong>${bot.proxy}</strong>
            `,
            showCancelButton: true,
            confirmButtonText: 'Add Bot'
        }).then((result) => {
            if (result.isConfirmed) {
                AddBot(data);
            }
        });
    }
};

const AddBot = async (data) => {
    try {
        const requests = data.map(async (item) => {
            const response = await axios.post(
                `${CONFIG.BASE_URL}/bot/add`,
                null,
                {
                    params: {
                        name: item.username,
                        password: item.password,
                        recovery: item.recovery || "",
                        mac: item.mac || "",
                        rid: item.rid || "",
                        proxy: item.proxy || ""
                    }
                }
            );
        });

        await Promise.all(requests);
        toast.success(`x${data.length} bot added!`)
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
    const [selectedRowData, setSelectedRowData] = useState([]);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        recovery: '',
        mac: '',
        rid: '',
        proxy: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
    
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                const isValidFormat = validateFileContent(content);
        
                if (isValidFormat) {
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
    
    const generateRID = () => {
        const characters = '0123456789ABCDEF';
        let rid = '';
        for (let i = 0; i < 32; i++) {
            rid += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return rid;
    };

    const generateMAC = () => {
        const mac = ['02']; // Setting the first byte to 02
        for (let i = 0; i < 5; i++) {
            const octet = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
            mac.push(octet);
        }
        return mac.join(':');
    };

    const processFileContent = (content) => {
        const lines = content.split('\n');
        return lines.map((line, index) => {
            const parts = line.split('|');
            return {
                username: parts[0],
                password: parts[1],
                recovery: parts[2],
                mac: parts[3] || generateMAC(),
                rid: parts[4] || generateRID(),
                proxy: parts[5] || '',
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

        return rowData.map(user => ({
            ...user,
            proxyCount: proxyCount[user.proxy]
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${CONFIG.BASE_URL}/bot/bot-backup`);
                const dataWithIds = response.data.map((item, index) => ({ ...item, id: index }));
                const dataWithProxyCount = countProxies(dataWithIds);

                setRowData(dataWithProxyCount);
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
        { headerName: 'Name', field: 'username', editable: true, minWidth: 250, filter: "agTextColumnFilter"},
        { headerName: 'Password', field: 'password', editable: true, minWidth: 175, filter: "agTextColumnFilter"},
        { headerName: 'Recovery', field: 'recovery', editable: true, minWidth: 250, filter: "agTextColumnFilter"},
        { headerName: 'MAC', field: 'mac', editable: true, minWidth: 150, filter: "agTextColumnFilter"},
        { headerName: 'RID', field: 'rid', editable: true, minWidth: 300, filter: "agTextColumnFilter"},
        { headerName: 'Proxy', field: 'proxy', editable: true, minWidth: 200, filter: "agTextColumnFilter"},
        { 
            headerName: '#', 
            field: 'proxyCount', 
            editable: true,
            minWidth: 100, 
            filter: "agNumberColumnFilter",
            valueFormatter: params => 'x' + params.value
        },
    ];

    const onSelectionChanged = useCallback((event) => {
        const selectedIds = event.api.getSelectedRows().map(row => row);
        setSelectedRowData(selectedIds);
        setSelectedRowIds(selectedIds.map(row => row.id));
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
            mac: formData.mac || generateMAC(),
            rid: formData.rid || generateRID(),
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
            const response = await axios.post(`${CONFIG.BASE_URL}/bot/bot-backup`, newScript, {
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
        columnDefs: columnDefs,
        defaultColDef: {
            filter: true,
            floatingFilter: true,
            menuTabs: ['generalMenuTab', 'filterMenuTab', 'columnsMenuTab'],
        },
        columnMenu: 'legacy',
        suppressMenuHide: true,
        statusBar: {
            statusPanels: [
              { statusPanel: "agSelectedRowCountComponent" },
            ],
        },
    };

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
                showModal(selectedRowData);
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner loading={isLoading} />
            </div>
        );
    }

    return (
        <div className="ag-theme-quartz-dark" style={{ height: 760, width: '100%' }}>
            <div className="p-6 bg-mainBg text-white min-h-screen overflow-x-hidden">
                <div className="bg-[#1C1C1C] p-4 rounded-lg shadow-md mb-4 border border-[#424242]">
                    <form className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4' onSubmit={handleSubmit}>
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
                    <form onSubmit={handleSubmit} className="bg-[#1C1C1C] p-6 rounded-lg shadow-md border border-[#424242]">
                        <div className="mb-4">
                            <label htmlFor="file-upload" className="block text-white font-medium mb-2">
                                Upload File:
                            </label>
                            <input
                            type="file"
                            id="file-upload"
                            accept=".txt"
                            onChange={handleFileChange}
                            className="w-full h-[45px] text-white bg-[#222628] border border-[#424242] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mt-4">
                            <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-700 text-white py-3 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                            >
                            Submit
                            </button>
                        </div>
                    </form>
                </div>
                <div className="bg-[#1C1C1C] p-4 rounded-lg shadow-md mb-4 border border-[#424242]">
                    <div id="myGrid" className="ag-theme-alpine-dark" style={{ height: 760, width: '100%' }}>
                        <AgGridReact
                            gridOptions={gridOptions}
                            rowData={rowData}
                            getRowId={(params) => String(params.data.id)}
                            getRowNodeId={(data) => data.id}
                            rowSelection={rowSelection}
                            onSelectionChanged={onSelectionChanged}
                            onCellEditingStopped={handleCellEditingStopped}
                            pagination
                            paginationPageSize={100}
                            getContextMenuItems={getContextMenuItems}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataBot;
