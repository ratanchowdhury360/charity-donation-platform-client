import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../provider/authProvider';
import { FaHeart, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';

const Navber = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const { currentUser, userRole, logout } = auth || {};

    const handleLogout = async () => {
        try {
            if (logout) {
                await logout();
                navigate('/');
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const navOptions = (
        <>
            <li><Link to="/" className="hover:text-primary text-white transition-colors">Home</Link></li>
            <li><Link to="/campaigns" className="hover:text-primary text-white transition-colors">Campaigns</Link></li>
            <li><Link to="/charities" className="hover:text-primary text-white transition-colors">Charities</Link></li>
            <li><Link to="/about" className="hover:text-primary text-white transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary font-semibold text-white transition-colors">Contact</Link></li>
        </>
    );

    const userMenu = currentUser ? (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                    {currentUser?.photoURL ? (
                        <img alt="User" src={currentUser.photoURL} />
                    ) : (
                        <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content rounded-full w-10">
                                <span className="text-lg">
                                    {(currentUser?.displayName || currentUser?.email || 'U').charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 p-2 shadow-lg bg-white/10 backdrop-blur-md rounded-box border border-white/20 text-white"
            >
                <li className="menu-title">
                    <div className="truncate px-1 text-white">
                        {currentUser?.displayName || currentUser?.email || 'User'}
                    </div>
                </li>
                <li>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:bg-red-500/20">
                        <FaSignOutAlt /> Logout
                    </button>
                </li>
            </ul>
        </div>
    ) : (
        <div className="flex gap-1 sm:gap-2">
            <Link to="/login" className="btn btn-ghost btn-sm sm:btn-md">
                Login
            </Link>
            <Link to="/signup" className="btn btn-primary btn-sm sm:btn-md">
                Sign Up
            </Link>
        </div>
    );

    return (
        <nav className="w-full sticky top-0 z-50 backdrop-blur-xl shadow-none px-4 py-3">
            <div className="flex justify-between items-center w-full max-w-full mx-auto">
                {/* Start */}
                <div className="flex items-center gap-2">
                    {/* Mobile menu */}
                    <div className="dropdown lg:hidden">
                        <div tabIndex={0} role="button" className="btn btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 p-2 shadow-lg bg-white/10 backdrop-blur-md rounded-box border border-white/20 text-white w-52"
                        >
                            {navOptions}
                        </ul>
                    </div>

                    {/* Brand */}
                    <Link
                        to="/"
                        className="btn btn-ghost flex items-center gap-2 hover:bg-white/10"
                    >
                        <FaHeart className="text-white text-xl" />
                        <span className="font-bold text-white text-xl sm:text-2xl lg:text-3xl">
                            Charity Platform
                        </span>
                    </Link>
                </div>

                {/* Center */}
                <div className="hidden bg-transparent lg:flex">
                    <ul className="menu menu-horizontal  px-1 text-white gap-2">
                        {navOptions}
                    </ul>
                </div>

                {/* End */}
                <div className="flex items-center gap-2">
                    {currentUser && (
                        <div className="hidden md:block">
                            <Link
                                to={
                                    userRole === 'donor'
                                        ? '/dashboard/donor'
                                        : userRole === 'charity'
                                        ? '/dashboard/charity'
                                        : userRole === 'admin'
                                        ? '/dashboard/admin'
                                        : '/dashboard'
                                }
                                className="btn btn-outline border-white text-white hover:bg-white hover:text-primary flex items-center gap-2"
                            >
                                <FaTachometerAlt />
                                Dashboard
                            </Link>
                        </div>
                    )}
                    {userMenu}
                </div>
            </div>
        </nav>
    );
};

export default Navber;
