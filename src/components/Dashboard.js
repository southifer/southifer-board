import config from "./config/Config.json";
import { useState, useEffect } from "react";

const Dashboard = () => {
    const [jsonData, setJsonData] = useState(config);
    const [inputValue, setInputValue] = useState(config.BASE_URL);

    useEffect(() => {
        document.title = 'Dashboard';
    }, []);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSave = () => {
        alert(`BASE_URL updated to: ${inputValue}`);
        setJsonData((prevData) => ({
            ...prevData,
            BASE_URL: inputValue,
        }));
    };

    return (
        <div className="p-6 bg-mainBg text-white min-h-screen overflow-x-hidden">
            <div className="bg-[#1C1C1C] p-4 rounded-lg shadow-md mb-4 border border-[#424242]">
                <h1 className="flex items-center text-xs font-bold text-gray-400 mb-2 uppercase">
                    base url
                </h1>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-[#2E2E2E] text-white rounded border border-[#424242] focus:outline-none"
                    placeholder="Enter Base URL"
                />
                <button
                    onClick={handleSave}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default Dashboard;