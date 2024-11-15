import { useState, useMemo } from 'react';
import RouterConfig from './config/Router.json';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';

const RouterIP = () => {
    const [terminalLogs, setTerminalLogs] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [routerProxy, setRouterProxy] = useState([]);

    const checkProxy = async () => {
        function doesIpValid(ip) {
            const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            return ipPattern.test(ip);
        }
    
        if (RouterConfig.router.length === 0) {
            setTerminalLogs(prevLogs => [...prevLogs, '❌ Router config is empty!']);
            return;
        }
    
        setTerminalLogs(prevLogs => [...prevLogs, '✅ Reloading data']);
    
        try {
            const nonDuplicate = new Set();
    
            setTerminalLogs(prevLogs => [...prevLogs, '✅ Validating IP']);
    
            RouterConfig.router.forEach(item => {
                if (doesIpValid(item)) {
                    setTerminalLogs(prevLogs => [...prevLogs, `✅ ${item} is validated.`]);
                    nonDuplicate.add(item);
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

    return (
        <div className="ag-theme-quartz-dark" style={{ height: 760, width: '100%' }}>
            <div className="p-6 bg-mainBg text-white min-h-screen overflow-x-hidden">
                <div className="bg-[#1C1C1C] p-4 rounded-lg shadow-md mb-4 border border-[#424242]">
                    {/* {RouterConfig.router.map(item => item)} */}
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
                            onClick={() => setTerminalLogs([])}
                            className="px-2 py-2 bg-red-500 text-white rounded hover:bg-red-800"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                        </svg>

                        </button>
                    </div>
                    <div className="flex flex-col sm:flex-row-reverse sm:flex-wrap items-center gap-2">
                        <button 
                            onClick={requestIp}
                            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-sm hover:bg-red-700 w-full sm:w-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                            change ip
                        </button>
                        <button 
                        onClick={checkProxy}
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-sm hover:bg-red-700 w-full sm:w-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>

                            reload
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RouterIP;