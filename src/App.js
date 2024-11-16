import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import NavigationBar from './components/NavigationBar';
import Config from './components/Config';
import DataBot from './components/DataBot';
import CodeEditor from './components/Executor';
import Controller from './components/Controller';
import FarmTable from './components/FarmTable';
import RouterIP from './components/RouterIP';
import Dashboard from './components/Dashboard';

// Create a dark theme
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {
    return (
        <ThemeProvider theme={darkTheme}> {/* Wrap the app with ThemeProvider */}
            <Router>
                <div className="flex flex-col min-h-screen bg-mainBg">
                    <NavigationBar />
                    <div className="flex flex-1">
                        <div className="flex-1 flex flex-col">
                            <Routes>
                                <Route path="/*" element={<Dashboard />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/controller" element={<Controller />} />
                                <Route path="/config" element={<Config />} />
                                <Route path="/bot" element={<DataBot />} />
                                <Route path="/farm" element={<FarmTable />} />
                                <Route path="/script" element={<CodeEditor />} />
                                <Route path="/router" element={<RouterIP />} />
                            </Routes>
                        </div>
                    </div>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
