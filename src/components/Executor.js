// src/CodeEditor.js
import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import LoadingSpinner from './Loading';
import axios from 'axios';
import Swal from 'sweetalert2';
import CONFIG from './config/Config.json'
import { ToastContainer, toast } from 'react-toastify';

const CodeEditor = ({serverData}) => {
    const [code, setCode] = useState();
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [openIndex, setOpenIndex] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Menunggu semua request selesai
                const responsePromise = serverData.map((server) =>
                    axios.get(`http://${server}:8000/bot/rotasi-script`)
                );
    
                const scripts = await toast.promise(
                    Promise.all(responsePromise), // Menunggu seluruh request selesai
                    {
                        pending: "Fetching script...",
                        success: "Script fetched successfully!",
                        error: "Failed to get script. Server offline?",
                    }
                );

                const scriptData = scripts.map((item, index) => ({
                    script: item.data,
                    server: serverData[index],
                }));

                setCode(scriptData);
    
            } catch (error) {
                console.error("Error fetching scripts:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);    

    const handleEditorMount = (editor, monaco) => {
        monaco.editor.setTheme('vs-dark'); // Set theme on mount
    };

    const handleEditorChange = (value) => {
        setCode(value);
    };
    
    const handleSave = async (server, index) => {
        try {
            const fetchPromise = axios.post(`http://${server}:8000/bot/rotasi-script`, code[index].script, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });

            toast.promise(fetchPromise, {
                pending: "Saving script...",
                success: "Script saved successfully!",
                error: "Failed saving script. Please try again.",
            });

            const response = await fetchPromise;
            return response.data;

        } catch (error) {
            console.error('Error saving script:', error);
            toast.error("An error occurred while updating the config.");
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner loading={loading} />
            </div>
        );
    }

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index); // Toggle item yang terbuka
    };

    return (
        <div className="p-6 bg-mainBg text-white min-h-screen overflow-x-hidden">
            <div className="bg-[#1F2937] p-4 rounded shadow-md">
                {code.map((item, index) => (
                    <div key={index} className="mb-2">
                        <button
                            className="w-full text-left bg-[#111827] hover:bg-[#090c14] text-white py-2 px-4 rounded flex justify-between items-center"
                            onClick={() => toggleAccordion(index)}
                        >
                            <span>🔔 Script - {item.server}</span>
                            <svg
                                className={`w-5 h-5 transform transition-transform ${
                                    openIndex === index ? 'rotate-180' : ''
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>
                        {openIndex === index && (
                            <div className="mt-2 max-w-full overflow-x-auto custom-scrollbar rounded">
                                <ToastContainer
                                    position="bottom-center"
                                    autoClose={2000}
                                    theme="dark"
                                />
                                <Editor
                                    width="100%"
                                    height="75vh"
                                    language="lua"
                                    value={item.script}
                                    onChange={handleEditorChange}
                                    onMount={handleEditorMount}
                                    options={{
                                        selectOnLineNumbers: true,
                                        theme: 'vs-dark',
                                        fontSize: 16,
                                    }}
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => handleSave(item.server, index)}
                                        className="mt-4 bg-violet-500 hover:bg-violet-700 text-white py-2 px-4 rounded"
                                    >
                                        {uploading && (
                                            <svg
                                                aria-hidden="true"
                                                role="status"
                                                className="inline w-5 h-5 me-3 text-white animate-spin"
                                                viewBox="0 0 100 101"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                    fill="#E5E7EB"
                                                />
                                                <path
                                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        )}
                                        Save
                                    </button>
                                </div>
                            </div>
                        )} 
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CodeEditor;
