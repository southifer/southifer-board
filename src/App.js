import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Import ThemeProvider and createTheme
import Dashboard from './components/Dashboard';
import NavigationBar from './components/NavigationBar';
import Config from './components/Config';
import DataBot from './components/DataBot';
import CodeEditor from './components/Executor';
import Controller from './components/Controller';

// Create a dark theme
const darkTheme = createTheme({
    palette: {
        mode: 'dark', // Set the theme mode to dark
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
                                <Route path="/"/>
                                <Route path="/dashboard" element={<Controller />} />
                                <Route path="/config" element={<Config />} />
                                <Route path="/bot" element={<DataBot />} />
                                <Route path="/script" element={<CodeEditor />} />
                                <Route path="/hidden-thing" element={<Dashboard />} />
                            </Routes>
                        </div>
                    </div>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
