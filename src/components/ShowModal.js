import React from 'react';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import Swal from 'sweetalert2';
import ReactDOMServer from 'react-dom/server';

const InventoryTable = ({ data }) => {
    const trashItem = async (index, id) => {
        const script = `local bot = getBot(${index})\nreturn bot:getInventory():findItem(${id}) or 0`;
        try {
            const response = await axios.post('http://191.96.94.35:8000/bot/runScript', script, {
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
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Id</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
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
                                        className="bg-green-500 text-white px-2 py-2 rounded mr-1"
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
                                    className="bg-green-500 text-white px-2 py-2 rounded mr-1"
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
        const response = await axios.post('http://191.96.94.35:8000/bot/runScript', script, {
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
    const script = `bot = getBot(${index})\n
    bot:stopScript()\n
    return bot:isRunningScript()`;

    try {
        const response = await axios.post('http://191.96.94.35:8000/bot/runScript', script, {
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

const StartLevelingAPI = async (id) => {
    const index = id; // Replace this with your logic to get the index
    const script = `local bot = getBot(${index})\nlocal script = read("rotasi-mass.lua")\nif not bot:isRunningScript() then\nbot:runScript(script)\nbot.custom_status=""\nsleep(2000)\nreturn bot:isRunningScript()\nend`;

    try {
        const response = executeScript(script);
        if (response) {
            Swal.fire('Success', 'Script Leveling now running!', 'success');
        }
    } catch (error) {
        console.error('Error stopping script:', error);
        Swal.fire('Error', 'Failed to execute leveling script', 'error'); // SweetAlert error
    }
};

const StartRotasiAPI = async (id) => {
    const index = id; // Replace this with your logic to get the index
    const script = `local bot = getBot(${index})\nlocal script = read("rotasi-luci-json.lua")\nif not bot:isRunningScript() then\nbot:runScript(script)\nbot.custom_status=""\nsleep(5000)\nreturn bot:isRunningScript()\nend`;

    try {
        const response = await axios.post('http://191.96.94.35:8000/bot/runScript', script, {
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
    const script = `local bot = getBot(${index})\n
    local script = read("rotasi-luci-json.lua")\n
    if bot:isRunningScript() then\n
    bot:stopScript()\n
    sleep(1000)\n
    end\n
    if not bot:isRunningScript() then\n
    bot:runScript(script)\n
    bot.custom_status=""\n
    sleep(2000)\n
    return bot:isRunningScript()\n
    end`;

    try {
        const response = await axios.post('http://191.96.94.35:8000/bot/runScript', script, {
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
        const response = await axios.post('http://191.96.94.35:8000/bot/runScript', script, {
            headers: {
                'Content-Type': 'text/plain',
            },
        });
        return response.data;
    } catch (error) {
        Swal.fire('Error', `Error executing script: ${error.message}`, 'error'); // Adjusted message
    }
};

const RemoveBotAPI = async (index) => {
    const script = `local bot = getBot(${index})\nremoveBot(bot.name)`;
    try {
        await axios.post('http://191.96.94.35:8000/bot/runScript', script, {
            headers: {
                'Content-Type': 'text/plain',
            },
        });
        Swal.fire('Success', 'Bot removed', 'success');
    } catch (error) {
        Swal.fire('Error', `Error executing script: ${error.message}`, 'error'); // Adjusted message
    }
};

const StartTutorialAPI = async (index) => {
    const script = `
    local bot = getBot(${index})
    local tutorial = bot.auto_tutorial
    tutorial.enabled = true
    tutorial.auto_quest = true
    tutorial.set_as_home = true
    tutorial.set_high_level = true
    tutorial.set_random_skin = true
    tutorial.set_random_profile = true
    tutorial.detect_tutorial = true
    return tutorial.detect_tutorial
    `;
    try {
        const response = await axios.post('http://191.96.94.35:8000/bot/runScript', script, {
            headers: {
                'Content-Type': 'text/plain',
            },
        });
        Swal.fire('Success', `Tutorial status : ${response.data ? 'running' : 'not running'}`, response.data ? 'success' : 'error');
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

    const regex = /(`[0-9!@#^&wobpqertascì])([^`]*)/g;

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
    const MySwal = withReactContent(Swal);

    const openConsoleModal = () => {
        const logsHtml = item.console
            .map(log => `<p class="text-[#C6BD9E] text-left text-sm century-gothic-bold">${parseDisplayName(log)}</p>`)
            .join('');
    
        Swal.fire({
            title: 'Console',
            html: `<div class="bg-mainBg text-white font-mono p-4 rounded-md h-96 overflow-y-auto">${logsHtml}</div>`,
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
                        className='swal2-button bg-red-500 text-white px-2 py-2 rounded my-2 flex items-center justify-center font-bold'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
                            <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
                        </svg>

                        {item.details.status === 'Online' ? 'DISCONNECT' : 'CONNECT'}
                    </button>
                    <button
                        onClick={async () => {
                            await Swal.fire({
                                title: `Enter World Name`,
                                input: 'text',
                                showCancelButton: true,
                                confirmButtonText: 'Warp',
                                showLoaderOnConfirm: true,
                                preConfirm: async (world) => {
                                    if (!world) {
                                        return;
                                    }
                                    try {
                                        const scriptEnterWorld = `local bot = getBot(${item.details.index})\nbot:warp("${world}")`;
                                        const response = await executeScript(scriptEnterWorld);
                                        return response; // Return the result directly
                                    } catch (error) {
                                        Swal.showValidationMessage(`Error: ${error.message}`);
                                    }
                                },
                                allowOutsideClick: () => !Swal.isLoading(),
                            });
                        }}
                        className="swal2-button bg-red-500 text-white px-2 py-2 rounded my-2 flex items-center justify-center font-bold"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM8.547 4.505a8.25 8.25 0 1 0 11.672 8.214l-.46-.46a2.252 2.252 0 0 1-.422-.586l-1.08-2.16a.414.414 0 0 0-.663-.107.827.827 0 0 1-.812.21l-1.273-.363a.89.89 0 0 0-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.211.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 0 1-1.81 1.025 1.055 1.055 0 0 1-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.654-.261a2.25 2.25 0 0 1-1.384-2.46l.007-.042a2.25 2.25 0 0 1 .29-.787l.09-.15a2.25 2.25 0 0 1 2.37-1.048l1.178.236a1.125 1.125 0 0 0 1.302-.795l.208-.73a1.125 1.125 0 0 0-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 0 1-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 0 1-1.458-1.137l1.279-2.132Z" clipRule="evenodd" />
                        </svg>
                        WARP
                    </button>
                    <button
                        onClick={openInventory}
                        className="swal2-button bg-red-500 text-white px-2 py-2 rounded my-2 flex items-center justify-center font-bold"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-backpack4-fill" viewBox="0 0 16 16" className='w-5 h-5 mr-1'>
                            <path d="M8 0a2 2 0 0 0-2 2H3.5a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h4v.5a.5.5 0 0 0 1 0V7h4a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H10a2 2 0 0 0-2-2m1 2a1 1 0 0 0-2 0zm-4 9v2h6v-2h-1v.5a.5.5 0 0 1-1 0V11z"/>
                            <path d="M14 7.599A3 3 0 0 1 12.5 8H9.415a1.5 1.5 0 0 1-2.83 0H3.5A3 3 0 0 1 2 7.599V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                        INVENTORY
                    </button>

                    <button
                        onClick={openConsoleModal}
                        className="swal2-button bg-red-500 text-white px-2 py-2 rounded my-2 flex items-center justify-center font-bold"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className='w-5 h-5 mr-1 align-items'>
                            <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clipRule="evenodd" />
                        </svg>
                        CONSOLE
                    </button>

                    <button
                        onClick={() => StopScriptAPI(item.details.index)}
                        className="swal2-button bg-red-500 text-white px-2 py-2 rounded my-2 flex items-center justify-center font-bold"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1 bold-lg font-bold">
                            <path fillRule="evenodd" d="m6.72 5.66 11.62 11.62A8.25 8.25 0 0 0 6.72 5.66Zm10.56 12.68L5.66 6.72a8.25 8.25 0 0 0 11.62 11.62ZM5.105 5.106c3.807-3.808 9.98-3.808 13.788 0 3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788Z" clipRule="evenodd" />
                        </svg>

                        STOP SCRIPT
                    </button>

                    <button
                        onClick={() => RestartRotasiAPI(item.details.index)}
                        className="swal2-button bg-red-500 text-white px-2 py-2 rounded my-2 flex items-center justify-center font-bold"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1 bold">
                            <path fillRule="evenodd" d="M12 5.25c1.213 0 2.415.046 3.605.135a3.256 3.256 0 0 1 3.01 3.01c.044.583.077 1.17.1 1.759L17.03 8.47a.75.75 0 1 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 0 0-1.06-1.06l-1.752 1.751c-.023-.65-.06-1.296-.108-1.939a4.756 4.756 0 0 0-4.392-4.392 49.422 49.422 0 0 0-7.436 0A4.756 4.756 0 0 0 3.89 8.282c-.017.224-.033.447-.046.672a.75.75 0 1 0 1.497.092c.013-.217.028-.434.044-.651a3.256 3.256 0 0 1 3.01-3.01c1.19-.09 2.392-.135 3.605-.135Zm-6.97 6.22a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.752-1.751c.023.65.06 1.296.108 1.939a4.756 4.756 0 0 0 4.392 4.392 49.413 49.413 0 0 0 7.436 0 4.756 4.756 0 0 0 4.392-4.392c.017-.223.032-.447.046-.672a.75.75 0 0 0-1.497-.092c-.013.217-.028.434-.044.651a3.256 3.256 0 0 1-3.01 3.01 47.953 47.953 0 0 1-7.21 0 3.256 3.256 0 0 1-3.01-3.01 47.759 47.759 0 0 1-.1-1.759L6.97 15.53a.75.75 0 0 0 1.06-1.06l-3-3Z" clipRule="evenodd" />
                        </svg>

                        RESTART ROTASI
                    </button>

                    <button
                        onClick={async () => {
                            await Swal.fire({
                                title: `Script Executor - ${item.details.index}`,
                                input: 'textarea',
                                inputLabel: 'Enter your Lua script',
                                inputPlaceholder: 'Type your Lua script here...',
                                inputValue: `local bot = getBot(${item.details.index})\n`,
                                showCancelButton: true,
                                confirmButtonText: 'Run Script',
                                showLoaderOnConfirm: true,
                                inputAttributes: {
                                    style: 'font-size: 15px;height: 500px; background-color: #0F1015; color: #FFFFFF; font-family: JetBrains Mono'
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
                                        text: result.value === 'nil' ? 'Script Executed!' : result.value
                                    });
                                }
                            });
                        }}
                        className="swal2-button bg-red-500 text-white px-2 py-2 rounded my-2 flex items-center justify-center font-bold"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
                            <path fillRule="evenodd" d="M2.25 6a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V6Zm3.97.97a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Zm4.28 4.28a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
                        </svg>


                        RUN COMMAND
                    </button>
                    <button
                        onClick={() => RemoveBotAPI(item.details.index)}
                        className="swal2-button bg-red-500 text-white px-2 py-2 rounded my-2 flex items-center justify-center font-bold"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
                            <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                        </svg>

                        REMOVE
                    </button>
                    <button
                        onClick={() => StartRotasiAPI(item.details.index)}
                        className="swal2-button bg-red-500 text-white px-2 py-2 rounded my-2 flex items-center justify-center font-bold"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-square-fill" viewBox="0 0 16 16" className='w-4 h-4 mr-1'>
                            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
                        </svg>

                        START ROTASI
                    </button>
                    <button
                        onClick={() => StartTutorialAPI(item.details.index)}
                        className="swal2-button bg-red-500 text-white px-2 py-2 rounded my-2 flex items-center justify-center font-bold"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-1 bold">
                            <path fillRule="evenodd" d="M12 3.75a6.715 6.715 0 0 0-3.722 1.118.75.75 0 1 1-.828-1.25 8.25 8.25 0 0 1 12.8 6.883c0 3.014-.574 5.897-1.62 8.543a.75.75 0 0 1-1.395-.551A21.69 21.69 0 0 0 18.75 10.5 6.75 6.75 0 0 0 12 3.75ZM6.157 5.739a.75.75 0 0 1 .21 1.04A6.715 6.715 0 0 0 5.25 10.5c0 1.613-.463 3.12-1.265 4.393a.75.75 0 0 1-1.27-.8A6.715 6.715 0 0 0 3.75 10.5c0-1.68.503-3.246 1.367-4.55a.75.75 0 0 1 1.04-.211ZM12 7.5a3 3 0 0 0-3 3c0 3.1-1.176 5.927-3.105 8.056a.75.75 0 1 1-1.112-1.008A10.459 10.459 0 0 0 7.5 10.5a4.5 4.5 0 1 1 9 0c0 .547-.022 1.09-.067 1.626a.75.75 0 0 1-1.495-.123c.041-.495.062-.996.062-1.503a3 3 0 0 0-3-3Zm0 2.25a.75.75 0 0 1 .75.75c0 3.908-1.424 7.485-3.781 10.238a.75.75 0 0 1-1.14-.975A14.19 14.19 0 0 0 11.25 10.5a.75.75 0 0 1 .75-.75Zm3.239 5.183a.75.75 0 0 1 .515.927 19.417 19.417 0 0 1-2.585 5.544.75.75 0 0 1-1.243-.84 17.915 17.915 0 0 0 2.386-5.116.75.75 0 0 1 .927-.515Z" clipRule="evenodd" />
                        </svg>

                        START TUTORIAL
                    </button>
                    <button
                        onClick={() => StartLevelingAPI(item.details.index)}
                        className="swal2-button bg-red-500 text-white px-2 py-2 rounded my-2 flex items-center justify-center font-bold"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
                            <path fillRule="evenodd" d="M2.25 2.25a.75.75 0 0 0 0 1.5H3v10.5a3 3 0 0 0 3 3h1.21l-1.172 3.513a.75.75 0 0 0 1.424.474l.329-.987h8.418l.33.987a.75.75 0 0 0 1.422-.474l-1.17-3.513H18a3 3 0 0 0 3-3V3.75h.75a.75.75 0 0 0 0-1.5H2.25Zm6.54 15h6.42l.5 1.5H8.29l.5-1.5Zm8.085-8.995a.75.75 0 1 0-.75-1.299 12.81 12.81 0 0 0-3.558 3.05L11.03 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l2.47-2.47 1.617 1.618a.75.75 0 0 0 1.146-.102 11.312 11.312 0 0 1 3.612-3.321Z" clipRule="evenodd" />
                        </svg>


                        START LEVELING
                    </button>
                </div>
            ),
            showCloseButton: true,
            showConfirmButton: false, // No confirm button needed since we have custom buttons
            // icon: 'info'
        });
    };

    return (
        <div>
            <button
                onClick={handleActionsClick}
                className={`${item.details.is_script_run ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700'} text-white px-2 py-2 rounded`}
            >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
            </svg>
            </button>
        </div>
    );
};

export default ShowModal;
