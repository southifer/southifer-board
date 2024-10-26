import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import Swal from 'sweetalert2';

// Custom DataGrid styles with #181A20 color, border, and white text
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    height: '760px',
    color: 'white',
    backgroundColor: '#181D1F',
    WebkitFontSmoothing: 'auto',
    letterSpacing: '0.7px',
    border: 'none',
    boxShadow: 'none',

    // Row styles
    '& .MuiDataGrid-row': {
        color: 'white',
        backgroundColor: '#181A20', // Row background color
        '&:hover': {
            backgroundColor: '#2A2E35', // Row hover background color
        },
    },
    '& .MuiDataGrid-footerContainer': {
        borderTop: '1px solid #56575C',
        color: 'white',
        backgroundColor: '#222628'
    },
    '& .even-row': {
        backgroundColor: '#222628', // Color for even rows
    },
    '& .odd-row': {
        backgroundColor: '#181A20', // Color for odd rows
    },

    // Column header styles
    '& .MuiDataGrid-columnHeader': {
        backgroundColor: '#222628',
        color: 'white',
        borderBottom: '10px solid #56575C',
    },

    '& .MuiDataGrid-main': {
        backgroundColor: '#0F1015',
        color: 'white',
    },
    
    '& .MuiDataGrid-editInputCell': {
        color: 'white',
        backgroundColor: '#21232d',
        border: 'none',
        outline: 'none',
        
        // Default styles for larger screens
        '@media (max-width:600px)': {
            color: 'yellow', // Change color for mobile
            backgroundColor: 'red', // Change background for mobile
            border: '1px solid red', // Example border change for mobile
            outline: 'solid',
        },
    },
    
    // Improve visibility for header cells
    '& .MuiDataGrid-columnHeaderTitle': {
        textAlign: 'center', // Center-align header titles
    },

    // Cell styles
    '& .MuiDataGrid-cell': {
        color: 'white',
        borderBottom: '1px solid #64646A',
        borderTop: 'none',
        '&:focus': {
            outline: 'none', // Remove focus outline for cleaner look
        },
    },

    // Checkbox styles
    '& .MuiCheckbox-root': {
        color: '#868787', // Custom color for unchecked state
        '&.Mui-checked': {
            color: '#1976D2', // Custom color for checked state
        },
    },

    // Menu item styles
    '& .MuiMenuItem-root': {
        backgroundColor: '#2A2E35',
        color: 'white', // Change menu item text color
        '&:hover': {
            backgroundColor: '#1976D2', // Change hover background color
        },
    },
}));

