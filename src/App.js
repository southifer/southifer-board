import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import NavigationBar from './components/NavigationBar';
import Config from './components/Config';
import DataBot from './components/DataBot';
import CodeEditor from './components/Executor';
import Controller from './components/Controller';
import FarmTable from './components/FarmTable';
import RouterIP from './components/RouterIP';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Cookies from 'js-cookie';

// Create a dark theme
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [serverList, setServerList] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [credential, setCredential] = useState([]);

    const handleLogin = () => {
        setIsLoggedIn(true);
        Cookies.set('isLoggedIn', 'true', { expires: 120 / 1440});
    };

    const handlePermission = (data) => {
        setIsAdmin(data);
        Cookies.set('isAdmin', JSON.stringify(data), { expires: 120 / 1440});
    };

    const storeServerList = (newServerList) => {
        setServerList(newServerList); // Update serverList state
        console.log('setnew ',newServerList)
        Cookies.set('serverList', JSON.stringify(newServerList), { expires: 120 / 1440});
    };

    const storeCredential = (data) => {
        setCredential(data);
        Cookies.set('credential', JSON.stringify(data), { expires: 120 / 1440});
    };

    // Load data from cookies on page load
    useEffect(() => {
        const loginStatus = Cookies.get('isLoggedIn');
        if (loginStatus === 'true') {
            setIsLoggedIn(true);
            // Restore serverList, isAdmin, and credential from cookies
            const storedServerList = Cookies.get('serverList');
            const storedIsAdmin = Cookies.get('isAdmin');
            const storedCredential = Cookies.get('credential');

            if (storedServerList) setServerList(JSON.parse(storedServerList));
            if (storedIsAdmin) setIsAdmin(JSON.parse(storedIsAdmin));
            if (storedCredential) setCredential(JSON.parse(storedCredential));
        }
    }, []);

    return (
        <ThemeProvider theme={darkTheme}>
            <Router>
                <div className="flex flex-col min-h-screen bg-mainBg">
                    {/* Show login page if not logged in */}
                    {!isLoggedIn ? (
                        <LoginPage 
                            onLogin={handleLogin} 
                            serverData={storeServerList} 
                            isAdmin={handlePermission}
                            credentials={storeCredential}
                        />
                    ) : (
                        <>
                            <NavigationBar userInformation={credential} isUserAdmin={isAdmin}/>
                            <div className="flex flex-1">
                                <div className="flex-1 flex flex-col">
                                    <Routes>
                                        <Route path="/*" element={ 
                                            <Dashboard 
                                                serverData={serverList} 
                                                credentials={credential} 
                                                setServerList={storeServerList} // Pass setter function to Dashboard
                                            />
                                        }/>
                                        <Route path="/controller" element={ 
                                            <Controller 
                                                serverData={serverList}
                                                usersCredential={credential}
                                            /> 
                                        }/>
                                        <Route path="/config" element={ 
                                            <Config 
                                                serverData={serverList} 
                                            /> 
                                        }/>
                                        <Route path="/bot" element={
                                            <DataBot 
                                                serverData={serverList} 
                                                usersCredential={credential} 
                                            />
                                        }/>
                                        <Route path="/farm" element={
                                            <FarmTable 
                                                serverData={serverList}
                                            />
                                        }/>
                                        <Route path="/script" element={
                                            <CodeEditor 
                                                serverData={serverList}
                                            />
                                        }/>
                                        <Route path="/router" element={
                                            <RouterIP 
                                                usersCredential={credential}
                                            />
                                        }/>
                                    </Routes>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;