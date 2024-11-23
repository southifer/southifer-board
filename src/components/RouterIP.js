import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';
import Swal from 'sweetalert2';

const RouterIP = ({usersCredential}) => {
    const [terminalLogs, setTerminalLogs] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [routerProxy, setRouterProxy] = useState([]);
    const [RouterConfig, setRouterConfig] = useState([]);
    const [selectedRowIds, setSelectedRowIds] = useState([]);

    const credentials = {
        username: usersCredential.username,
        password: usersCredential.password,
    };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://31.56.39.143:3000/view-router-list",
                    {
                        params: credentials,
                    }
                );
                if (response.data.success) {
                    const newData = response.data.routerList.map((item, index) => ({
                        list: item
                    }))
                    setRouterConfig(newData)
                }
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchData();
    }, []);

    const onSelectionChanged = useCallback((event) => {
        const selectedIds = event.api.getSelectedRows().map((row) => row);
        setSelectedRowIds(selectedIds.map((row) => row.list));
      }, []);

    const onCellValueChanged = useCallback((event) => {
        console.log('Cell value changed:', event.data);
    }, []);

    useEffect(() => {
        const storedLogs = JSON.parse(localStorage.getItem('terminalLogs')) || [];
        setTerminalLogs(storedLogs);
    }, []);

    useEffect(() => {
        if (terminalLogs.length > 0) {
            localStorage.setItem('terminalLogs', JSON.stringify(terminalLogs));
        }
    }, [terminalLogs]);

    const checkProxy = async () => {
        function doesIpValid(ip) {
            const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            return ipPattern.test(ip);
        }
    
        if (RouterConfig.length === 0) {
            setTerminalLogs(prevLogs => [...prevLogs, '❌ Router config is empty!']);
            return;
        }
    
        setTerminalLogs(prevLogs => [...prevLogs, '✅ Reloading data']);
    
        try {
            const nonDuplicate = new Set();
    
            setTerminalLogs(prevLogs => [...prevLogs, '✅ Validating IP']);
            console.log(RouterConfig)
            RouterConfig.forEach(item => {
                if (doesIpValid(item.list)) {
                    setTerminalLogs(prevLogs => [...prevLogs, `✅ ${item.list} is validated.`]);
                    nonDuplicate.add(item.list);
                }
            });
    
            for (const router of nonDuplicate) {
                const targetLink = `http://${router}:3000/gt/checkConfig`;
                try {
                    const response = await axios.get(targetLink);
                    const data = response.data;
                    const proxyList = data.result.aws;
    
                    proxyList.forEach(item => {
                        const key = item.configName;
                        const itemWithHost = { 
                            ...item, 
                            host: router,
                            newip: `http://${router}:3000/gt/newip?configName=${key}`
                        };
    
                        const existingIndex = routerProxy.findIndex(data => data[key]);
                        if (existingIndex !== -1) {
                            setRouterProxy(prevRouterProxy => {
                                const updatedRouterProxy = [...prevRouterProxy];
                                updatedRouterProxy[existingIndex] = {
                                    ...updatedRouterProxy[existingIndex],
                                    [key]: itemWithHost,
                                };
                            });
                            setTerminalLogs(prevLogs => [...prevLogs, `✅ Proxy updated for ${itemWithHost.configName}`]);
                        } else {
                            setRouterProxy(prevAwsData => [
                                ...prevAwsData,
                                { [key]: itemWithHost }
                            ]);
                            setTerminalLogs(prevLogs => [...prevLogs, `✅ Proxy inserted for ${itemWithHost.configName}`]);
                        }
                    });
    
                    setTerminalLogs(prevLogs => [...prevLogs, `✅ Router inserted : ${router}`]);
                } catch (error) {
                    setTerminalLogs(prevLogs => [...prevLogs, `❌ Error fetching config for ${router} => ${error.message}`]);
                }
            }
            setTerminalLogs(prevLogs => [...prevLogs, '✅ Proxy data has been saved!']);
        } catch (error) {
            setTerminalLogs(prevLogs => [...prevLogs, `❌ Error: ${error.message}`]);
        }
    };

    const fetchConfig = async (config) => {
        let errorCount = 0;
        while (true) {
            try {
                const response = await axios.get(config);
                const data = response.data;

                if (data.success && (
                    data.result.newIp.startsWith('98.') ||
                    data.result.newIp.startsWith('75.')
                )) {
                    setTerminalLogs(prevLogs => [...prevLogs, `✅ Specific ip found! New ip: ${data.result.newIp}`]);
                    break;
                }
                errorCount = 0;
                setTerminalLogs(prevLogs => [...prevLogs, `❌ New ip: ${data.result.newIp}, Execution : ${data.executionTime}. Skipping...`]);

            } catch (error) {
                if (errorCount === 5) {
                    setTerminalLogs(prevLogs => [...prevLogs, `❌ Error 5 times, skipping...`]);
                }
                setTerminalLogs(prevLogs => [...prevLogs, `❌ Error fetching data: ${error.message}`]);
            }
        }
    }

    const parseConfig = (config) => {
        const parts = config.split('-');
        const start = parseInt(parts[0], 10);
        const end = parseInt(parts[1], 10);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    const singleMode = async (config) => {
        const number = parseInt(config, 10);
        const item = routerProxy.find(data => data[`AC-${config}`])

        if (!item) {
            setTerminalLogs(prevLogs => [...prevLogs, `❌ No data found for index : ${number}`]);
            return;
        }

        setTerminalLogs(prevLogs => [...prevLogs, `✅ Processing item with config name: AC-${config}`]);
        await fetchConfig(item[`AC-${config}`].newip)
    }

    const rangeMode = async (config) => {
        const numbers = parseConfig(config);
        for (const number of numbers) {
            await singleMode(number.toString());
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    const mixedMode = async (config) => {
        const parts = config.split('/');
        for (const part of parts) {
            if (part.includes('-')) {
                await rangeMode(part);
            } else {
                await singleMode(part);
            }
        }
    }

    const requestIp = async () => {
        if (routerProxy.length === 0) {
            setTerminalLogs(previous => [...previous, '❌ Data is None, updating data...'])
            await checkProxy();
        }

        if (userInput.includes('-')) {
            rangeMode(userInput)
        } else if (userInput.includes('/')) {
            mixedMode(userInput)
        } else {
            singleMode(userInput)
        }
    }

    const addServer = async () => {
        try {
            // Trigger SweetAlert to input the router (hostname)
            const { value: router } = await Swal.fire({
                title: "Enter Router Hostname",
                input: "text",
                inputAttributes: {
                    autocapitalize: "off"
                },
                showCancelButton: true,
                confirmButtonText: "Add Router",
                showLoaderOnConfirm: true,
                preConfirm: async (router) => {
                    if (!router) {
                        Swal.showValidationMessage("Router hostname is required");
                        return false;
                    }
                    return router;
                },
                allowOutsideClick: () => !Swal.isLoading()
            });
    
            if (!router) return;
    
            const credentials = {
                username: usersCredential.username,
                password: usersCredential.password,
            };

            await axios.post("http://31.56.39.143:3000/add-router", {
                ...credentials,
                router
            });

            Swal.fire({
                icon: 'success',
                title: 'Router Added!',
                text: "Router has been added to database!",
            });

            setRouterConfig([...RouterConfig, {list: router}])
        } catch (error) {
            console.error("Error adding router:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: "Something went wrong. Please try again.",
            });
        }
    };

    const columnDefs = [
        { field: 'list', width: 800, editable: true, enableCellChangeFlash: true, filter: "agTextColumnFilter"},
    ];

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
            menuTabs: ['generalMenuTab', 'columnsMenuTab', 'filterMenuTab'],
            resizable: true,
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
        }
    };

    const getContextMenuItems = (params) => [
        {
            name: 'Delete',
            action: () => {
                removeData();
            }
        },
        "separator",
        "copy",
    ]

    const removeData = async () => {
        if (selectedRowIds.length === 0) {
            toast.warning("No data selected!");
            return;
        }
    
        const selectedLogRow = selectedRowIds.length;
        const mapRemovedData = RouterConfig.filter((row) =>
            selectedRowIds.includes(row.list)
        );
        const mapNewestData = RouterConfig.filter(
            (row) => !selectedRowIds.includes(row.list)
        );
    
        const credentials = {
            username: usersCredential.username,
            password: usersCredential.password,
        };
    
        const fetchPromise = mapRemovedData.map((item) =>
            axios.delete("http://31.56.39.143:3000/remove-router", {
                data: { ...credentials, router: item.list },
            })
        );
    
        toast.promise(Promise.all(fetchPromise), {
            pending: `Deleting x${selectedLogRow} router...`,
            success: "Bots deleted successfully!",
            error: "Failed to delete router. Please try again.",
        });
    
        try {
            await Promise.all(fetchPromise);
            setRouterConfig(mapNewestData);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <div className="p-6 bg-mainBg text-white min-h-screen overflow-x-hidden">
                <div className="bg-widgetBg p-4 rounded shadow-md mb-4">
                    <div className='bg-[#0F1015] h-[500px] border border-[#424242] p-4 rounded-sm shadow-md'>
                        <h1 className="flex items-center text-xs font-bold text-gray-400 mb-2 uppercase">
                            terminal
                        </h1>
                        <div className="overflow-y-auto h-[450px]">
                            {terminalLogs.map((row, index) => (
                                <div key={index} className='flex items-center text-sm text-gray-100'>
                                    {row}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className=" flex items-center mb-4 border border-[#424242]">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            className="focus:outline-none p-2 rounded bg-[#0F1015] text-white flex-1"
                            placeholder="Enter value"
                        />
                        <button
                            onClick={() => {
                                localStorage.setItem('terminalLogs', JSON.stringify([]));
                                setTerminalLogs([]);
                            }}
                            className="px-2 py-2 bg-violet-500 text-white rounded hover:bg-violet-800"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                        </svg>

                        </button>
                    </div>
                    <div className="flex flex-col sm:flex-row-reverse sm:flex-wrap items-center gap-2">
                        <button 
                            onClick={requestIp}
                            className="flex items-center px-4 py-2 bg-violet-500 text-white rounded-sm hover:bg-violet-700 w-full sm:w-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                            change ip
                        </button>
                        <button 
                            onClick={checkProxy}
                            className="flex items-center px-4 py-2 bg-violet-500 text-white rounded-sm hover:bg-violet-700 w-full sm:w-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>

                            reload
                        </button>
                        <button 
                            onClick={addServer}
                            className="flex items-center px-4 py-2 bg-violet-500 text-white rounded-sm hover:bg-violet-700 w-full sm:w-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                                <path fillRule="evenodd" d="M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 0 1-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0 1 13.5 1.5H15a3 3 0 0 1 2.663 1.618ZM12 4.5A1.5 1.5 0 0 1 13.5 3H15a1.5 1.5 0 0 1 1.5 1.5H12Z" clipRule="evenodd" />
                                <path d="M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 0 1 9 10.5v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0 1 16.5 18v2.625c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625v-12Z" />
                                <path d="M10.5 10.5a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963 5.23 5.23 0 0 0-3.434-1.279h-1.875a.375.375 0 0 1-.375-.375V10.5Z" />
                            </svg>

                            add server
                        </button>
                    </div>
                </div>
                <div className='ag-theme-quartz-dark h-[400px]'>
                    <ToastContainer
                        position='bottom-center'
                        autoClose={2000}
                        theme="dark"
                    />
                    <AgGridReact
                        gridOptions={gridOptions}
                        rowData={RouterConfig}
                        columnDefs={columnDefs}
                        rowSelection={rowSelection}
                        getRowId={(params) => params.data.list}
                        pagination
                        onCellValueChanged={onCellValueChanged}
                        getContextMenuItems={getContextMenuItems}

                        onSelectionChanged={onSelectionChanged}
                    />
                </div>
            </div>
        </div>
    );
}

export default RouterIP;