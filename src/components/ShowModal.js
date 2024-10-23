import React, { useState, useRef, useEffect } from 'react';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import Swal from 'sweetalert2';
import ReactDOMServer from 'react-dom/server';

{/* <button
onClick={async () => {
    const { value: script } = await Swal.fire({
        title: 'Script Executor',
        input: 'textarea',
        inputLabel: 'Enter your Lua script',
        inputPlaceholder: 'Type your Lua script here...',
        showCancelButton: true,
        confirmButtonText: 'Run Script',
        showLoaderOnConfirm: true,
    });

    if (script) {
        try {
            const result = await executeScript(script);
            Swal.fire({
                title: 'Result',
                text: result,
                icon: 'info',
            });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
            });
        }
    }
}}
className="swal2-button bg-blue-500 text-white px-2 py-2 rounded my-2"
>
Run Script
</button> */}



const InventoryTable = ({ data }) => {
    const trashItem = async (index, id) => {
        const script = `local bot = getBot(${index})\nreturn bot:getInventory():findItem(${id}) or 0`;
        try {
            const response = await axios.post('http://64.72.205.239:8000/bot/runScript', script, {
                headers: {
                    'Content-Type' : 'text/plain'
                }
            });
            console.log('Executing script:', script);

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error('Error executing script.');
            }
        } catch (error) {
            console.error('Error executing script:', error);
            throw new Error('Error executing script.');
        }
    };

    return (
        <div className="h-96 overflow-y-auto w-full"> {/* Set width to full */}
            <table className="min-w-full divide-y divide-gray-700">
                <thead className='border-b-2 border-[#181A20]'>
                    <tr>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">Id</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-center">Amount</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-700 text-left'>
                    {data.inventory.map((item, index) => (
                        <tr key={index} className="border-t">
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">
                                <div className="flex items-center">
                                    <span className="ml-2 flex-1 min-w-[50px]">{item.name}</span>
                                </div>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300 text-center">{item.id}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300 text-center">x{item.amount}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300 text-right">
                                {item.is_clothes && (
                                    <button 
                                        onClick={() => {
                                            alert(`Used: ${item.id}`); // Alert on use
                                        }} 
                                        className="bg-green-500 text-white px-2 py-2 rounded mr-2"
                                    >
                                        Use
                                    </button>
                                )}
                                <button 
                                    onClick={async () => {
                                        alert('Drop button clicked!'); // Add an alert for testing
                                        console.log('Attempting to drop item with ID:', item.id, 'and index:', data.details.index);
                                        try {
                                            const result = await trashItem(data.details.index, item.id);
                                            console.log('API result:', result); // Log the result
                                            Swal.fire({
                                                title: 'Result',
                                                text: result,
                                                icon: 'info',
                                            });
                                        } catch (error) {
                                            console.error('Error in Drop button:', error); // Log any error that occurs
                                            Swal.fire({
                                                title: 'Error',
                                                text: error.message,
                                                icon: 'error',
                                            });
                                        }
                                    }}
                                    className="bg-green-500 text-white px-2 py-2 rounded mr-2"
                                >
                                    Drop
                                </button>
                                <button className="bg-green-500 text-white px-2 py-2 rounded">
                                    Trash
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const executeScript = async (script) => {
    try {
        const response = await axios.post('http://64.72.205.239:8000/bot/runScript', script, {
            headers: {
                'Content-Type': 'text/plain',
            },
        });

        // Log the script for debugging
        console.log('Executing script:', script);

        if (response.status === 200) {
            return response.data; // Return the result
        } else {
            throw new Error('Error executing script.');
        }
    } catch (error) {
        console.error('Error executing script:', error);
        throw new Error('Error executing script.'); // Throw error for handling
    }
};

const StopScriptAPI = async (id) => {
    const index = id; // Replace this with your logic to get the index
    const script = `bot = getBot(${index})\nbot:stopScript()\nsleep(2000)\nreturn bot:isRunningScript()`;

    try {
        const response = await axios.post('http://64.72.205.239:8000/bot/runScript', script, {
            headers: {
                'Content-Type': 'text/plain',
            },
        });

        if (response.status === 200) {
            const isRunning = response.data; 
            if (!isRunning) {
                Swal.fire('Success', 'Script stopped successfully!', 'success'); // SweetAlert success
            } else {
                Swal.fire('Error', 'Script is still running.', 'error'); // SweetAlert error
            }
        }
    } catch (error) {
        console.error('Error stopping script:', error);
        Swal.fire('error', 'Error stopping script.', 'error'); // SweetAlert error
    }
};

const StartRotasiAPI = async (id) => {
    const index = id; // Replace this with your logic to get the index
    const script = `local bot = getBot(${index})\nlocal script = read("rotasi-luci-json.lua")\nif not bot:isRunningScript() then\nbot:runScript(script)\nbot.custom_status=""\nsleep(2000)\nreturn bot:isRunningScript()\nend`;

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
                Swal.fire('Success', 'Rotasi script running!', 'success'); // SweetAlert success
            } else {
                Swal.fire('Error', 'Error running rotasi script', 'error'); // SweetAlert error
            }
        }
    } catch (error) {
        console.error('Error stopping script:', error);
        Swal.fire('Error', 'Error stopping script.', 'error'); // SweetAlert error
    }
};

const RestartRotasiAPI = async (id) => {
    const index = id; // Replace this with your logic to get the index
    const script = `local bot = getBot(${index})\nlocal script = read("rotasi-luci-json.lua")\nif bot:isRunningScript() then\nbot:stopScript()\nsleep(1000)\nend\nif not bot:isRunningScript() then\nbot:runScript(script)\nbot.custom_status=""\nsleep(2000)\nreturn bot:isRunningScript()\nend`;

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
                Swal.fire('Success', 'Rotasi script restarted!', 'success'); // SweetAlert success
            } else {
                Swal.fire('Error', 'Error restarting rotasi script', 'error'); // SweetAlert error
            }
        }
    } catch (error) {
        console.error('Error stopping script:', error);
        Swal.fire('Error', 'Error stopping script.', 'error'); // SweetAlert error
    }
};

