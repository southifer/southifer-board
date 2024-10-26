import React, {useMemo, useState, useEffect, useRef} from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';

import TornSprites from './img/Torn.png'
import GemsCutSprites from './img/gems-cut.png'
import GrumbleTeethSprites from './img/grumble_teeth.png'
import ChickenFeetSprites from './img/chicken-feet.png'
import BrainwormsSprites from './img/brain-worms.png'
import ClearSprites from './img/moyai.png'
import FormatNumber from './FormatNumber';
import Canvas from './OffCanvas';

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
    const gridRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://64.72.205.239:8000/bot/get");
                setRowData(response.data);

            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 2000);

        return () => clearInterval(interval);
    }, [rowData]);

    const columnDefsFromStorage = localStorage.getItem('columnDefs');
    const columnDefs = [
        { 
            field: 'name', 
            width: 150, 
            enableCellChangeFlash: true
        },
        { 
            field: 'level', 
            width: 100,
            enableCellChangeFlash: true,
            valueFormatter: params => 'Lv. ' + params.value
        },
        { 
            field: 'age', 
            width: 100,
            enableCellChangeFlash: true,
            valueFormatter: params => params.value + ' days'
        },
        { 
            field: 'ping', 
            width: 100,
            enableCellChangeFlash: true,
            valueFormatter: params => params.value + ' ms'
        },
        { 
            field: 'status', 
            width: 175,
            enableCellChangeFlash: true,
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
            valueFormatter: (params) => {
                return GetExactTime(params.value);
            }
        },
        { 
            field: 'proxy', 
            width: 200,
            enableCellChangeFlash: true
        },
        { 
            field: 'world', 
            width: 200,
            enableCellChangeFlash: true
        },
        { 
            field: 'online_time', 
            width: 150,
            enableCellChangeFlash: true
        },
        { 
            field: 'task', 
            width: 150,
            enableCellChangeFlash: true
        },
        { 
            field: 'position', 
            width: 150,
            enableCellChangeFlash: true
        },
        { 
            field: 'gems', 
            width: 150, 
            enableCellChangeFlash: true,
            valueFormatter: params => '💎 ' + FormatNumber(params.value)
        },
        {
            field: 'obtained_gems',
            headerName: 'Obtained Gems',
            valueFormatter: params => '⚜️ ' + FormatNumber(params.value)
        },
        {
            field: 'mac',
            headerName: 'MAC',
            hide: true
        },
        {
            field: 'rid',
            headerName: 'RID',
            hide: true
        },
        {
            field: 'is_account_secured',
            headerName: "Account Secured",
        },
        {
            field: 'is_script_run',
            headerName: "Script Status",
        },
    ];

    const onColumnStateChanged = (event) => {
        const columnState = event.columnApi.getColumnState();
        localStorage.setItem('columnDefs', JSON.stringify(columnState));
    };
    useEffect(() => {
        if (columnDefsFromStorage) {
            gridRef.current.api.setColumnState(JSON.parse(columnDefsFromStorage));
        }
    }, [gridRef]);

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
    
        if (status === 'connected') {
            acc.totalOnline += 1;
        } else if (status === 'account_banned') {
            acc.totalBanned += 1;
        } else {
            acc.totalOffline += 1;
        }
    
        return acc;
    }, { totalOnline: 0, totalOffline: 0, totalBanned: 0, totalGems: 0, totalObtained: 0 });

    const { totalOnline, totalOffline, totalBanned, totalGems, totalObtained } = totals;

    return (
        <div className="p-6 bg-mainBg text-white min-h-screen overflow-x-hidden">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                <div className="bg-widgetBg p-5 rounded-lg shadow-md">
                    <div className="bg-[#28313E] p-5 rounded-lg shadow-mdborder border-[#434B56]">
                        <p className="flex-grow text-xs font-bold text-gray-200 mb-2 uppercase">USER STATISTIC</p>
                        <p className='text-lg'>⌐ Online: {FormatNumber(totalOnline)}</p>
                        <p className='text-lg'>⌐ Offline: {FormatNumber(totalOffline)}</p>
                        <p className='text-lg'>⌐ Banned: {FormatNumber(totalBanned)}</p>
                        <p className='text-lg'>⌐ Gems: {FormatNumber(totalGems)}</p>
                        <p className='text-lg'>⌐ Obtained Gems: {FormatNumber(totalObtained)}</p>
                    </div>
                </div>
                <div className="bg-widgetBg p-5 rounded-lg shadow-md w-full h-[800px] ag-theme-quartz-dark">
                    <AgGridReact
                        gridOptions={gridOptions}
                        rowData={rowData.map((item, index) => ({
                            id: index,
                            ...item.details
                        }))}
                        
                        columnDefs={columnDefs} 
                        rowSelection={rowSelection}
                        getRowId={getRowId}
                        onColumnStateChanged={onColumnStateChanged}
                    />
                </div>
            </div>
        </div>
    );
};

export default Controller;