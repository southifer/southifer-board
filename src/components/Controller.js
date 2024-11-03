import React, {useMemo, useState, useEffect, useCallback, useRef} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AgGridReact } from 'ag-grid-react';
import LoadingSpinner from "./Loading";
import Interface from './api/Interface';
import Command from './api/Command';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';

import TornSprites from './img/Torn.png'
import GemsCutSprites from './img/gems-cut.png'
import GrumbleTeethSprites from './img/grumble_teeth.png'
import ChickenFeetSprites from './img/chicken-feet.png'
import BrainwormsSprites from './img/brain-worms.png'
import ClearSprites from './img/moyai.png'
import FormatNumber from './FormatNumber';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MaladySprites = (malady) => {
    switch (malady) {
        case 'Torn Punching Muscle':
            return <img src={TornSprites} alt="Torn" />;
        case 'Gem Cuts':
            return <img src={GemsCutSprites} alt="Gems Cut" />;
        case 'Grumbleteeth':
            return <img src={GrumbleTeethSprites} alt="Grumble Teeth" />;
        case 'Chicken Feet':
            return <img src={ChickenFeetSprites} alt="Chicken Feet" />;
        case 'Brainworms':
            return <img src={BrainwormsSprites} alt="Chicken Feet" />;
        default:
            return <img src={ClearSprites} alt="Clear" />;
    }
};

const GetExactTime = (second) => {
    if (second === 0) {
        return '';
    }
    const hours = Math.floor(second / 3600);
    const minutes = Math.floor((second % 3600) / 60);
    const secs = second % 60;

    return `${hours} hours ${minutes} minutes ${secs} seconds`;
};

