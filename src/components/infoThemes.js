import { BorderBottom, BorderLeft, BorderRight, BorderTop } from '@mui/icons-material';
import { createTheme } from '@mui/material/styles';

export const InfoThemes = createTheme({
  components: {
    MuiDataGrid: {
        styleOverrides: {
            root: {
                minHeight: 750,
                backgroundColor: '#181A20',
                '& .MuiDataGrid-row': {
                    color: 'white',
                        backgroundColor: '#181A20', // Row background color
                    '&:hover': {
                        backgroundColor: '#2A2E35', // Row hover background color
                    },
                },
                '& .MuiDataGrid-overlay': {
                    backgroundColor: '#181A20', // Adjust the overlay background
                    color: 'white'
                },
                '& .MuiDataGrid-columnHeader': {
                    backgroundColor: '#181A20',
                },
                '& .MuiDataGrid-selectedRow': {
                    backgroundColor: '#2A2E35', // Selected row background color
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                    fontSize: '15px',
                    fontWeight: 'bold', // Column header font weight
                },
                '& .MuiDataGrid-selectedRowCount': {
                    color: '#2F2F2',
                },
                '& .MuiCheckbox-root': {
                    color: '#54545A',
                },
            },
            columnHeader: {
                backgroundColor: '#181A20',
            },
            columnHeaderTitle: {
                backgroundColor: '#181A20',
                color: 'white',
            },
            columnHeaderSortIcon: {
                backgroundColor: '#181A20',
                color: 'white',
            },
            footerContainer: {
                backgroundColor: '#181A20',
                color: 'white',
            },
            pagination: {
                backgroundColor: 'red',
                color: 'white', // Pagination text color
            },
            cell: {
                backgroundColor: '#181A20',
                border: '2px solid #0f0f14', // Border color for cell content
            },
            row: {
                backgroundColor: '#181A20',
            },
        },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiSvgIcon-root': {
            color: 'white',
          },
        },
      },
    },
        MuiButton: {
        styleOverrides: {
            root: {
            color: '#FFFFFF',
            backgroundColor: '#0F1015',
                '&:hover': {
                    backgroundColor: 'white', // Button hover background color
                },
            },
        },
        },
        MuiTooltip: {
        styleOverrides: {
            tooltip: {
                backgroundColor: 'white', // Tooltip background color
                    color: 'white',
                },
            },
        },
    },
});
