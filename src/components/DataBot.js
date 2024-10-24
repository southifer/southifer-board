import React, { useState, useEffect } from 'react';
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import axios from 'axios';

// Custom DataGrid styles with #181A20 color, border, and white text
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    border: `1px solid #181A20`,
    color: 'white',
    backgroundColor: '#181A20',
    fontFamily: 'Roboto, sans-serif',
    WebkitFontSmoothing: 'auto',
    letterSpacing: 'normal',
    '& .MuiDataGrid-row': {
        color: 'white',
        backgroundColor: '#181A20', // Row background color
        '&:hover': {
            backgroundColor: '#2A2E35', // Row hover background color
        },
    },
    '& .MuiDataGrid-columnHeaders': {
        backgroundColor: '#181A20', // Ensure column headers have this color
    },
    '& .MuiDataGrid-columnHeader': {
        backgroundColor: '#181A20', // Column header background
        color: 'white',
    },
    '& .MuiDataGrid-iconSeparator': {
        display: 'none',
    },
    '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
        borderRight: '1px solid #181A20',
    },
    '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
        borderBottom: '1px solid #181A20',
    },
    '& .MuiDataGrid-cell': {
        color: 'white',
    },
    '& .MuiPaginationItem-root': {
        borderRadius: 0,
    },
}));



const DataBot = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://64.72.205.239:8000/bot/bot-backup');
                setRows(response.data);
            } catch (error) {
                setError('Error fetching config data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const columns = [
        { field: 'name', headerName: 'Name', minWidth: 200, editable: true, sortable: false },
        { field: 'password', headerName: 'Password', minWidth: 200, editable: true, sortable: false },
        { field: 'recovery', headerName: 'Recovery', minWidth: 200, editable: true, sortable: false },
        { field: 'mac', headerName: 'MAC', minWidth: 200, editable: true, sortable: false },
        { field: 'rid', headerName: 'RID', minWidth: 200, editable: true, sortable: false },
        { field: 'proxy', headerName: 'Proxy', minWidth: 200, editable: true }
    ];

    return (
        <div className="p-6 bg-mainBg text-white min-h-screen overflow-x-hidden">
            <div className="bg-widgetBg p-4 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                <div className="max-w-full overflow-x-auto custom-scrollbar">
                    <div className="bg-widgetBg p-5 rounded-lg shadow-md">
                        <p className="flex-grow text-xs font-bold text-gray-200 mb-2 uppercase">USER STATISTIC</p>
                    </div>
                </div>
            </div>

            <div style={{ width: '100%' }}>
                <StyledDataGrid
                rows={rows}
                columns={columns}
                checkboxSelection
                pagination
                />
            </div>
        </div>
    );
};

export default DataBot;
