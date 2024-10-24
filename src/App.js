import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import NavigationBar from './components/NavigationBar';
import Config from './components/Config';
import DataBot from './components/DataBot';
import CodeEditor from './components/Executor'

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen bg-mainBg">
                <NavigationBar />
                    <div className="flex flex-1">
                    <div className="flex-1 flex flex-col">
                        <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/config" element={<Config />} />
                            <Route path="/bot" element={<DataBot />} />
                            <Route path="/script" element={<CodeEditor />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;