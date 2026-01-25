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
            <li><Link to="/" className="hover:text-primary-focus text-white transition-colors">Home</Link></li>
            <li><Link to="/campaigns" className="hover:text-primary-focus text-white transition-colors">Campaigns</Link></li>
            <li><Link to="/charities" className="hover:text-primary-focus text-white transition-colors">Charities</Link></li>
            <li><Link to="/about" className="hover:text-primary-focus text-white transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary-focus text-white font-semibold transition-colors">Contact</Link></li>
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
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-gradient-to-br from-primary/95 to-secondary/95 backdrop-blur-md rounded-box w-52 border border-primary/30"
            >
                <li className="menu-title">
                    <div className="truncate px-1 text-white">
                        {currentUser?.displayName || currentUser?.email || 'User'}
                    </div>
                </li>
                <li>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-error hover:bg-error/20">
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
        <div className="navbar fixed z-50 bg-gradient-to-r from-primary/95 via-secondary/90 to-primary/95 backdrop-blur-md shadow-xl border-b border-primary/20">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-gradient-to-br from-primary/95 to-secondary/95 backdrop-blur-md rounded-box w-52 border border-primary/30"
                    >
                        {navOptions}
                    </ul>
                </div>

                {/* Brand */}
                <Link
                    to="/"
                    className="btn btn-ghost flex items-center gap-1 sm:gap-2 hover:bg-primary/20"
                >
                    <FaHeart className="text-white text-lg sm:text-xl" />
                    <span className="font-bold text-white text-xl sm:text-2xl lg:text-3xl">
                        Charity Platform
                    </span>
                </Link>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 text-white">
                    {navOptions}
                </ul>
            </div>

            <div className="navbar-end">
                {currentUser && (
                    <div className="hidden md:block mr-2">
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
                            className="btn btn-outline btn-primary border-white text-white hover:bg-white hover:text-primary flex items-center gap-2"
                        >
                            <FaTachometerAlt />
                            Dashboard
                        </Link>
                    </div>
                )}
                {userMenu}
            </div>
        </div>
    );
};

export default Navber;