const Controller = () => {
    const [rowData, setRowData] = useState([]);
    const [selectedRowIds, setSelectedRowIds] = useState([]);
    const [selectedCount, setSelectedCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const previousRowDataRef = useRef([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://191.96.94.35:8000/bot/get");

                setRowData(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 2000);

        return () => clearInterval(interval);
    }, [rowData]);

    useEffect(() => {
        rowData.forEach((row, index) => {
            const previousRow = previousRowDataRef.current[index]?.details;

            if (previousRow) {
                if (previousRow.status === "connected" && row.details.status !== "connected") {
                    toast.error(`${row.details.name} disconnected`, {
                        theme: "colored",
                        icon: '❌'
                    });
                }
                if (previousRow.status !== "connected" && row.details.status === "connected") {
                    toast.success(`${row.details.name} connected`, {
                        theme: "colored",
                        icon: '✅'
                    });
                }
            }
        });

        // Update the ref to store the current rowData for future comparisons
        previousRowDataRef.current = rowData;
    }, [rowData]);

    function cellClass(params) {
        if (!params.value) {
            return ''; // or a default class if you prefer
        }
        return params.value.toLowerCase() === "connected" ? "rag-green" : "rag-red";
    };

    const columnDefs = [
        {
            field: 'is_script_run',
            width: 50,
            filter: false,
            headerName: "⚡",
            menuTabs: []
        },
        {
            field: 'is_account_secured',
            width: 50,
            filter: false,
            headerName: "🔒",
            menuTabs: []
        },
        { 
            field: 'name', 
            width: 150, 
            enableCellChangeFlash: true,
            filter: "agTextColumnFilter"
        },
        { 
            field: 'level', 
            width: 100,
            enableCellChangeFlash: true,
            filter: "agNumberColumnFilter",
            valueFormatter: params => 'Lv. ' + params.value
        },
        { 
            field: 'age', 
            width: 100,
            enableCellChangeFlash: true,
            filter: "agNumberColumnFilter",
            valueFormatter: params => params.value + ' days'
        },
        { 
            field: 'ping', 
            width: 100,
            enableCellChangeFlash: true,
            filter: "agNumberColumnFilter",
            valueFormatter: params => params.value + ' ms'
        },
        { 
            field: 'status', 
            width: 175,
            enableCellChangeFlash: true,
            cellClass: cellClass,
            valueFormatter: (params) => {
                return params.value ? params.value.toUpperCase() : '';
            }
        },
        { 
            field: 'google_status', 
            width: 175,
            enableCellChangeFlash: true,
            valueFormatter: (params) => {
                return params.value ? params.value.toUpperCase() : '';
            }
        },
        { 
            field: 'world', 
            width: 200,
            enableCellChangeFlash: true,
            filter: "agTextColumnFilter"
        },
        { 
            field: 'task', 
            width: 200,
            enableCellChangeFlash: true
        },
        { 
            field: 'online_time', 
            width: 150,
            enableCellChangeFlash: true,
            filter: "agTextColumnFilter"
        },
        {
            field: 'malady',
            width: 225,
            enableCellChangeFlash: true,
            cellRenderer: (params) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {MaladySprites(params.value)}
                        <span style={{ marginLeft: '5px' }}>{params.value}</span>
                    </div>
                );
            }
        },
        { 
            field: 'malady_expiration',
            headerName: "Malady Expiration",
            width: 240,
            enableCellChangeFlash: true,
            filter: "agNumberColumnFilter",
            valueFormatter: (params) => {
                return GetExactTime(params.value);
            }
        },
        { 
            field: 'proxy', 
            width: 200,
            enableCellChangeFlash: true,
            filter: "agTextColumnFilter"
        },
        { 
            field: 'position', 
            width: 150,
            enableCellChangeFlash: true,
            filter: "agTextColumnFilter"
        },
        { 
            field: 'gems', 
            width: 150, 
            enableCellChangeFlash: true,
            filter: "agNumberColumnFilter",
            valueFormatter: params => '💎 ' + FormatNumber(params.value)
        },
        {
            field: 'obtained_gems',
            headerName: 'Obtained Gems',
            filter: "agNumberColumnFilter",
            enableCellChangeFlash: true,
            valueFormatter: params => '⚜️ ' + FormatNumber(params.value)
        },
        {
            field: 'mac',
            headerName: 'MAC',
            filter: "agTextColumnFilter",
        },
        {
            field: 'rid',
            headerName: 'RID',
            width: 250,
            filter: "agTextColumnFilter",
        }
    ];

    const onColumnStateChanged = (event) => {
        const columnState = event.columnApi.getColumnState();
        localStorage.setItem('columnDefs', JSON.stringify(columnState));
    };

    const rowSelection = useMemo(() => { 
        return {
            mode: 'multiRow',
            checkboxes: true,
            headerCheckbox: true,
            enableClickSelection: true,
        };
    }, []);

    const getRowId = (params) => params.data.index;
    
    const gridOptions = {
        columnDefs: columnDefs,
        defaultColDef: {
            filter: true,
            floatingFilter: true,
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'], // Set the menu tabs
        },
        columnMenu: 'legacy',
        suppressMenuHide: true,
    };

    const totals = rowData.reduce((acc, user) => {
        const status = user.details.status;
        
        acc.totalGems += user.details.gems;
        acc.totalObtained += user.details.obtained_gems;
    
        if (status === 'connected' || status === "changing_subserver") {
            acc.totalOnline += 1;
        } else if (status === 'account_banned') {
            acc.totalBanned += 1;
        } else {
            acc.totalOffline += 1;
        }
    
        return acc;
    }, { totalOnline: 0, totalOffline: 0, totalBanned: 0, totalGems: 0, totalObtained: 0 });

    const { totalOnline, totalOffline, totalBanned, totalGems, totalObtained } = totals;

    const onSelectionChanged = useCallback((event) => {
        const selectedIds = event.api.getSelectedRows().map(row => row.index);
        setSelectedRowIds(selectedIds);
        setSelectedCount(selectedIds.length); // Update selected count
    }, []);

    const selectedRowNames = selectedRowIds.length > 0 
    ?   `local bots = {${selectedRowIds.map(item => item).join(', ')}}\n\nfor _,i in pairs(bots) do\nlocal bot = getBot(i)\n\nend`
    : '';

    const parseDisplayName = (displayName) => {
        const growtopiaColors = {
            '`0': '#ffffff',
            '`1': '#adf4ff',
            '`2': '#49fc00',
            '`3': '#bfdaff',
            '`4': '#ff271d',
            '`5': '#ebb7ff',
            '`6': '#ffca6f',
            '`7': '#e6e6e6',
            '`8': '#ff9445',
            '`9': '#ffee7d',
            '`!': '#d1fff9',
            '`@': '#ffcdc9',
            '`#': '#ff8ff3',
            '`$': '#fffcc5',
            '`^': '#b5ff97',
            '`&': '#feebff',
            '`w': '#ffffff',
            '`o': '#fce6ba',
            '`b': '#000000',
            '`p': '#ffdff1',
            '`q': '#0c60a4',
            '`e': '#19b9ff',
            '`r': '#6fd357',
            '`t': '#2f830d',
            '`a': '#515151',
            '`s': '#9e9e9e',
            '`c': '#50ffff',
            '`ì': '#ffe119',
        };
    
        const regex = /(`[0-9!@#^&wobpqertascì$])([^`]*)/g;
    
        const parsed = displayName.replace(regex, (match, colorCode, text) => {
            const color = growtopiaColors[colorCode];
            if (color) {
                return `<span style="color:${color}">${text}</span>`;
            } else {
                return text;
            }
        });
    
        // Remove unnecessary backticks by replacing double backticks with a single space
        const cleanedParsed = parsed.replace(/``/g, '').replace(/`/g, '').replace(/\$/g, ''); // Remove $ character
    
        return cleanedParsed.endsWith('``') ? cleanedParsed.slice(0, -2) : cleanedParsed;
    };
    

    const getContextMenuItems = (params) => [
        {
            name: 'Reconnect',
            action: () => {
                const commandInterface = new Command(params.node.data.index, '');
                commandInterface.reconnectBot();
            }
        },
        {
            name: 'Disconnect',
            action: () => {
                const commandInterface = new Command(params.node.data.index, '');
                commandInterface.disconnectBot();
            }
        },
        {
            name: 'Remove',
            action: () => {
                const commandInterface = new Command(params.node.data.index, '');
                commandInterface.removeBot();
            }
        },
        "separator",
        {
            name: 'Inventory',
            subMenu: params.node.data.inventory.map((item) => ({
                name: `${item.name} (x${item.amount})`,
                subMenu: [
                    {
                        name: 'Trash',
                        action: () => {
                            const interfaceInstance = new Interface(params.node.data.index, item.id); // Create instance with index and item ID
                            interfaceInstance.trash(); // Call the trash method
                        },
                    },
                    {
                        name: 'Wear',
                        action: () => {
                            const interfaceInstance = new Interface(params.node.data.index, item.id);
                            interfaceInstance.wear(); // Call the wear method
                        },
                    },
                    {
                        name: 'Drop',
                        action: () => {
                            const interfaceInstance = new Interface(params.node.data.index, item.id);
                            interfaceInstance.drop(); // Call the drop method
                        },
                    },
                ],
                })),
            },
            
        {
            name: 'Logs',
            action: () => {
                const logContent = params.node.data.console
                .map(log => `<div class="text-[#C6BD9E] text-xs">${parseDisplayName(log)}</div>`)
                .join('');

                const newWindow = window.open('', 'Logs', 'width=1200,height=600');
                newWindow.document.write(`
                    <html>
                        <head>
                            <title>Logs</title>
                            <style>
                                body {
                                    font-family: 'Fira Code', sans-serif;
                                    background-color: black;
                                    color: white;
                                    padding: 20px;
                                }
                            </style>
                        </head>
                        <body>
                            <h1 class="text-lg font-bold">Logs</h1>
                            ${logContent}
                        </body>
                    </html>
                `);
                newWindow.document.close(); // Close the document to render the content
            },
        },
        "separator",
        {
            name: 'Run Command',
            action: async () => {
                await Swal.fire({
                    input: 'textarea',
                    inputLabel: 'Enter your Lua script',
                    inputValue: `bot = getBot(${params.node.data.index})\n`,
                    inputPlaceholder: 'Type your Lua script here...',
                    showCancelButton: true,
                    confirmButtonText: 'Run Script',
                    showLoaderOnConfirm: true,
                    inputAttributes: {
                        style: 'border: #424242 1px solid;font-size: 15px;height: 400px; background-color: #0F1015; color: #FFFFFF; font-family: JetBrains Mono'
                    },
                    customClass: {
                        popup: 'swal2-executor', // Optional: Add custom class if you want to style the modal
                    },
                    preConfirm: async (script) => {
                        if (!script) {
                            Swal.showValidationMessage('Please enter a script!');
                            return;
                        }
                        try {
                            await axios.post('http://191.96.94.35:8000/bot/runScript', script, {
                                headers: {
                                    'Content-Type': 'text/plain',
                                },
                            });
                        } catch (error) {
                            Swal.showValidationMessage(`Error: ${error.message}`);
                        }
                    },
                    allowOutsideClick: () => !Swal.isLoading(),
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire({
                            title: 'result',
                            text: result.value === 'nil' ? 'Script Executed!' : result.value
                        });
                    }
                });
            }
        },
        {
            name: 'Stop Script',
            action: () => {
                const commandInterface = new Command(params.node.data.index, '');
                commandInterface.stopScript();
            }
        },
        "separator",
        {
            name: 'Leveling',
            subMenu: [
                {
                    name: 'Start',
                    action: () => {
                        const commandInterface = new Command(params.node.data.index, '');
                        commandInterface.startLeveling();
                        
                    },
                },
                {
                    name: 'Stop',
                    action: () => {
                        const commandInterface = new Command(params.node.data.index, '');
                        commandInterface.stopScript();
                    },
                }
            ]
        },
        {
            name: 'Rotasi',
            subMenu: [
                {
                    name: 'Start',
                    action: () => {
                        const commandInterface = new Command(params.node.data.index, '');
                        commandInterface.startRotasi();
                        
                    },
                },
                {
                    name: 'Stop',
                    action: () => {
                        const commandInterface = new Command(params.node.data.index, '');
                        commandInterface.stopScript();
                    },
                }
            ]
        },
        {
            name: 'Tutorial',
            subMenu: [
                {
                    name: 'Start',
                    action: () => {
                        const commandInterface = new Command(params.node.data.index, '');
                        commandInterface.startTutorial();
                        
                    },
                },
                {
                    name: 'Stop',
                    action: () => {
                        const commandInterface = new Command(params.node.data.index, '');
                        commandInterface.stopTutorial();
                    },
                }
            ],
        },
        "separator",
        "copy",
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner loading={loading} />
            </div>
        );
    }
    
    return (
        <div className="p-4 md:p-6 bg-mainBg text-white overflow-x-hidden">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 mb-4">
                <div className="col-span-1 bg-[#1C1C1C] border border-[#424242] p-4 md:p-5 rounded-lg shadow-md">
                    <div className="bg-[#1C1C1C] p-4 md:p-5 rounded-lg shadow-md border border-[#424242] mb-4">
                        <p className="text-xs font-bold text-gray-200 mb-2 uppercase">User Statistics</p>
                        <p className="text-sm">⌐ Online: {FormatNumber(totalOnline)}</p>
                        <p className="text-sm">⌐ Offline: {FormatNumber(totalOffline)}</p>
                        <p className="text-sm">⌐ Banned: {FormatNumber(totalBanned)}</p>
                        <p className="text-sm">⌐ Gems: {FormatNumber(totalGems)}</p>
                        <p className="text-sm">⌐ Obtained Gems: {FormatNumber(totalObtained)}</p>
                    </div>
                </div>
                <div className="col-span-1 md:col-span-4 bg-[#1C1C1C] border border-[#424242] p-4 md:p-5 rounded-lg shadow-md w-full h-[800px] md:h-[800px] ag-theme-alpine-dark">
                    {/* <div className="flex md:col-span-2 gap-2">
                        <p>selected bots: <u>x{selectedCount}</u></p>
                    </div> */}
                    <ToastContainer />
                    <AgGridReact
                        gridOptions={gridOptions}
                        rowData={rowData.map((item, index) => ({
                            id: index,
                            ...item.details
                        }))}
                        pagination
                        columnDefs={columnDefs} 
                        rowSelection={rowSelection}
                        getRowId={getRowId}
                        onColumnStateChanged={onColumnStateChanged}
                        onSelectionChanged={onSelectionChanged}
                        getContextMenuItems={getContextMenuItems}
                    />
                </div>
            </div>
        </div>
    );
    
};

export default Controller;