const DataBot = () => {
    const [rows, setRows] = useState([]);
    const [selectedCell, setSelectedCell] = useState('');
    const [copiedCell, setCopiedCell] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        recovery: '',
        mac: '',
        rid: '',
        proxy: '',
    });
    const [selectedRow, setSelectedRow] = useState([]);

    const ProcessSelectionRow = (newSelectionModel) => {
        setSelectedRow(newSelectionModel);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://64.72.205.239:8000/bot/bot-backup');
                const dataWithIds = response.data.map((item, index) => ({ ...item, id: index }));
                setRows(dataWithIds);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const columns = [
        { field: 'username', headerName: 'Name', minWidth: 300, editable: true, sortable: false },
        { field: 'password', headerName: 'Password', minWidth: 200, editable: true, sortable: false },
        { field: 'recovery', headerName: 'Recovery', minWidth: 300, editable: true, sortable: false },
        { field: 'mac', headerName: 'MAC', minWidth: 200, editable: true, sortable: false },
        { field: 'rid', headerName: 'RID', minWidth: 350, editable: true, sortable: false },
        { field: 'proxy', headerName: 'Proxy', minWidth: 400, editable: true },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const getRowClassName = (params) => {
        return params.indexRelativeToCurrentPage % 2 === 1 ? 'even-row' : 'odd-row';
    };

    const handleProcessRowUpdate = (newRow) => {
        console.table(newRow); // Log the updated row for debugging

        // Update the rows without mutating state
        const updatedRows = rows.map((row) =>
            row.id === newRow.id ? { ...row, ...newRow } : row // Ensure the correct row is updated
        );

        // Check if the updatedRows length is correct
        console.table(updatedRows);

        setRows(updatedRows); // Set the updated rows
        return newRow; // Return the updated row
    };

    const handleCellClick = (params) => {
        const { field, row } = params;

        // Save the current selected cell content for later copying
        switch (field) {
            case 'username':
                setSelectedCell(row.username);
                break;
            case 'password':
                setSelectedCell(row.password);
                break;
            case 'recovery':
                setSelectedCell(row.recovery);
                break;
            case 'mac':
                setSelectedCell(row.mac);
                break;
            case 'rid':
                setSelectedCell(row.rid);
                break;
            case 'proxy':
                setSelectedCell(row.proxy);
                break;
            default:
                setSelectedCell('');
        }
    };

    useEffect(() => {
        const handleCopy = (event) => {
            if (event.ctrlKey && event.key === 'c' && selectedCell) { // Check if Ctrl is pressed and a cell is selected
                navigator.clipboard.writeText(selectedCell) // Copy the cell value to clipboard
                    .then(() => {
                        // Set the copied cell for glowing effect
                        const cellIndex = rows.findIndex(row => 
                            row.username === selectedCell || 
                            row.password === selectedCell || 
                            row.recovery === selectedCell || 
                            row.mac === selectedCell || 
                            row.rid === selectedCell || 
                            row.proxy === selectedCell
                        );

                        if (cellIndex !== -1) {
                            const copiedRow = rows[cellIndex];
                            setCopiedCell({ id: copiedRow.id, field: event.target.dataset.field }); // Capture the correct field
                        }

                        // Reset copied cell glow after 1 second
                        setTimeout(() => {
                            setCopiedCell(null);
                        }, 1000);
                    })
                    .catch((err) => {
                        console.error('Failed to copy: ', err);
                    });
            }
        };

        window.addEventListener('keydown', handleCopy); // Add event listener for keydown

        return () => {
            window.removeEventListener('keydown', handleCopy); // Cleanup on unmount
        };
    }, [selectedCell, rows]); // Depend on selectedCell and rows

    const getCellClassName = (params) => {
        const { row, field } = params;
        const isGlowing = copiedCell && copiedCell.id === row.id && copiedCell.field === field;
        return isGlowing ? 'glow glow-update' : '';
    };

    const handleCellEditCommit = (params) => {
        const updatedRow = { ...params.row, [params.field]: params.value };
        const updatedRows = rows.map((row) =>
            row.username === params.row.username ? updatedRow : row
        );
        setRows(updatedRows);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission
    
        const NewData = {
            username: formData.username,
            password: formData.password,
            recovery: formData.recovery,
            mac: formData.mac,
            rid: formData.rid,
            proxy: formData.proxy,
            id: rows.length // Assuming you want to keep it sequential
        };
        
        // Update the rows state using a functional update
        setRows(prevRows => {
            const updatedData = [...prevRows, NewData]; // Append the new data
            console.table(updatedData);
            sendDataToServer(updatedData, 'bot added success'); // Send updated data to server
            return updatedData; // Return updated state
        });
    };

    const sendDataToServer = async (updatedData, titleText) => {
        try {
            const newScript = `${JSON.stringify(updatedData, null, 2)}`; // Convert updated data to JSON
            const response = await axios.post('http://64.72.205.239:8000/bot/bot-backup', newScript, {
                headers: {
                    'Content-Type': 'text/plain', // Change this as needed
                },
            });

            Swal.fire({
                title: "info",
                text: titleText ? titleText : response.data,
                icon: "success"
            });
    
        } catch (error) {
            Swal.fire({
                title: "The Internet?",
                text: error.message, // Use error.message for clearer output
                icon: "warning"
            });
        }
    };

    const RemoveDataAPI = async () => {
        if (selectedRow.length === 0) {
            Swal.fire({
                title: "info",
                text: 'No data selected!',
                icon: "warning"
            });
            return;
        }

        const selectedLogRow = selectedRow.length;
        setRows(rows => {
            const updatedData = rows.filter(row => !selectedRow.includes(row.id));
            sendDataToServer(updatedData, `deleted x${selectedLogRow} bots`);
            return updatedData;
        });
    };

    const SaveDataAPI = async () => {
        sendDataToServer(rows, 'all data saved!')
    };
    
    return (
        <div className="p-6 bg-mainBg text-white min-h-screen overflow-x-hidden">

            <div className="bg-widgetBg p-4 rounded-lg shadow-md mb-4">
                <form className='grid grid-cols-1 md:grid-cols-2 gap-4' onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full h-[60px] text-white bg-[#2A2E35] focus:ring-1 focus:outline-none font-medium rounded px-2.5 py-2.5"
                        required
                    />
                    <input
                        type="text"
                        name="password"
                        placeholder="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full h-[60px] text-white bg-[#2A2E35] focus:ring-1 focus:outline-none font-medium rounded text-sm px-2.5 py-2.5"
                        required
                    />
                    <input
                        type="text"
                        name="recovery"
                        placeholder="recovery"
                        value={formData.recovery}
                        onChange={handleChange}
                        className="w-full h-[60px] text-white bg-[#2A2E35] focus:ring-1 focus:outline-none font-medium rounded text-sm px-2.5 py-2.5"
                    />
                    <input
                        type="text"
                        name="mac"
                        placeholder="mac"
                        value={formData.mac}
                        onChange={handleChange}
                        className="w-full h-[60px] text-white bg-[#2A2E35] focus:ring-1 focus:outline-none font-medium rounded text-sm px-2.5 py-2.5"
                    />
                    <input
                        type="text"
                        name="rid"
                        placeholder="rid"
                        value={formData.rid}
                        onChange={handleChange}
                        className="w-full h-[60px] text-white bg-[#2A2E35] focus:ring-1 focus:outline-none font-medium rounded text-sm px-2.5 py-2.5"
                    />
                    <input
                        type="text"
                        name="proxy"
                        placeholder="proxy"
                        value={formData.proxy}
                        onChange={handleChange}
                        className="w-full h-[60px] text-white bg-[#2A2E35] focus:ring-1 focus:outline-none font-medium rounded text-sm px-2.5 py-2.5"
                        required
                    />
                    <div className="flex md:col-span-2 justify-end gap-2">
                        <button
                            type="submit"
                            className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
                        >
                            submit
                        </button>
                    </div>
                </form>
            </div>
            <div className="bg-widgetBg p-4 rounded-lg shadow-md grid grid-cols-1 gap-4 mb-4">
                <div className="flex md:col-span-2 justify-end gap-2">
                    <button 
                        onClick={() => RemoveDataAPI()}
                        className=" bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
                    >
                        delete
                    </button>
                    <button 
                        onClick={() => SaveDataAPI()}
                        className=" bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
                    >
                        save
                    </button>
                </div>
                <div className="max-w-full overflow-x-auto custom-scrollbar mr-2">
                    <StyledDataGrid
                        rows={rows}
                        columns={columns}
                        getRowId={(row) => row.id}
                        getRowClassName={getRowClassName}
                        checkboxSelection
                        disableRowSelectionOnClick
                        pagination
                        onCellClick={handleCellClick}
                        onCellEditCommit={handleCellEditCommit}
                        processRowUpdate={handleProcessRowUpdate}
                        getCellClassName={getCellClassName}

                        onRowSelectionModelChange={ProcessSelectionRow}
                        rowSelectionModel={selectedRow}
                    />
                </div>
            </div>
        </div>
    );
};

export default DataBot;
