import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import Table from "./Table";
import Formatnumber from "./FormatNumber";
import LoadingSpinner from "./Loading";
import Swal from "sweetalert2";

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [previousData, setPreviousData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://64.72.205.239:8000/bot/get");
                setPreviousData(data); // Store current data as previous data
                setData(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData(); // Initial fetch
        const interval = setInterval(fetchData, 5000);

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

    const totalUsers = data.length;
    const totalOnline = data.filter(user => user.details.status === 'Online').length;
    const totalOffline = data.filter(user => user.details.status !== 'Online').length;
    const totalBanned = data.filter(user => user.details.status === 'Account Banned').length;
    const totalGems = data.reduce((acc, user) => acc + user.details.gems, 0);
    const totalObtained = data.reduce((acc, user) => acc + user.details.obtained_gems, 0);

    const StartRotasiALL = async () => {

        const script = `local script = read("rotasi-luci-json.lua")\nfor _,bot in pairs(getBots()) do\nif not bot:isRunningScript() then\nbot:runScript(script)\nsleep(8000)\nend\nend`;
    
        setLoading(true);

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
            setLoading(false);
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
                    <button 
                        onClick={() => StartRotasiALL()}
                        class="mb-2 text-white bg-red-500 hover:bg-red-800 focus:ring-1 focus:outline-none font-medium rounded text-sm w-full px-2.5 py-2.5 text-center"
                    >
                        START ROTASI (ALL)
                        {loading && (
                            <LoadingSpinner loading={loading}/>
                        )}
                    </button>
                    <button 
                        type="button" 
                        class="mb-2 text-white bg-red-500 hover:bg-red-800 focus:ring-1 focus:outline-none font-medium rounded text-sm w-full px-2.5 py-2.5 text-center"
                    >
                        STOP ROTASI (ALL)
                    </button>
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