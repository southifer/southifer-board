// src/CodeEditor.js
import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import LoadingSpinner from './Loading';
import axios from 'axios';
import Swal from 'sweetalert2';

const CodeEditor = () => {
    const [code, setCode] = useState();
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://191.96.94.35:8000/bot/rotasi-script');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const script = await response.text(); // Await the text response
                setCode(script); // Now set the code
            } catch (error) {
                console.error(error);
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
    
    const handleSave = async () => {
        try {
            setUploading(true);
            const response = await axios.post('http://191.96.94.35:8000/bot/rotasi-script', code, {
                headers: {
                    'Content-Type': 'text/plain', // Change this as needed
                },
            });
            
            if (response.status === 200) {
                Swal.fire({
                    title: 'Saved',
                    text: 'Script updated successfully!',
                    icon: 'success',
                });
            }

        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.response ? error.response.data : error.message, // More detailed error feedback
                icon: 'warning',
            });
        } finally {
            setUploading(false);
        }
    };
    
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner loading={loading} />
            </div>
        );
    }

    return (
        <div className="p-6 bg-mainBg text-white min-h-screen overflow-x-hidden">
            <div className="bg-[#28313E] border border-[#434B56] p-4 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                <div className="max-w-full overflow-x-auto custom-scrollbar rounded-lg border border-[#434B56">
                    <Editor
                        height="70vh"
                        language="lua"
                        value={code}
                        onChange={handleEditorChange}
                        onMount={handleEditorMount}
                        options={{
                            selectOnLineNumbers: true,
                            theme: 'vs-dark',
                            fontSize: 16
                        }}
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={() => handleSave()} 
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    >
                        {uploading && (
                            <svg aria-hidden="true" role="status" class="inline w-5 h-5 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                            </svg>
                        )}
                        save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;
