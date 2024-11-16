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
import CONFIG from './config/Config.json';

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
    const [loading, setLoading] = useState(true);
    const previousRowDataRef = useRef([]);

    useEffect(() => {
        document.title = 'Controller';
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${CONFIG.BASE_URL}/bot/get`);
                setRowData(response.data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch data. Check network or server.');
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, []);
    
    useEffect(() => {
        rowData.forEach((row, index) => {
            const previousRow = previousRowDataRef.current[index]?.details;

            if (previousRow) {
                if (previousRow.status === "connected" && row.details.status !== "connected") {
                    toast.error(`${row.details.name} disconnected`, {
                        theme: "colored",
                        position: "bottom-right",
                        pauseOnFocusLoss: false
                    });

                }
                if (previousRow.status !== "connected" && row.details.status === "connected") {
                    toast.success(`${row.details.name} connected`, {
                        theme: "colored",
                        position: "bottom-right",
                        pauseOnFocusLoss: false
                    });
                }
            }
        });

        previousRowDataRef.current = rowData;
    }, [rowData]);

    const maladySpritesMap = useMemo(() => ({
        'Torn Punching Muscle': TornSprites,
        'Gem Cuts': GemsCutSprites,
        'Grumbleteeth': GrumbleTeethSprites,
        'Chicken Feet': ChickenFeetSprites,
        'Brainworms': BrainwormsSprites,
    }), []);
    
    const MaladySprites = React.memo(({ malady }) => (
        <img src={maladySpritesMap[malady] || ClearSprites} alt={malady || 'Clear'} />
    ));
    
    const columnDefs = [
        {
            field: 'is_script_run',
            width: 50,
            filter: false,
            headerName: "⚡",
            enableCellChangeFlash: true,
            menuTabs: []
        },
        {
            field: 'is_account_secured',
            width: 50,
            filter: false,
            headerName: "🔒",
            enableCellChangeFlash: true,
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
            cellStyle: params => {
                return {
                    backgroundColor: params.value === "connected" ? '#33cc2244' : '#cc333344',
                    
                };
            },
            valueFormatter: (params) => {
                return params.value ? params.value.toUpperCase() : '';
            }
        },
        { 
            field: 'google_status', 
            width: 150,
            enableCellChangeFlash: true,
            valueFormatter: (params) => {
                return params.value ? params.value.toUpperCase() : '';
            }
        },
        { 
            field: 'mail', 
            width: 250,
            enableCellChangeFlash: true
        },
        { 
            field: 'world', 
            width: 200,
            enableCellChangeFlash: true,
            filter: "agTextColumnFilter"
        },
        { 
            field: 'task', 
            width: 225,
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
            cellRenderer: (params) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <MaladySprites malady={params.value} />
                    <span style={{ marginLeft: '5px' }}>{params.value}</span>
                </div>
            )
        },
        { 
            field: 'malady_expiration',
            headerName: "Malady Expiration",
            width: 240,
            enableCellChangeFlash: true,
            filter: "agNumberColumnFilter",
            valueFormatter: (params) => GetExactTime(params.value)
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

    const rowSelection = useMemo(() => { 
        return {
            mode: 'multiRow',
            checkboxes: true,
            headerCheckbox: true,
            enableClickSelection: true,
        };
    }, []);

    const getRowId = (params) => String(params.data.index);
    
    const gridOptions = {
        columnDefs: columnDefs,
        defaultColDef: {
            filter: true,
            floatingFilter: true,
            menuTabs: ['generalMenuTab', 'filterMenuTab', 'columnsMenuTab'], // Set the menu tabs
        },
        columnMenu: 'legacy',
        suppressMenuHide: true,
        animateRows: true,
        statusBar: {
            statusPanels: [
              { statusPanel: "agSelectedRowCountComponent" },
            ],
        },
    };
    
    const onSelectionChanged = useCallback((event) => {
        const selectedIds = event.api.getSelectedRows().map(row => row.index);
        setSelectedRowIds(selectedIds);
    }, []);

    const formatScript = (script) => {
        if (selectedRowIds.length > 0) {
            return `
            local bots = {${selectedRowIds.map(item => item).join(', ')}}
            for _,i in pairs(bots) do
                local bot = getBot(i)
                ${script}
            end`;
        } else {
            return script;
        }
    };

    const selectedIndex = () => `{${selectedRowIds.join(',')}}`;

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
    

    const getContextMenuItems = (params) => {
        if (!params.node.data) {
            return [
                {
                    name: 'Test Command',
                    action: () => {
                        alert(selectedIndex())
                    }
                },
                {
                    name: 'Run Command',
                    action: async () => {
                        await Swal.fire({
                            input: 'textarea',
                            inputLabel: 'Enter your Lua script',
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
                                    const response = await axios.post(`${CONFIG.BASE_URL}/bot/runScript`, script, {
                                        headers: {
                                            'Content-Type': 'text/plain',
                                        },
                                    });
                                    return response.data;

                                } catch (error) {
                                    Swal.showValidationMessage(`Error: ${error.message}`);
                                }
                            },
                            allowOutsideClick: () => !Swal.isLoading(),
                        }).then((result) => {
                            if (result.isConfirmed) {
                                Swal.fire({
                                    icon: 'info',
                                    text: result.value === 'nil' ? 'Script Executed!' : result.value
                                });
                            }
                        });
                    }
                },
            ]
        }
        return [
            {
                name: 'Reconnect',
                action: () => {
                    const commandInterface = new Command(selectedIndex(), '');
                    commandInterface.reconnectBot();
                }
            },
            {
                name: 'Disconnect',
                action: () => {
                    const commandInterface = new Command(selectedIndex(), '');
                    commandInterface.disconnectBot();
                }
            },
            {
                name: 'Warp',
                action: async () => {
                    await Swal.fire({
                        input: 'text',
                        inputLabel: 'Enter world name',
                        inputPlaceholder: 'Enter world name',
                        confirmButtonText: 'Warp',
                        showLoaderOnConfirm: true,
                        inputAttributes: {
                            style: 'border: #424242 1px solid;background-color: #0F1015; color: #FFFFFF; font-family: JetBrains Mono'
                        },
                        preConfirm: async (world) => {
                            if (!world) {
                                Swal.showValidationMessage('Please enter world name!');
                                return;
                            }
                            const script = `
                                bot = getBot(${params.node.data.index})
                                bot:warp(${world})
                            `
                            try {
                                await axios.post(`${CONFIG.BASE_URL}/bot/runScript`, formatScript(script), {
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
                    .map(log => `<div style="text-size: 8px;">${parseDisplayName(log)}</div>`)
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
                        inputValue: selectedRowIds.length > 0 ? '' : `bot = getBot(${params.node.data.index})\n`,
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
                                const response = await axios.post(`${CONFIG.BASE_URL}/bot/runScript`, formatScript(script), {
                                    headers: {
                                        'Content-Type': 'text/plain',
                                    },
                                });
                                return response.data;
    
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
                    const commandInterface = new Command(selectedIndex(), '');
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
                            const commandInterface = new Command(selectedIndex(), '');
                            commandInterface.startLeveling();
                            
                        },
                    },
                    {
                        name: 'Stop',
                        action: () => {
                            const commandInterface = new Command(selectedIndex(), '');
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
                            const commandInterface = new Command(selectedIndex(), '');
                            commandInterface.startRotasi();
                            
                        },
                    },
                    {
                        name: 'Stop',
                        action: () => {
                            const commandInterface = new Command(selectedIndex(), '');
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
                            const commandInterface = new Command(selectedIndex(), '');
                            commandInterface.startTutorial();
                            
                        },
                    },
                    {
                        name: 'Stop',
                        action: () => {
                            const commandInterface = new Command(selectedIndex(), '');
                            commandInterface.stopTutorial();
                        },
                    }
                ],
            },
            "separator",
            {
                name: 'View Details',
                action: async () => {
                    try {
                        const response = await axios.get(`${CONFIG.BASE_URL}/bot/bot-backup`);
                        const specificEmail = params.node.data.mail;
                        const botData = response.data.find(bot => bot.username === specificEmail);
            
                        if (botData) {
                            Swal.fire({
                                title: 'Bot details',
                                html: `
                                <table style="width: 100%; text-align: left; border-collapse: collapse; font-family: Nunito, sans-serif; color: #FFFFFF; border-radius: 15%;">
                                    <tr style="background-color: #1C1C1C;">
                                        <td style="padding: 8px; border: 0.5px solid #ddd;">Name</td>
                                        <td style="padding: 8px; border: 0.5px solid #ddd;">${botData.username}</td>
                                    </tr>
                                    <tr style="background-color: #1C1C1C;">
                                        <td style="padding: 8px; border: 0.5px solid #ddd;">Password</td>
                                        <td style="padding: 8px; border: 0.5px solid #ddd;">${botData.password}</td>
                                    </tr>
                                    <tr style="background-color: #1C1C1C;">
                                        <td style="padding: 8px; border: 0.5px solid #ddd;">Recovery</td>
                                        <td style="padding: 8px; border: 0.5px solid #ddd;">${botData.recovery}</td>
                                    </tr>
                                    <tr style="background-color: #1C1C1C;">
                                        <td style="padding: 8px; border: 0.5px solid #ddd;">MAC</td>
                                        <td style="padding: 8px; border: 0.5px solid #ddd;">${botData.mac}</td>
                                    </tr>
                                    <tr style="background-color: #1C1C1C;">
                                        <td style="padding: 8px; border: 0.5px solid #ddd;">RID</td>
                                        <td style="padding: 8px; border: 0.5px solid #ddd;">${botData.rid}</td>
                                    </tr>
                                    <tr style="background-color: #1C1C1C;">
                                        <td style="padding: 8px; border: 0.5px solid #ddd;">Proxy</td>
                                        <td style="padding: 8px; border: 0.5px solid #ddd;">${botData.proxy}</td>
                                    </tr>
                                </table>
                            `,
                                showCancelButton: false,
                                confirmButtonText: 'OK',
                                customClass: {
                                    popup: 'swal2-addbot' // Apply custom class to the modal
                                }
                            });                            
                        }
                    } catch (error) {
                        console.error("Error fetching bot data:", error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to retrieve bot data. Please try again later.',
                        });
                    }
                }
            },            
            "separator",
            "copy",
            {
                name: 'Remove',
                action: () => {
                    const commandInterface = new Command(selectedIndex(), '');
                    commandInterface.removeBot();
                }
            },
        ];
    }


    const totals = rowData.reduce((acc, user) => {
        const { status, gems, obtained_gems } = user.details;

        acc.totalGems += gems;
        acc.totalObtained += obtained_gems;

        switch (status) {
            case 'connected':
            case 'changing_subserver':
                acc.totalOnline += 1;
                break;
            case 'account_banned':
                acc.totalBanned += 1;
                break;
            default:
                acc.totalOffline += 1;
                break;
        }

        return acc;
    }, { totalOnline: 0, totalOffline: 0, totalBanned: 0, totalGems: 0, totalObtained: 0 });

    const { totalOnline, totalOffline, totalBanned, totalGems, totalObtained } = totals;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner loading={loading} />
            </div>
        );
    }

    return (
        <div className="p-6 bg-mainBg text-white min-h-screen overflow-x-hidden">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                <div className="grid  w-full">
                    <div className="bg-[#1C1C1C] border border-[#424242] p-4 md:p-5 rounded-lg shadow-md">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <div className="p-4 text-gray-700 border border-[#424242]">
                                <p className="text-xs font-bold text-gray-200 mb-3 uppercase">✅ total online</p>
                                <p className="text-xl font-bold text-gray-200">⌐ Online: {FormatNumber(totalOnline)}</p>
                            </div>
                            <div className="p-4 text-gray-700 border border-[#424242]">
                                <p className="text-xs font-bold text-gray-200 mb-3 uppercase">❌ total offline</p>
                                <p className="text-xl font-bold text-gray-200">⌐ Offline: {FormatNumber(totalOffline)}</p>
                            </div>
                            <div className="p-4 text-gray-700 border border-[#424242]">
                                <p className="text-xs font-bold text-gray-200 mb-3 uppercase">☠️ total banned</p>
                                <p className="text-xl font-bold text-gray-200">⌐ Banned: {totalBanned}</p>
                            </div>
                            <div className="p-4 text-gray-700 border border-[#424242]">
                                <p className="text-xs font-bold text-gray-200 mb-3 uppercase">💎 total gems</p>
                                <p className="text-xl font-bold text-gray-200">⌐ Gems: {FormatNumber(totalGems)}</p>
                            </div>
                            <div className="p-4 text-gray-700 border border-[#424242]">
                                <p className="text-xs font-bold text-gray-200 mb-3 uppercase">💰 total obtained</p>
                                <p className="text-xl font-bold text-gray-200">⌐ Obtained Gems: {FormatNumber(totalObtained)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AG Grid Section */}
                <div className="col-span-1 md:col-span-5 bg-[#1C1C1C] border border-[#424242] p-4 md:p-5 rounded-lg shadow-md w-full h-[700px] md:h-[800px] ag-theme-alpine-dark">
                    <ToastContainer />
                    <AgGridReact
                        getRowNodeId={(data) => data.id}
                        gridOptions={gridOptions}
                        rowData={rowData.map((item, index) => ({
                            id: index,
                            ...item.details
                        }))}
                        pagination
                        columnDefs={columnDefs}
                        rowSelection={rowSelection}
                        getRowId={getRowId}
                        onSelectionChanged={onSelectionChanged}
                        getContextMenuItems={getContextMenuItems}
                    />
                </div>
            </div>
        </div>

    );
    
};

export default Controller;