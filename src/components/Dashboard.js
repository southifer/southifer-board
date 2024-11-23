import { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import { ToastContainer, toast } from "react-toastify"; // Optional: for user notifications
import { Tooltip } from "@mui/material";
import Swal from "sweetalert2";
import Cookies from 'js-cookie';
import FormatNumber from "./FormatNumber";
import AuthAPI from "./config/Config.json";

const Dashboard = ({ serverData, credentials, setServerList }) => {
    const credential = credentials
    const [inputValue, setInputValue] = useState(serverData);
    const [serverStats, setServerStats] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const promises = serverData.map((server) =>
                    axios.get(`http://${server}:8000/bot/get`)
                );
                
                const responses = await Promise.all(promises);
                setServerStats(responses);
            } catch(error) {
                console.error(error);
            }
        };
    
        fetchData();
        const interval = setInterval(fetchData, 8000);
        return () => clearInterval(interval);
    }, [serverData]);

    const calculateTotalsForServers = (serverStats) => {
        return serverStats.map((serverResponse) => {
            if (!serverResponse || !serverResponse.data) return {}; // Skip invalid responses
    
            const totals = serverResponse.data.reduce((acc, user) => {
                const { status, gems } = user.details;

                acc.totalGems += gems;

                acc.totalBot += 1;

                switch (status) {
                    case "connected":
                    case "changing_subserver":
                        acc.totalOnline += 1;
                        break;
                    case "account_banned":
                        acc.totalBanned += 1;
                        break;
                    default:
                        acc.totalOffline += 1;
                        break;
                }
    
                return acc;
            }, { totalOnline: 0, totalOffline: 0, totalBanned: 0, totalGems: 0, totalBot: 0 }); // Add initial value for totalBot
    
            return totals; // Return the totals for this particular server
        });
    };    

    useEffect(() => {
        document.title = 'Dashboard';
        setInputValue(serverData);
    }, [serverData]);

    const handleInputChange = (event, index) => {
        const updatedValues = [...inputValue];
        updatedValues[index] = event.target.value; // Update specific index
        setInputValue(updatedValues);
    };

    const handleAdd = async () => {
        try {
            const { value: newServer } = await Swal.fire({
                icon: 'question',
                title: 'Enter New Server',
                input: 'text',
                inputPlaceholder: 'Enter the server name',
                showCancelButton: true,
                confirmButtonText: 'Add Server',
                cancelButtonText: 'Cancel',
                inputValidator: (value) => {
                    if (!value) {
                        return 'Server name is required!';
                    }
                }
            });

            if (newServer) {
                await axios.post(`https://${AuthAPI.BASE_URL}/add-server`, {
                    username: credential.username,
                    password: credential.password,
                    server: String(newServer),
                });
                
                const updatedServerList = await axios.get(`https://${AuthAPI.BASE_URL}/server`, {
                    params: {
                        username: credential.username,
                        password: credential.password
                    }
                });
    
                setServerList(updatedServerList.data.serverList);
                toast.success(`Server ${newServer} added successfully.`);
            }
        } catch (error) {
            console.error("Failed to add server:", error);
            toast.error("Failed to add server.");
        }
    };
    
    const handleDelete = async (index) => {
        const serverToRemove = inputValue[index];
    
        try {
            // Send DELETE request to remove a server
            await axios.delete(`http://${AuthAPI.BASE_URL}/delete-server`, {
                data: { 
                    username: credential.username,
                    password: credential.password,
                    server: serverToRemove 
                },
            });
    
            // Fetch the updated server list from /server endpoint
            const updatedServerList = await axios.get(`http://${AuthAPI.BASE_URL}/server`, {
                params: {
                    username: credential.username,
                    password: credential.password
                }
            });
    
            setServerList(updatedServerList.data.serverList);
            setInputValue(updatedServerList.data.serverList);
            toast.success(`Server ${serverToRemove} removed successfully.`);
        } catch (error) {
            console.error("Failed to delete server:", error);
            toast.error("Failed to delete server.");
        }
    };

    const handleSync = async () => {
        const fetchPromise = axios.get(`https://${AuthAPI.BASE_URL}/server`, {
            params: {
                username: credential.username,
                password: credential.password
            }
        });

        toast.promise(fetchPromise, {
            pending: "Synchronizing data...",
            success: "Success!",
            error: "Failed to synchronizing server list!",
        });

        try {
            const response = await fetchPromise;
            setInputValue(response.data.serverList);
        } catch (error) {
            console.error("Failed to synchronize server list:", error);
            toast.error("Failed to synchronize server list.");
        }
    };
    

    const userLogout = () => {
        toast.success('Logouting...')
        Cookies.remove('isLoggedIn');
        window.location.reload();
    }

    const serverTotals = calculateTotalsForServers(serverStats);

    return (
        <div className="p-6 bg-mainBg text-white min-h-screen overflow-x-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                <div className="bg-widgetBg p-4 rounded shadow-md ">
                    <h1 className="flex items-center text-xs font-bold text-gray-400 mb-2 uppercase">
                        server api
                    </h1>
                    {inputValue.map((element, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                type="text"
                                value={element}
                                onChange={(event) => handleInputChange(event, index)}
                                className="text-gray-300 w-full p-2 bg-[#111827] rounded  focus:outline-none"
                                placeholder="Enter Base URL"
                            />
                            <button
                                onClick={() => handleDelete(index)}
                                className="ml-1 bg-red-600 hover:bg-red-700 text-white py-2 px-2 rounded"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-gray-100">
                                    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    <div className="flex flex-row gap-5">
                        <Tooltip title="Synchronize data?" arrow placement="top">
                            <button onClick={handleSync}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-gray-400">
                                <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clipRule="evenodd" />
                            </svg>

                            </button>
                        </Tooltip>
                        <Tooltip title="Add data?" arrow placement="top">
                            <button onClick={handleAdd}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-7 text-gray-400">
                                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </Tooltip>
                    </div>
                </div>
                <div className="bg-widgetBg p-4 rounded shadow-md ">
                    <h1 className="flex items-center text-xs font-bold text-gray-400 mb-2 uppercase">
                        User Information
                    </h1>
                    <div className="text-gray-300">
                        <p>username : {credentials.username}</p>
                        <p>password : {credentials.password}</p>
                        {credentials.username === "admin" && <p>API : <strong>{AuthAPI.BASE_URL}</strong></p>}
                    </div>
                </div>
            </div>
            <div className="bg-widgetBg p-4 rounded shadow-md mb-4">
                <h1 className="flex items-center text-xs font-bold text-gray-400 mb-2 uppercase">
                    Server list
                </h1>
                {serverData.map((server, index) => {
                    const totals = serverTotals[index] || {};
                    return (
                        <div key={index} className="bg-[#111827] p-4 rounded shadow-md mb-2">
                            <h3 className="text-sm uppercase mb-2 text-gray-300">🎯 - {server}</h3>
                            <div className="font-sans select-none text-[13px] sm:text-lg md:text-lg lg:text-lg text-gray-300 rounded items-center space-x-2 p-1.5">
                                <span>🤖 {FormatNumber(totals.totalBot || 0)}</span>
                                <span>✅ {FormatNumber(totals.totalOnline || 0)}</span>
                                <span>❌ {FormatNumber(totals.totalOffline || 0)}</span>
                                <span>☠️ {FormatNumber(totals.totalBanned || 0)}</span>
                                <span>💎 {FormatNumber(totals.totalGems || 0)}</span>
                            </div>
                        </div>
                    
                    )
                })}
            </div>
            <ToastContainer 
                position='bottom-center'
                autoClose={2000}
                theme="dark"
            />
            <div className="flex flex-row-reverse">
                <Tooltip title="Logout" arrow placement="top">
                    <button onClick={userLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-7 text-gray-400">
                            <path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" />
                        </svg>
                    </button>
                </Tooltip>
            </div>
        </div>
        
    );
    
};

export default Dashboard;
