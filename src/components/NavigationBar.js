import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavigationBar = () => {
    const { pathname } = useLocation();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [frameIndex, setFrameIndex] = useState(0);

    const toggleNav = () => setIsNavOpen(!isNavOpen);
    const frameLink = [
        "https://stickercommunity.com/uploads/main/20-12-2020-12-00-19-abc11.webp",
        "https://sticker-collection.com/stickers/plain/Puskamvret/512/c0df3d08-8ecf-4ef8-9f35-1af904e79fa2file_2979128.webp",
        "https://media.stickerswiki.app/puskamvret/229038.512.webp",
        "https://media.stickerswiki.app/puskamvret/228979.512.webp",
        "https://media.stickerswiki.app/puskamvret/229013.512.webp"
    ]

    const MathRandom = (list) => list[Math.floor(Math.random() * list.length)];

    return (
        <nav className="bg-[#1C1C1C] border-b-2 border-[#424242] text-white p-4 flex items-center justify-between lg:justify-between flex-col lg:flex-row top-0 left-0 right-0 z-50 max-w-screen">
        <button
            className="lg:hidden absolute right-4 top-4 p-2 rounded-lg text-white focus:outline-none"
            onClick={toggleNav}
            aria-label="Toggle Navigation"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
        </button>

        <div className="flex items-center w-full lg:w-auto">
            <img
                src={frameLink[frameIndex]}
                alt="Logo"
                className="w-12 h-12 rounded-full object-cover"
                onClick={() => setFrameIndex(Math.floor(Math.random() * frameLink.length))}
            />
            <span className="ml-4 text-xl font-semibold hover:cursor=pointer">Noir'e</span>
        </div>

        <div className={`lg:flex ${isNavOpen ? 'block' : 'hidden'} lg:flex lg:space-x-4 lg:ml-auto flex-col lg:flex-row space-y-2 lg:space-y-0 mt-4 lg:mt-0 w-full lg:w-auto`}>
            <Link
                to="/"
                className={`flex items-center px-4 py-2 rounded-lg ${pathname === '/dashboard' ? 'bg-[#2D3436]' : 'hover:bg-[#2D3436]'}`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-5 h-5 mr-2 ${pathname === '/dashboard' ? 'text-[#22D3EE]' : 'text-white'}`}
                >
                    <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                    <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                </svg>
                dashboard
            </Link>
            <Link
                to="/controller"
                className={`flex items-center px-4 py-2 rounded-lg ${pathname === '/controller' ? 'bg-[#2D3436]' : 'hover:bg-[#2D3436]'}`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-5 h-5 mr-2 ${pathname === '/controller' ? 'text-[#22D3EE]' : 'text-white'}`}
                >
                    <path fillRule="evenodd" d="M2.25 2.25a.75.75 0 0 0 0 1.5H3v10.5a3 3 0 0 0 3 3h1.21l-1.172 3.513a.75.75 0 0 0 1.424.474l.329-.987h8.418l.33.987a.75.75 0 0 0 1.422-.474l-1.17-3.513H18a3 3 0 0 0 3-3V3.75h.75a.75.75 0 0 0 0-1.5H2.25Zm6.54 15h6.42l.5 1.5H8.29l.5-1.5Zm8.085-8.995a.75.75 0 1 0-.75-1.299 12.81 12.81 0 0 0-3.558 3.05L11.03 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l2.47-2.47 1.617 1.618a.75.75 0 0 0 1.146-.102 11.312 11.312 0 0 1 3.612-3.321Z" clipRule="evenodd" />
                </svg>
                controller
            </Link>
            <Link
                to="/config"
                className={`flex items-center px-4 py-2 rounded-lg ${pathname === '/config' ? 'bg-[#2D3436]' : 'hover:bg-[#2D3436]'}`}
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    fill="currentColor" 
                    viewBox="0 0 16 16"
                    className={`w-5 h-5 mr-2 ${pathname === '/config' ? 'text-[#22D3EE]' : 'text-white'}`}
                >
                    <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702z"/>
                    <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1z"/>
                </svg>
                config
            </Link>
            <Link
                to="/bot"
                className={`flex items-center px-4 py-2 rounded-lg ${pathname === '/bot' ? 'bg-[#2D3436]' : 'hover:bg-[#2D3436]'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 mr-2 ${pathname === '/bot' ? 'text-[#22D3EE]' : 'text-white'}`}>
                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                </svg>
                bot
            </Link>
            <Link
                to="/farm"
                className={`flex items-center px-4 py-2 rounded-lg ${pathname === '/farm' ? 'bg-[#2D3436]' : 'hover:bg-[#2D3436]'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 mr-2 ${pathname === '/farm' ? 'text-[#22D3EE]' : 'text-white'}`}>
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM6.262 6.072a8.25 8.25 0 1 0 10.562-.766 4.5 4.5 0 0 1-1.318 1.357L14.25 7.5l.165.33a.809.809 0 0 1-1.086 1.085l-.604-.302a1.125 1.125 0 0 0-1.298.21l-.132.131c-.439.44-.439 1.152 0 1.591l.296.296c.256.257.622.374.98.314l1.17-.195c.323-.054.654.036.905.245l1.33 1.108c.32.267.46.694.358 1.1a8.7 8.7 0 0 1-2.288 4.04l-.723.724a1.125 1.125 0 0 1-1.298.21l-.153-.076a1.125 1.125 0 0 1-.622-1.006v-1.089c0-.298-.119-.585-.33-.796l-1.347-1.347a1.125 1.125 0 0 1-.21-1.298L9.75 12l-1.64-1.64a6 6 0 0 1-1.676-3.257l-.172-1.03Z" clipRule="evenodd" />
                </svg>

                farm
            </Link>
            <Link
                to="/script"
                className={`flex items-center px-4 py-2 rounded-lg ${pathname === '/script' ? 'bg-[#2D3436]' : 'hover:bg-[#2D3436]'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 mr-2 ${pathname === '/script' ? 'text-[#22D3EE]' : 'text-white'}`}>
                    <path fillRule="evenodd" d="M2.25 6a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V6Zm3.97.97a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Zm4.28 4.28a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
                </svg>

                script
            </Link>
            <Link
                to="/router"
                className={`flex items-center px-4 py-2 rounded-lg ${pathname === '/router' ? 'bg-[#2D3436]' : 'hover:bg-[#2D3436]'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 mr-2 ${pathname === '/router' ? 'text-[#22D3EE]' : 'text-white'}`}>
                    <path d="M4.08 5.227A3 3 0 0 1 6.979 3H17.02a3 3 0 0 1 2.9 2.227l2.113 7.926A5.228 5.228 0 0 0 18.75 12H5.25a5.228 5.228 0 0 0-3.284 1.153L4.08 5.227Z" />
                    <path fillRule="evenodd" d="M5.25 13.5a3.75 3.75 0 1 0 0 7.5h13.5a3.75 3.75 0 1 0 0-7.5H5.25Zm10.5 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm3.75-.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" clipRule="evenodd" />
                </svg>


                router
            </Link>
        </div>
    </nav>
    );
};

export default NavigationBar;
