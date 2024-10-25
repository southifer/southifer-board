import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import Table from "./Table";
import Formatnumber from "./FormatNumber";
import LoadingSpinner from "./Loading";
import Swal from "sweetalert2";
import InputModal from './AddBot';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [previousData, setPreviousData] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://64.72.205.239:8000/bot/get");
                setPreviousData(data); // Store current data as previous data
                setData(response.data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };

        fetchData(); // Initial fetch
        const interval = setInterval(fetchData, 2500);

        return () => clearInterval(interval); // Clear interval on unmount
    }, [data]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner loading={loading} />
                {!loading && (
                    <div className="content">
                        {/* Your main content goes here */}
                        <h1>Welcome to the App!</h1>
                    </div>
                )}
            </div>
        );
    }

    const totalOnline = data.filter(user => user.details.status === 'Online').length;
    const totalOffline = data.filter(user => user.details.status !== 'Online').length;
    const totalBanned = data.filter(user => user.details.status === 'Account Banned').length;
    const totalGems = data.reduce((acc, user) => acc + user.details.gems, 0);
    const totalObtained = data.reduce((acc, user) => acc + user.details.obtained_gems, 0);

    const StartRotasiALL = async () => {
        const script = `local script = read("rotasi-luci-json.lua")\nfor _,bot in pairs(getBots()) do\nif not bot:isRunningScript() then\nbot:runScript(script)\nsleep(8000)\nend\nend`;
        setUploading(true);
        try {
            const response = await axios.post('http://64.72.205.239:8000/bot/runScript', script, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
    
            console.log(response.status, response.data);
            if (response.status === 200) {
                const isRunning = response.data; 
                if (isRunning) {
                    Swal.fire('Success', 'Executed rotasi to all bots !', 'success'); // SweetAlert success
                } else {
                    Swal.fire('Error', 'Error executing rotasi script', 'error'); // SweetAlert error
                }
            }
        } catch (error) {
            console.error('Error stopping script:', error);
            Swal.fire('Error', 'Error stopping script.', 'error'); // SweetAlert error
        } finally {
            setUploading(false);
        }
    };

    const StopRotasiALL = async () => {
        const script = 'local script = read("rotasi-luci-json.lua")\nfor _,bot in pairs(getBots()) do\nif bot:isRunningScript() then\nbot:stopScript()\nsleep(100)\nend\nend';
        setUploading(true);
        try {
            const response = await axios.post('http://64.72.205.239:8000/bot/runScript', script, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
            if (response.status === 200) {
                const isRunning = response.data;
                if (isRunning) {
                    Swal.fire('Success', 'Stopped rotasi to all bots!', 'success');
                } else {
                    Swal.fire('Error', 'Error executing rotasi script', 'error');
                }
            }
        } catch (error) {
            Swal.fire('Error', 'Error stopping script.', 'error');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-6 bg-mainBg text-white min-h-screen overflow-x-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-widgetBg p-5 rounded-lg shadow-md">
                    <p className="flex-grow text-xs font-bold text-gray-200 mb-2 uppercase">USER STATISTIC</p>
                    <p className='text-lg'>⌐ Online: {Formatnumber(totalOnline)}</p>
                    <p className='text-lg'>⌐ Offline: {Formatnumber(totalOffline)}</p>
                    <p className='text-lg'>⌐ Banned: {Formatnumber(totalBanned)}</p>
                    <p className='text-lg'>⌐ Gems: {Formatnumber(totalGems)}</p>
                    <p className='text-lg'>⌐ Obtained Gems: {Formatnumber(totalObtained)}</p>
                </div>
                <div className="bg-widgetBg p-5 rounded-lg shadow-md">
                    <p className="flex-grow text-xs font-bold text-gray-200 mb-2 uppercase">USER STATISTIC</p>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => StartRotasiALL()}
                            class="mb-2 text-white bg-red-500 hover:bg-red-800 focus:ring-1 focus:outline-none font-medium rounded text-sm w-full px-2.5 py-2.5 text-center"
                        >
                            {uploading && (
                                <svg aria-hidden="true" role="status" className="inline w-5 h-5 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                </svg>
                            )}
                            START ROTASI (ALL)
                        </button>
                        <button
                            onClick={() => StopRotasiALL()}
                            class="mb-2 text-white bg-red-500 hover:bg-red-800 focus:ring-1 focus:outline-none font-medium rounded text-sm w-full px-2.5 py-2.5 text-center"
                        >
                            {uploading && (
                                <svg aria-hidden="true" role="status" class="inline w-5 h-5 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                </svg>
                            )}
                            STOP ROTASI (ALL)
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={async () => {
                                await Swal.fire({
                                    title: `Script Executor`,
                                    input: 'textarea',
                                    inputLabel: 'Enter your Lua script',
                                    inputPlaceholder: 'Type your Lua script here...',
                                    showCancelButton: true,
                                    confirmButtonText: 'Run Script',
                                    showLoaderOnConfirm: true,
                                    inputAttributes: {
                                        style: 'font-size: 15px;height: 500px; background-color: #0F1015; color: #FFFFFF; font-family: JetBrains Mono'
                                    },
                                    preConfirm: async (script) => {
                                        if (!script) {
                                            Swal.showValidationMessage('Please enter a script!');
                                            return;
                                        }
                                        try {
                                            const response = await axios.post('http://64.72.205.239:8000/bot/runScript', script, {
                                                headers: {
                                                    'Content-Type': 'text/plain',
                                                },
                                            });
                                            return response.data; // Return the result directly
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
                            }}
                            class="mb-2 text-white bg-red-500 hover:bg-red-800 focus:ring-1 focus:outline-none font-medium rounded text-sm w-full px-2.5 py-2.5 text-center"
                        >
                        Run Command
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <InputModal/>
                    </div>
                </div>
            </div>
            <div className="bg-widgetBg p-4 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                <div className="max-w-full overflow-x-auto custom-scrollbar">
                    <Table data={data} previousData={previousData}/>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;