//  //frontend/src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    FiHome,
    FiPlay,
    FiUser,
    FiLogIn,
    FiList,
    FiHeart,
    FiSettings,
} from 'react-icons/fi';
import { MdSubscriptions, MdExplore, MdTrendingUp, MdHistory } from 'react-icons/md';

function Sidebar({ hidden }) {
    const authStatus = useSelector((state) => state.auth.status);

    const navItems = [
        { name: "Home", path: "/", icon: <FiHome />, active: true },
        { name: "Shorts", path: "/shorts", icon: <FiPlay />, active: authStatus },
        { name: "Sign Up", path: "/signup", icon: <FiUser />, active: !authStatus },
        { name: "Login", path: "/login", icon: <FiLogIn />, active: !authStatus },
    ];

    return (
        <>
            {hidden && (
                <aside
                    id="sidebar"
                    className="fixed top-0 lg:top-5 left-0 z-20 flex flex-col flex-shrink-0 w-52 h-full pt-10 font-normal duration-75 lg:flex transition-width"
                    aria-label="Sidebar"
                >
                    <div className="relative flex flex-col flex-1 min-h-0 pt-0 bg-white border-r border-gray-200">
                        <div className="flex flex-col flex-1 pt-3 pb-4 overflow-y-auto">
                            <div className="flex-1 px-3 space-y-1 bg-white divide-y divide-gray-200">
                                <ul>
                                    {navItems.map(
                                        (item, index) =>
                                            item.active && (
                                                <li key={index}>
                                                    <Link
                                                        to={item.path}
                                                        className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group"
                                                    >
                                                        {item.icon}
                                                        <span className="ml-3" sidebar-toggle-item>
                                                            {item.name}
                                                        </span>
                                                    </Link>
                                                </li>
                                            )
                                    )}
                                    {authStatus && (
                                        <>
                                            <div className="divide-y divide-gray-200">
                                                <li>
                                                    <Link
                                                        to="/subscriptions"
                                                        className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group"
                                                    >
                                                        <MdSubscriptions />
                                                        <span className="ml-3" sidebar-toggle-item>
                                                            Subscriptions
                                                        </span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/your_channel"
                                                        className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group"
                                                    >
                                                        <FiUser />
                                                        <span className="ml-3" sidebar-toggle-item>
                                                            Your Channel
                                                        </span>
                                                    </Link>
                                                </li>
                                            </div>
                                            <li>
                                                <Link
                                                    to="/history"
                                                    className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group"
                                                >
                                                    <MdHistory />
                                                    <span className="ml-3" sidebar-toggle-item>
                                                        History
                                                    </span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/playlist"
                                                    className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group"
                                                >
                                                    <FiList />
                                                    <span className="ml-3" sidebar-toggle-item>
                                                        Playlist
                                                    </span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/"
                                                    className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group"
                                                >
                                                    <FiHeart />
                                                    <span className="ml-3" sidebar-toggle-item>
                                                        Liked
                                                    </span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/"
                                                    className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group"
                                                >
                                                    <MdExplore />
                                                    <span className="ml-3" sidebar-toggle-item>
                                                        Explore
                                                    </span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/"
                                                    className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group"
                                                >
                                                    <MdTrendingUp />
                                                    <span className="ml-3" sidebar-toggle-item>
                                                        Trending
                                                    </span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/settings"
                                                    className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group"
                                                >
                                                    <FiSettings />
                                                    <span className="ml-3" sidebar-toggle-item>
                                                        Settings
                                                    </span>
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </aside>
            )}
        </>
    );
}

export default Sidebar;