const ConnectBotAPI = async (id, event) => {
    let script;
    
    if (event === 'Online') {
        script = `local bot = getBot(${id})\nbot:disconnect()\nsleep(1000)`;
    } else {
        script = `local bot = getBot(${id})\nbot:connect()\nsleep(1000)`;
    }
    
    try {
        const response = await axios.post('http://64.72.205.239:8000/bot/runScript', script, {
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    } catch (error) {
        Swal.fire('Error', `Error executing script: ${error.message}`, 'error'); // Adjusted message
    }
};

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

    const regex = /(`[0-9!@#^&wobpqertascì])([^\`]*)/g;

    const parsed = displayName.replace(regex, (match, colorCode, text) => {
        const color = growtopiaColors[colorCode];
        if (color) {
            return `<span style="color:${color}">${text}</span>`;
        } else {
            return text;
        }
    });
    // Remove unnecessary backticks by replacing double backticks with a single space
    const cleanedParsed = parsed.replace(/``/g, '').replace(/`/g, '');

    return cleanedParsed.endsWith('``') ? cleanedParsed.slice(0, -2) : cleanedParsed;
};


// Main component
const ShowModal = ({ item }) => {
    const [consoleLogs, setConsoleLogs] = useState([]);
    const MySwal = withReactContent(Swal);

    const openConsoleModal = () => {
        const logsHtml = item.console
            .map(log => `<p class="text-[#C6BD9E] text-left text-sm century-gothic-bold">${parseDisplayName(log)}</p>`)
            .join('');
    
        Swal.fire({
            title: 'Console',
            html: `<div class="bg-black text-white font-mono p-4 rounded-md h-96 overflow-y-auto">${logsHtml}</div>`,
            showCloseButton: true,
            focusConfirm: true,
            confirmButtonText: 'Close',
            customClass: {
                popup: 'swal2-console' // Apply custom class to the modal
            },
        });
    };

    const openInventory = () => {
        document.body.classList.add('modal-open'); // Prevent background scrolling
        const inventoryHtml = ReactDOMServer.renderToStaticMarkup(<InventoryTable data={item} />);
    
        Swal.fire({
            title: 'Inventory',
            html: inventoryHtml,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: 'Close',
            customClass: {
                popup: 'swal2-inventory', // Optional: Add custom class if you want to style the modal
            },
        }).then(() => {
            document.body.classList.remove('modal-open'); // Remove class on close
        });
    };
    

    const handleActionsClick = () => {
        MySwal.fire({
            title: `${item.details.name} [${item.details.index}]`,
            html: (
                <div className='grid grid-cols-1 md:grid-cols-1 gap-x-1 gap-y-0.1'>
                    <button 
                        onClick={() => {ConnectBotAPI(item.details.index, item.details.status)}}
                        className='swal2-button bg-red-500 text-white px-2 py-2 rounded my-2 flex items-center justify-center'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                            <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
                        </svg>

                        {item.details.status === 'Online' ? 'Disconnect' : 'Connect'}
                    </button>

                    <button
                        onClick={openInventory}
                        className="swal2-button bg-red-500 text-white px-2 py-2 rounded my-2 flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-backpack4-fill" viewBox="0 0 16 16" className='w-5 h-5 mr-2'>
                            <path d="M8 0a2 2 0 0 0-2 2H3.5a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h4v.5a.5.5 0 0 0 1 0V7h4a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H10a2 2 0 0 0-2-2m1 2a1 1 0 0 0-2 0zm-4 9v2h6v-2h-1v.5a.5.5 0 0 1-1 0V11z"/>
                            <path d="M14 7.599A3 3 0 0 1 12.5 8H9.415a1.5 1.5 0 0 1-2.83 0H3.5A3 3 0 0 1 2 7.599V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                        Inventory
                    </button>

                    <button
                        onClick={openConsoleModal}
                        className="swal2-button bg-red-500 text-white px-2 py-2 rounded my-2 flex items-center justify-center"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                    <path fillRule="evenodd" d="M12 2.25c-2.429 0-4.817.178-7.152.521C2.87 3.061 1.5 4.795 1.5 6.741v6.018c0 1.946 1.37 3.68 3.348 3.97.877.129 1.761.234 2.652.316V21a.75.75 0 0 0 1.28.53l4.184-4.183a.39.39 0 0 1 .266-.112c2.006-.05 3.982-.22 5.922-.506 1.978-.29 3.348-2.023 3.348-3.97V6.741c0-1.947-1.37-3.68-3.348-3.97A49.145 49.145 0 0 0 12 2.25ZM8.25 8.625a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Zm2.625 1.125a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clipRule="evenodd" />
                    </svg>


                        Console
                    </button>

                    <button
                        onClick={() => StopScriptAPI(item.details.index)}
                        className="swal2-button bg-red-500 text-white px-2 py-2 rounded my-2 flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square-fill" viewBox="0 0 16 16" className='w-4 h-4 mr-2'>
                            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708"/>
                        </svg>


                        Stop Script
                    </button>

                    <button
                        onClick={() => StartRotasiAPI(item.details.index)}
                        className="swal2-button bg-red-500 text-white px-2 py-2 rounded my-2 flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-square-fill" viewBox="0 0 16 16" className='w-4 h-4 mr-2'>
                            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
                        </svg>

                        Start Rotasi
                    </button>

                    <button
                        onClick={() => RestartRotasiAPI(item.details.index)}
                        className="swal2-button bg-red-500 text-white px-2 py-2 rounded my-2 flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                            <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clipRule="evenodd" />
                        </svg>

                        Restart Rotasi
                    </button>

                    <button
                        onClick={async () => {
                            await Swal.fire({
                                title: 'Script Executor',
                                input: 'textarea',
                                inputLabel: 'Enter your Lua script',
                                inputPlaceholder: 'Type your Lua script here...',
                                showCancelButton: true,
                                confirmButtonText: 'Run Script',
                                showLoaderOnConfirm: true,
                                customClass: {
                                    popup: 'swal2-executor', // Optional: Add custom class if you want to style the modal
                                },
                                preConfirm: async (script) => {
                                    if (!script) {
                                        Swal.showValidationMessage('Please enter a script!');
                                        return;
                                    }
                                    try {
                                        const response = await executeScript(script);
                                        return response; // Return the result directly
                                    } catch (error) {
                                        Swal.showValidationMessage(`Error: ${error.message}`);
                                    }
                                },
                                allowOutsideClick: () => !Swal.isLoading(),
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    Swal.fire({
                                        title: 'result',
                                        text: result.value == 'nil' ? 'Success' : result.value
                                    });
                                }
                            });
                        }}
                        className="swal2-button bg-red-500 text-white px-2 py-2 rounded my-2 flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-terminal" viewBox="0 0 16 16" className='w-5 h-5 mr-2'>
                            <path d="M6 9a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3A.5.5 0 0 1 6 9M3.854 4.146a.5.5 0 1 0-.708.708L4.793 6.5 3.146 8.146a.5.5 0 1 0 .708.708l2-2a.5.5 0 0 0 0-.708z"/>
                            <path d="M2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/>
                        </svg>

                        Run Script
                    </button>
                </div>
            ),
            showCloseButton: true,
            showConfirmButton: false, // No confirm button needed since we have custom buttons
            icon: 'info'
        });
    };

    return (
        <div>
            <button
                onClick={handleActionsClick}
                className="bg-red-500 text-white px-2 py-2 rounded"
            >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
            </svg>


            </button>
        </div>
    );
};

export default ShowModal;
