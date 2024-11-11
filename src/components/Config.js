import axios from 'axios';
import React, { useEffect, useState } from 'react';
import LoadingSpinner from './Loading';
import Swal from 'sweetalert2';
import CONFIG from './config/Config.json'

const Config = () => {
    const [config, setConfig] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${CONFIG.BASE_URL}/bot/config`);
                setConfig(response.data);
            } catch (error) {
                setError('Error fetching config data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner loading={loading} />
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    const updateConfig = async (sc) => {
        const newScript = `${JSON.stringify(sc, null, 2)}`; // Convert config object to JSON string
        try {
            const response = await axios.post(`${CONFIG.BASE_URL}/bot/config`, newScript);
            
            // Show success notification when the response is returned
            Swal.fire({
                title: "info",
                text: response.data,
                icon: "success"
            });
            
            return response;
        } catch (error) {
            console.error('Error updating config:', error); // Log any errors
            Swal.fire({
                title: "The Internet?",
                text: error,
                icon: "warning"
            });
        }
    };

    return (
        <div className="p-6 bg-mainBg text-white min-h-screen overflow-x-hidden">
            <div className="gap-6 mb-4 flex items-center justify-center ">
                <div className="bg-[#28313E] p-5 rounded-lg shadow-md">
                    <form className="">

                        {/* Farming settings div */}
                        <div className='mb-10 p-6 bg-[#28313E] border border-[#434B56] text-white  overflow-x-hidden rounded-lg'>
                            <p className="text-center text-lg font-bold text-gray-300 uppercase">farming settings</p>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">farm List file</p>
                                    <div className="w-full">
                                        <input 
                                        type="text"
                                        value={config.world_list}
                                        onChange={(e) => setConfig({ ...config, world_list: e.target.value })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">Move Interval</p>
                                    <div className="w-full">
                                        <input 
                                        type="number"
                                        value={config.move_interval}
                                        onChange={(e) => setConfig({ ...config, move_interval: parseInt(e.target.value) })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">Move Range</p>
                                    <div className="w-full">
                                        <input 
                                        type="number"
                                        value={config.move_range}
                                        onChange={(e) => setConfig({ ...config, move_range: parseInt(e.target.value) })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">Item Id</p>
                                    <div className="w-full">
                                        <input 
                                        type="number"
                                        value={config.item_id}
                                        onChange={(e) => setConfig({ ...config, item_id: parseInt(e.target.value) })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">Item Seed</p>
                                    <div className="w-full">
                                        <input 
                                        type="number"
                                        value={config.item_seed}
                                        onChange={(e) => setConfig({ ...config, item_seed: parseInt(e.target.value) })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">Show Animation</p>
                                    <div className="inline-flex items-center">
                                        <label className="flex items-center cursor-pointer relative">
                                            <input 
                                                type="checkbox" 
                                                checked={config.show_animation}
                                                onChange={(e) => setConfig({ ...config, show_animation: e.target.checked })}
                                                className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-blue-700 checked:border-slate-800" 
                                                id="check"
                                            />
                                            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                </svg>
                                            </span>
                                        </label>
                                    </div> 
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">Fresh Bot</p>
                                    <div className="inline-flex items-center">
                                        <label className="flex items-center cursor-pointer relative">
                                            <input 
                                                type="checkbox" 
                                                checked={config.fresh_bot}
                                                onChange={(e) => setConfig({ ...config, fresh_bot: e.target.checked })}
                                                className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-blue-700 checked:border-slate-800" 
                                                id="check"
                                            />
                                            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                </svg>
                                            </span>
                                        </label>
                                    </div> 
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">Auto Fill</p>
                                    <div className="inline-flex items-center">
                                        <label className="flex items-center cursor-pointer relative">
                                            <input 
                                                type="checkbox" 
                                                checked={config.auto_fill}
                                                onChange={(e) => setConfig({ ...config, auto_fill: e.target.checked })}
                                                className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-blue-700 checked:border-slate-800" 
                                                id="check"
                                            />
                                            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                </svg>
                                            </span>
                                        </label>
                                    </div> 
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">Take Pickaxe</p>
                                    <div className="inline-flex items-center">
                                        <label className="flex items-center cursor-pointer relative">
                                            <input 
                                                type="checkbox" 
                                                checked={config.take_pickaxe}
                                                onChange={(e) => setConfig({ ...config, take_pickaxe: e.target.checked })}
                                                className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-blue-700 checked:border-slate-800" 
                                                id="check"
                                            />
                                            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                </svg>
                                            </span>
                                        </label>
                                    </div> 
                                </div>
                            </div>

                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">Storage Seed</p>
                                    <div className="w-full">
                                        <textarea
                                            name="storage_seed_list"
                                            value={config.storage_seed_list.join('\r\n') || ''}
                                            onChange={(e) => {
                                                const newList = e.target.value.split('\r\n'); // Split the textarea value into an array
                                                setConfig({ ...config, storage_seed_list: newList }); // Update the state
                                            }}
                                            className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">Storage Pack</p>
                                    <div className="w-full">
                                        <textarea
                                            name="storage_pack_list"
                                            value={config.storage_pack_list.join('\r\n') || ''}
                                            onChange={(e) => {
                                                const newList = e.target.value.split('\r\n'); // Split the textarea value into an array
                                                setConfig({ ...config, storage_pack_list: newList }); // Update the state
                                            }}
                                            className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">Storage Item</p>
                                    <div className="w-full">
                                        <textarea
                                            name="storage_item_list"
                                            value={config.storage_item_list.join('\r\n') || ''}
                                            onChange={(e) => {
                                                const newList = e.target.value.split('\r\n'); // Split the textarea value into an array
                                                setConfig({ ...config, storage_item_list: newList }); // Update the state
                                            }}
                                            className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">Storage Vile</p>
                                    <div className="w-full">
                                        <textarea
                                            name="storage_vile_list"
                                            value={config.storage_vile_list.join('\r\n') || ''}
                                            onChange={(e) => {
                                                const newList = e.target.value.split('\r\n'); // Split the textarea value into an array
                                                setConfig({ ...config, storage_vile_list: newList }); // Update the state
                                            }}
                                            className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">harvest delay</p>
                                    <div className="w-full">
                                        <input 
                                        type="number"
                                        value={config.interval.harvest}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            interval: { 
                                                ...config.interval, 
                                                harvest: parseInt(e.target.value) // or use parseFloat for decimal values
                                            }
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">plant delay</p>
                                    <div className="w-full">
                                        <input 
                                        type="number"
                                        value={config.interval.plant}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            interval: { 
                                                ...config.interval, 
                                                plant: parseInt(e.target.value) // or use parseFloat for decimal values
                                            }
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">punch delay</p>
                                    <div className="w-full">
                                        <input 
                                        type="number"
                                        value={config.interval.punch}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            interval: { 
                                                ...config.interval, 
                                                punch: parseInt(e.target.value) // or use parseFloat for decimal values
                                            }
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">place delay</p>
                                    <div className="w-full">
                                        <input 
                                        type="number"
                                        value={config.interval.place}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            interval: { 
                                                ...config.interval, 
                                                place: parseInt(e.target.value) // or use parseFloat for decimal values
                                            }
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">warp delay</p>
                                    <div className="w-full">
                                        <input 
                                        type="number"
                                        value={config.interval.warp}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            interval: { 
                                                ...config.interval, 
                                                warp: parseInt(e.target.value) // or use parseFloat for decimal values
                                            }
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">connect delay</p>
                                    <div className="w-full">
                                        <input 
                                        type="number"
                                        value={config.interval.connect}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            interval: { 
                                                ...config.interval, 
                                                connect: parseInt(e.target.value) // or use parseFloat for decimal values
                                            }
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">execute delay</p>
                                    <div className="w-full">
                                        <input 
                                        type="number"
                                        value={config.interval.execute}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            interval: { 
                                                ...config.interval, 
                                                execute: parseInt(e.target.value) // or use parseFloat for decimal values
                                            }
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">custom break tile</p>
                                    <div className="inline-flex items-center">
                                        <label className="flex items-center cursor-pointer relative">
                                            <input 
                                                type="checkbox" 
                                                checked={config.custom_tile}
                                                onChange={(e) => setConfig({ ...config, custom_tile: e.target.checked })}
                                                className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-blue-700 checked:border-slate-800" 
                                                id="check"
                                            />
                                            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                </svg>
                                            </span>
                                        </label>
                                    </div> 
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">pnb in home</p>
                                    <div className="inline-flex items-center">
                                        <label className="flex items-center cursor-pointer relative">
                                            <input 
                                                type="checkbox" 
                                                checked={config.pnb_home_world}
                                                onChange={(e) => setConfig({ ...config, pnb_home_world: e.target.checked })}
                                                className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-blue-700 checked:border-slate-800" 
                                                id="check"
                                            />
                                            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                </svg>
                                            </span>
                                        </label>
                                    </div> 
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">pnb in otherworld</p>
                                    <div className="inline-flex items-center">
                                        <label className="flex items-center cursor-pointer relative">
                                            <input 
                                                type="checkbox" 
                                                checked={config.pnb_other_world}
                                                onChange={(e) => setConfig({ ...config, pnb_other_world: e.target.checked })}
                                                className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-blue-700 checked:border-slate-800" 
                                                id="check"
                                            />
                                            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                </svg>
                                            </span>
                                        </label>
                                    </div> 
                                </div>
                            </div>

                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">world break list</p>
                                    <div className="w-full">
                                        <input 
                                        type="text"
                                        value={config.world_list_pnb}
                                        onChange={(e) => setConfig({ ...config, world_list_pnb: e.target.checked })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">custom x</p>
                                    <div className="w-full">
                                        <input 
                                        type="number"
                                        value={config.custom_x}
                                        onChange={(e) => setConfig({ ...config, custom_x: parseInt(e.target.checked) })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">custom y</p>
                                    <div className="w-full">
                                        <input 
                                        type="number"
                                        value={config.custom_y}
                                        onChange={(e) => setConfig({ ...config, custom_y: parseInt(e.target.checked) })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">tile number</p>
                                    <div className="w-full">
                                        <input 
                                        type="number"
                                        value={config.tile_number}
                                        onChange={(e) => setConfig({ ...config, tile_number: parseInt(e.target.checked) })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Malady settings */}
                        <div className='mb-10 p-6 bg-[#28313E] border border-[#434B56] text-white overflow-x-hidden rounded-lg'>
                            <p className="text-center text-lg font-bold text-gray-300 mb-4 uppercase">malady settings</p>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">enable malady</p>
                                    <div className="inline-flex items-center">
                                        <label className="flex items-center cursor-pointer relative">
                                            <input 
                                                type="checkbox" 
                                                checked={config.malady.enable}
                                                onChange={(e) => setConfig({ ...config, malady: { ...config.malady, enable: e.target.checked } })}
                                                className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-blue-700 checked:border-slate-800" 
                                                id="check"
                                            />
                                            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                </svg>
                                            </span>
                                        </label>
                                    </div> 
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">enable infecting</p>
                                    <div className="inline-flex items-center">
                                        <label className="flex items-center cursor-pointer relative">
                                            <input 
                                                type="checkbox" 
                                                checked={config.malady.infect}
                                                onChange={(e) => setConfig({ ...config, malady: { ...config.malady, infect: e.target.checked } })}
                                                className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-blue-700 checked:border-slate-800" 
                                                id="check"
                                            />
                                            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                </svg>
                                            </span>
                                        </label>
                                    </div> 
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">vial item id</p>
                                    <div className="w-full">
                                        <input 
                                            type="number"
                                            value={config.malady.id}
                                            onChange={(e) => setConfig({ ...config, malady: { ...config.malady, id: parseInt(e.target.checked) } })}
                                            className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">webhook channel url</p>
                                    <div className="w-full">
                                        <input 
                                        type="text"
                                        value={config.malady.webhook.url}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            malady: { 
                                                ...config.malady, 
                                                webhook: { 
                                                    ...config.malady.webhook, 
                                                    url: e.target.value 
                                                }
                                            }
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">webhook message id</p>
                                    <div className="w-full">
                                        <input 
                                        type="text"
                                        value={config.malady.webhook.id}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            malady: { 
                                                ...config.malady, 
                                                webhook: { 
                                                    ...config.malady.webhook, 
                                                    id: e.target.value 
                                                }
                                            }
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                            </div>


                            <p className="text-center text-lg font-bold text-gray-300 mb-4 uppercase">torn settings</p>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">torn surgery world</p>
                                    <div className="w-full">
                                        <input 
                                        type="text"
                                        value={config.malady.location["1"].world}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            malady: { 
                                                ...config.malady, 
                                                location: { 
                                                    ...config.malady.location, 
                                                    "1": { 
                                                        ...config.malady.location["1"], 
                                                        world: e.target.value 
                                                    }
                                                }
                                            }
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">torn surgery x position</p>
                                    <div className="w-full">
                                        <input 
                                        type="number"
                                        value={config.malady.location["1"].x}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            malady: { 
                                                ...config.malady, 
                                                location: { 
                                                    ...config.malady.location, 
                                                    "1": { 
                                                        ...config.malady.location["1"], 
                                                        x: parseInt(e.target.value) 
                                                    }
                                                }
                                            }
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">torn surgery y position</p>
                                    <div className="w-full">
                                        <input 
                                        type="number"
                                        value={config.malady.location["1"].y}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            malady: { 
                                                ...config.malady, 
                                                location: { 
                                                    ...config.malady.location, 
                                                    "1": { 
                                                        ...config.malady.location["1"], 
                                                        y: parseInt(e.target.value) 
                                                    }
                                                }
                                            }
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                            </div>


                            <p className="text-center text-lg font-bold text-gray-300 mb-4 uppercase">gems cut settings</p>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">gems cut surgery world</p>
                                    <div className="w-full">
                                        <input 
                                        type="text"
                                        value={config.malady.location["2"].world}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            malady: { 
                                                ...config.malady, 
                                                location: { 
                                                    ...config.malady.location, 
                                                    "2": { 
                                                        ...config.malady.location["2"], 
                                                        world: e.target.value 
                                                    }
                                                }
                                            }
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">gems cut surgery x position</p>
                                    <div className="w-full">
                                        <input 
                                        type="number"
                                        value={config.malady.location["2"].x}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            malady: { 
                                                ...config.malady, 
                                                location: { 
                                                    ...config.malady.location, 
                                                    "2": { 
                                                        ...config.malady.location["2"], 
                                                        x: parseInt(e.target.value) 
                                                    }
                                                }
                                            }
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">gems cut surgery y position</p>
                                    <div className="w-full">
                                        <input 
                                        type="number"
                                        value={config.malady.location["2"].y}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            malady: { 
                                                ...config.malady, 
                                                location: { 
                                                    ...config.malady.location, 
                                                    "2": { 
                                                        ...config.malady.location["2"], 
                                                        y: parseInt(e.target.value)
                                                    }
                                                }
                                            }
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Auto rest settings */}
                        <div className='mb-10 p-6 bg-[#28313E] border border-[#434B56] text-white overflow-x-hidden rounded-lg'>
                            <p className="text-center text-lg font-bold text-gray-300 mb-4 uppercase">auto rest settings</p>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">enable auto rest</p>
                                    <div className="inline-flex items-center">
                                        <label className="flex items-center cursor-pointer relative">
                                            <input 
                                                type="checkbox" 
                                                checked={config.auto_rest.enable}
                                                onChange={(e) => setConfig({ 
                                                    ...config, 
                                                    auto_rest: { 
                                                        ...config.auto_rest, 
                                                        enable: e.target.checked 
                                                    } 
                                                })}
                                                className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-blue-700 checked:border-slate-800" 
                                                id="check"
                                            />
                                            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                </svg>
                                            </span>
                                        </label>
                                    </div> 
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">disconnect on rest</p>
                                    <div className="inline-flex items-center">
                                        <label className="flex items-center cursor-pointer relative">
                                            <input 
                                                type="checkbox" 
                                                checked={config.auto_rest.disconnect_rest}
                                                onChange={(e) => setConfig({ 
                                                    ...config, 
                                                    auto_rest: { 
                                                        ...config.auto_rest, 
                                                        disconnect_rest: e.target.checked 
                                                    } 
                                                })}
                                                className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-blue-700 checked:border-slate-800" 
                                                id="check"
                                            />
                                            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                </svg>
                                            </span>
                                        </label>
                                    </div> 
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">auto rest duration</p>
                                    <div className="w-full">
                                        <input 
                                        type="number"
                                        value={config.auto_rest.duration}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            auto_rest: { 
                                                ...config.auto_rest, 
                                                duration: parseInt(e.target.value )
                                            } 
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">auto rest interval</p>
                                    <div className="w-full">
                                        <input 
                                        type="number"
                                        value={config.auto_rest.interval}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            auto_rest: { 
                                                ...config.auto_rest, 
                                                interval: parseInt(e.target.value)
                                            } 
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Auto wear settings */}
                        <div className='mb-10 p-6 bg-[#28313E] border border-[#434B56] text-white overflow-x-hidden rounded-lg'>
                            <p className="text-center text-lg font-bold text-gray-300 mb-4 uppercase">auto wear settings</p>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">enable auto wear</p>
                                    <div className="inline-flex items-center">
                                        <label className="flex items-center cursor-pointer relative">
                                            <input 
                                                type="checkbox" 
                                                checked={config.auto_wear.enable}
                                                onChange={(e) => setConfig({ 
                                                    ...config, 
                                                    auto_wear: { 
                                                        ...config.auto_wear, 
                                                        enable: e.target.checked // Update id directly under auto_wear
                                                    } 
                                                })}
                                                className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-blue-700 checked:border-slate-800" 
                                                id="check"
                                            />
                                            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                </svg>
                                            </span>
                                        </label>
                                    </div> 
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">enable auto buy item</p>
                                    <div className="inline-flex items-center">
                                        <label className="flex items-center cursor-pointer relative">
                                            <input 
                                                type="checkbox" 
                                                checked={config.auto_wear.buy.enable}
                                                onChange={(e) => setConfig({ 
                                                    ...config, 
                                                    auto_wear: { 
                                                        ...config.auto_wear, 
                                                        buy: { 
                                                            ...config.auto_wear.buy, 
                                                            enable: e.target.checked 
                                                        } 
                                                    } 
                                                })}
                                                className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-blue-700 checked:border-slate-800" 
                                                id="check"
                                            />
                                            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                </svg>
                                            </span>
                                        </label>
                                    </div> 
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">auto wear buy price</p>
                                    <div className="w-full">
                                        <input 
                                        type="number"
                                        value={config.auto_wear.buy.price}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            auto_wear: { 
                                                ...config.auto_wear, 
                                                buy: { 
                                                    ...config.auto_wear.buy, 
                                                    price: parseInt(e.target.value )
                                                } 
                                            } 
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">auto wear item id</p>
                                    <div className="w-full">
                                        <input 
                                        type="number"
                                        value={config.auto_wear.id}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            auto_wear: { 
                                                ...config.auto_wear, 
                                                id: parseInt(e.target.value)
                                            } 
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Purchase settings */}
                        <div className='mb-10 p-6 bg-[#28313E] border border-[#434B56] text-white overflow-x-hidden rounded-lg'>
                            <p className="text-center text-lg font-bold text-gray-300 mb-4 uppercase">purchase settings</p>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">debug name</p>
                                    <div className="w-full">
                                        <input 
                                        type="text"
                                        value={config.purchase.name}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            purchase: { 
                                                ...config.purchase, 
                                                name: e.target.value // Update the name directly
                                            } 
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">item list id</p>
                                    <div className="w-full">
                                        <input 
                                        type="text"
                                        value={config.purchase.list.map(item => `${item}`).join(',')}
                                        onChange={(e) => {
                                            const newList = e.target.value.split(',').map(item => item.trim()); // Split the input value into an array and trim whitespace
                                            setConfig({ 
                                                ...config, 
                                                purchase: { 
                                                    ...config.purchase, 
                                                    list: newList // Update the purchase.list in the state
                                                } 
                                            }); 
                                        }}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">purchase price</p>
                                    <div className="w-full">
                                        <input 
                                        type="number"
                                        value={config.purchase.price}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            purchase: { 
                                                ...config.purchase, 
                                                price: parseInt(e.target.value)
                                            } 
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">minimum gems</p>
                                    <div className="w-full">
                                        <input 
                                        type="number"
                                        value={config.purchase.minimum_gem}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            purchase: { 
                                                ...config.purchase, 
                                                minimum_gem: parseInt(e.target.value) // Update the name directly
                                            } 
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Auto event settings */}
                        <div className='mb-10 p-6 bg-[#28313E] border border-[#434B56] text-white overflow-x-hidden rounded-lg'>
                            <p className="text-center text-lg font-bold text-gray-300 mb-4 uppercase">auto event settings</p>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">enable auto event</p>
                                    <div className="inline-flex items-center">
                                        <label className="flex items-center cursor-pointer relative">
                                            <input 
                                                type="checkbox" 
                                                checked={config.event.enable}
                                                onChange={(e) => setConfig({ 
                                                    ...config, 
                                                    event: { 
                                                        ...config.event, 
                                                        enable: e.target.checked // Update the name directly
                                                    } 
                                                })}
                                                className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-blue-700 checked:border-slate-800" 
                                                id="check"
                                            />
                                            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                </svg>
                                            </span>
                                        </label>
                                    </div> 
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">world event</p>
                                    <div className="w-full">
                                        <input 
                                        type="text"
                                        value={config.event.world}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            event: { 
                                                ...config.event, 
                                                world: e.target.value // Update the name directly
                                            } 
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">webhook url event</p>
                                    <div className="w-full">
                                        <input 
                                        type="text"
                                        value={config.event.webhook.url}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            event: { 
                                                ...config.event, 
                                                webhook: { 
                                                    ...config.event.webhook, 
                                                    url: e.target.value // Update the webhook URL in the state
                                                } 
                                            } 
                                        })} 
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">webhook id event</p>
                                    <div className="w-full">
                                        <input 
                                        type="text"
                                        value={config.event.webhook.id}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            event: { 
                                                ...config.event, 
                                                webhook: { 
                                                    ...config.event.webhook, 
                                                    id: e.target.value // Update the webhook ID in the state
                                                } 
                                            } 
                                        })} 
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4 gap-4">
                                <p className="text-xs font-bold text-gray-200 mb-2 uppercase">auto event item id</p>

                                <div className='flex mb-2 items-center gap-2'>
                                    <button 
                                        type="button"
                                        onClick={() => setIsCollapsed(!isCollapsed)} // Toggle collapse state
                                        className="flex items-center mb-4 text-white bg-blue-600 hover:bg-blue-700 focus:ring-1 focus:outline-none font-medium rounded text-sm w-full px-2.5 py-2.5 text-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 mr-2">
                                            <path fillRule="evenodd" d="M11.47 4.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1-1.06 1.06L12 6.31 8.78 9.53a.75.75 0 0 1-1.06-1.06l3.75-3.75Zm-3.75 9.75a.75.75 0 0 1 1.06 0L12 17.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                        </svg>


                                        {isCollapsed ? 
                                        'Expand' : 
                                        'Collapse'
                                        }
                                    </button>
                                    <button 
                                        type="button"
                                        className="flex items-center mb-4 text-white bg-green-700 hover:bg-green-800 focus:ring-1 focus:outline-none font-medium rounded text-sm w-full px-2.5 py-2.5 text-center"
                                        onClick={() => {
                                            const newItem = { id: 0, count: 0 }; // Define the new item's structure
                                            const newList = [...config.event.list, newItem]; // Append the new item to the list
                                            setConfig({ ...config, event: { ...config.event, list: newList } }); // Update the state with the new list
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 mr-2">
                                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                                        </svg>
                                        Add item id
                                    </button>
                                </div>
                                {!isCollapsed && config.event.list.map((item, index) => (
                                    <div key={item.id} className="flex mb-2 items-center gap-2">
                                        <div className='w-5px bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow'>
                                            {index + 1}
                                        </div>
                                        :
                                        <input 
                                            type="number"
                                            value={item.id}
                                            onChange={(e) => {
                                                const newId = parseInt(e.target.value); // Convert the input value to a number
                                                const newList = [...config.event.list]; // Create a copy of the event list
                                                newList[index] = { ...newList[index], id: newId }; // Update the specific item's id
                                                setConfig({ ...config, event: { ...config.event, list: newList } }); // Update the state
                                            }}
                                            className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                        />
                                        <input 
                                            type="number"
                                            value={item.count}
                                            onChange={(e) => {
                                                const newCount = parseInt(e.target.value); // Convert the input value to a number
                                                const newList = [...config.event.list]; // Create a copy of the event list
                                                newList[index] = { ...newList[index], count: newCount }; // Update the specific item's count
                                                setConfig({ ...config, event: { ...config.event, list: newList } }); // Update the state
                                            }}
                                            className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                        />
                                        <button 
                                            type="button"
                                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm w-full sm:w-auto px-2.5 py-2.5 text-center"
                                            onClick={() => {
                                                const newList = config.event.list.filter((_, i) => i !== index); // Remove the item at the current index
                                                setConfig({ ...config, event: { ...config.event, list: newList } }); // Update the state with the new list
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Webhook settings */}
                        <div className='mb-10 p-6 bg-[#28313E] border border-[#434B56] text-white overflow-x-hidden rounded-lg'>
                            <p className="text-center text-lg font-bold text-gray-300 mb-4 uppercase">webhook settings</p>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">daily info</p>
                                    <div className="w-full">
                                        <input 
                                        type="text"
                                        value={config.webhook.info}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            purchase: { 
                                                ...config.webhook, 
                                                info: e.target.value // Update the name directly
                                            } 
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">pack info</p>
                                    <div className="w-full">
                                        <input 
                                        type="text"
                                        value={config.webhook.pack}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            purchase: { 
                                                ...config.webhook, 
                                                pack: e.target.value // Update the name directly
                                            } 
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">logs info</p>
                                    <div className="w-full">
                                        <input 
                                        type="text"
                                        value={config.webhook.logs}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            purchase: { 
                                                ...config.webhook, 
                                                logs: e.target.value // Update the name directly
                                            } 
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">world info</p>
                                    <div className="w-full">
                                        <input 
                                        type="text"
                                        value={config.webhook.world}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            purchase: { 
                                                ...config.webhook, 
                                                world: e.target.value // Update the name directly
                                            } 
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">bot webhook url</p>
                                    <div className="w-full">
                                        <input 
                                        type="text"
                                        value={config.webhook.bot.url}
                                        onChange={(e) => {
                                            const newUrl = e.target.value;
                                            setConfig({
                                                ...config, 
                                                webhook: { 
                                                    ...config.webhook, 
                                                    bot: { 
                                                        ...config.webhook.bot, 
                                                        url: newUrl 
                                                    }
                                                }
                                            });
                                        }}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">bot webhook id</p>
                                    <div className="w-full">
                                        <input 
                                        type="text"
                                        value={config.webhook.bot.id}
                                        onChange={(e) => {
                                            const newId = e.target.value;
                                            setConfig({
                                                ...config, 
                                                webhook: { 
                                                    ...config.webhook, 
                                                    bot: { 
                                                        ...config.webhook.bot, 
                                                        id: newId 
                                                    }
                                                }
                                            });
                                        }}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Method settings */}
                        <div className='mb-10 p-6 bg-[#28313E] border border-[#434B56] text-white overflow-x-hidden rounded-lg'>
                            <p className="text-center text-lg font-bold text-gray-300 mb-4 uppercase">Method settings</p>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">buy clothes</p>
                                    <div className="inline-flex items-center">
                                        <label className="flex items-center cursor-pointer relative">
                                            <input 
                                                type="checkbox" 
                                                checked={config.buy_clothes}
                                                onChange={(e) => setConfig({ ...config, buy_clothes: e.target.checked })}
                                                className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-blue-700 checked:border-slate-800" 
                                                id="check"
                                            />
                                            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                </svg>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">edit note profile</p>
                                    <div className="inline-flex items-center">
                                        <label className="flex items-center cursor-pointer relative">
                                            <input 
                                                type="checkbox" 
                                                checked={config.edit_note_profile}
                                                onChange={(e) => setConfig({ ...config, edit_note_profile: e.target.checked })}
                                                className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-blue-700 checked:border-slate-800" 
                                                id="check"
                                            />
                                            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                </svg>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">random chat</p>
                                    <div className="inline-flex items-center">
                                        <label className="flex items-center cursor-pointer relative">
                                            <input 
                                                type="checkbox" 
                                                checked={config.random_chat}
                                                onChange={(e) => setConfig({ ...config, random_chat: e.target.checked })}
                                                className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-blue-700 checked:border-slate-800" 
                                                id="check"
                                            />
                                            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                </svg>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">random world</p>
                                    <div className="inline-flex items-center">
                                        <label className="flex items-center cursor-pointer relative">
                                            <input 
                                                type="checkbox" 
                                                checked={config.random_world}
                                                onChange={(e) => setConfig({ ...config, random_world: e.target.checked })}
                                                className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-blue-700 checked:border-slate-800" 
                                                id="check"
                                            />
                                            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                </svg>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">enable claim goals</p>
                                    <div className="inline-flex items-center">
                                        <label className="flex items-center cursor-pointer relative">
                                            <input 
                                                type="checkbox" 
                                                checked={config.claim_goals.enable}
                                                onChange={(e) => setConfig({ 
                                                    ...config, 
                                                    claim_goals: { 
                                                        ...config.claim_goals, // Spread existing properties of claim_goals
                                                        enable: e.target.checked // Update the enable property
                                                    } 
                                                })}
                                                
                                                className="peer h-7 w-7 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-blue-700 checked:border-slate-800" 
                                                id="check"
                                            />
                                            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                </svg>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex mb-4 gap-4">
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-gray-200 mb-2 uppercase">world goals</p>
                                            <div className="w-full">
                                                <input 
                                                type="text"
                                                value={config.claim_goals.world}
                                                onChange={(e) => setConfig({ 
                                                    ...config, 
                                                    claim_goals: { 
                                                        ...config.claim_goals, // Spread existing properties of claim_goals
                                                        world: e.target.value // Update the enable property
                                                    } 
                                                })}
                                                className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex mb-4 gap-4">
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-gray-200 mb-2 uppercase">door goals</p>
                                            <div className="w-full">
                                                <input 
                                                type="text"
                                                value={config.claim_goals.doorId}
                                                onChange={(e) => setConfig({ 
                                                    ...config, 
                                                    claim_goals: { 
                                                        ...config.claim_goals, // Spread existing properties of claim_goals
                                                        doorId: e.target.value // Update the enable property
                                                    } 
                                                })}
                                                className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <div className="flex mb-4 gap-4">
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-gray-200 mb-2 uppercase">world magplant</p>
                                            <div className="w-full">
                                                <input 
                                                type="text"
                                                value={config.magplant.world}
                                                onChange={(e) => setConfig({ 
                                                    ...config, 
                                                    magplant: { 
                                                        ...config.magplant, // Spread existing properties of claim_goals
                                                        world: e.target.value // Update the enable property
                                                    } 
                                                })}
                                                className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex mb-4 gap-4">
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-gray-200 mb-2 uppercase">door magplant</p>
                                            <div className="w-full">
                                                <input 
                                                type="text"
                                                value={config.magplant.doorId}
                                                onChange={(e) => setConfig({ 
                                                    ...config, 
                                                    claim_goals: { 
                                                        ...config.claim_goals, // Spread existing properties of claim_goals
                                                        doorId: e.target.value // Update the enable property
                                                    } 
                                                })}
                                                className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex mb-4 gap-4">
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-gray-200 mb-2 uppercase">pos x magplant</p>
                                            <div className="w-full">
                                                <input 
                                                type="number"
                                                value={config.magplant.x}
                                                onChange={(e) => setConfig({ 
                                                    ...config, 
                                                    claim_goals: { 
                                                        ...config.claim_goals, // Spread existing properties of claim_goals
                                                        x: parseInt(e.target.value) // Update the enable property
                                                    } 
                                                })}
                                                className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex mb-4 gap-4">
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-gray-200 mb-2 uppercase">pos y magplant</p>
                                            <div className="w-full">
                                                <input 
                                                type="number"
                                                value={config.magplant.y}
                                                onChange={(e) => setConfig({ 
                                                    ...config, 
                                                    claim_goals: { 
                                                        ...config.claim_goals, // Spread existing properties of claim_goals
                                                        y: parseInt(e.target.value) // Update the enable property
                                                    } 
                                                })}
                                                className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='mb-10 p-6 bg-[#28313E] border border-[#434B56] text-white overflow-x-hidden rounded-lg'>
                            <p className="text-center text-lg font-bold text-gray-300 mb-4 uppercase">essential settings</p>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">whitelist item</p>
                                    <div className="w-full">
                                        <input 
                                        type="text"
                                        value={config.whitelist.join(',') || ''}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            whitelist: e.target.value.split(',').map(item => item.trim()) // Split input by commas and trim whitespace
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">chat list</p>
                                    <div className="w-full">
                                        <textarea
                                        value={config.chat_list.join(',') || ''}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            chat_list: e.target.value.split(',').map(item => item.trim()) // Split by commas and trim whitespace
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex mb-4 gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-200 mb-2 uppercase">chat list</p>
                                    <div className="w-full">
                                        <textarea
                                        value={config.emote_list.join(',') || ''}
                                        onChange={(e) => setConfig({ 
                                            ...config, 
                                            emote_list: e.target.value.split(',').map(item => item.trim()) // Split by commas and trim whitespace
                                        })}
                                        className="w-full bg-[#1F2936] text-sm border border-gray-600 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => updateConfig(config)} 
                            type="button" 
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                             Save
                        </button>
                    </form>
                </div>
                
            </div>
        </div>
    );
};

export default Config;
