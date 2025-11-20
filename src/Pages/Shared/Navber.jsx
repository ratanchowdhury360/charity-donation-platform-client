
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../provider/authProvider';
import { FaHeart, FaUser, FaSignOutAlt, FaTachometerAlt, FaMoon, FaSun } from 'react-icons/fa';

const Navber = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const { currentUser, userRole, logout } = auth || {};
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'light';
        }
        return 'light';
    });
    // no local navbar menu state currently required

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', theme);
        }
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', theme);
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

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
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/campaigns" className="hover:text-primary">Campaigns</Link></li>
            <li><Link to="/charities" className="hover:text-primary">Charities</Link></li>
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
        </>
    );

    const userMenu = currentUser ? (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                    {currentUser?.photoURL ? (
                        <img 
                            alt="User" 
                            src={currentUser.photoURL} 
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
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
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li className="menu-title">
                    <div className="w-full truncate max-w-[180px] px-1">
                        {currentUser?.displayName || currentUser?.email || 'User'}
                    </div>
                </li>
                <li><button onClick={handleLogout} className="flex items-center gap-2 text-error"><FaSignOutAlt /> Logout</button></li>
            </ul>
        </div>
    ) : (
        <div className="flex gap-2">
            <Link to="/login" className="btn btn-ghost">Login</Link>
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
        </div>
    );

    return (
        <div className="navbar fixed z-50 bg-base-100/95 backdrop-blur-sm shadow-lg">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        {navOptions}
                        {currentUser && (
                            <>
                                <div className="divider my-1"></div>
                                <li>
                                    <Link to={userRole === 'donor' ? '/dashboard/donor' : 
                                             userRole === 'charity' ? '/dashboard/charity' : 
                                             userRole === 'admin' ? '/dashboard/admin' : '/dashboard'}>
                                        Dashboard
                                    </Link>
                                </li>
                                <li><Link to="/profile">Profile</Link></li>
                                {userRole === 'charity' && (
                                    <li><Link to="/campaigns/create">Create Campaign</Link></li>
                                )}
                                <li><button onClick={handleLogout} className="text-error">Logout</button></li>
                            </>
                        )}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-xl flex items-center gap-2">
                    <FaHeart className="text-primary" />
                    Charity Platform
                </Link>
            </div>
            
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navOptions}
                </ul>
            </div>
            
            <div className="navbar-end">
                <button
                    onClick={toggleTheme}
                    className="btn btn-ghost btn-circle mr-2"
                    aria-label="Toggle color theme"
                    title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                >
                    {theme === 'light' ? <FaMoon className="text-xl" /> : <FaSun className="text-xl" />}
                </button>
                {currentUser && (
                    <div className="dropdown dropdown-end mr-2 hidden md:block">
                        <Link 
                            to={userRole === 'donor' ? '/dashboard/donor' : 
                                 userRole === 'charity' ? '/dashboard/charity' : 
                                 userRole === 'admin' ? '/dashboard/admin' : '/dashboard'}
                            className="btn btn-outline flex items-center gap-2"
                        >
                            <FaTachometerAlt />
                            Dashboard
                        </Link>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-64">
                            {/* Admin dashboard shortcuts */}
                            {userRole === 'admin' && (
                                <>
                                    <li className="menu-title"><span>Admin</span></li>
                                    <li><Link to="/dashboard/admin">Overview</Link></li>
                                    <li><Link to="/dashboard/admin/users">Users</Link></li>
                                    <li><Link to="/dashboard/admin/charities">Charities</Link></li>
                                    <li><Link to="/dashboard/admin/campaigns">Campaigns</Link></li>
                                    {/* <li><Link to="/dashboard/settings">Settings</Link></li> */}
                                    <div className="divider my-1"></div>
                                </>
                            )}

                            {/* Charity dashboard shortcuts */}
                            {userRole === 'charity' && (
                                <>
                                    <li className="menu-title"><span>Charity</span></li>
                                    <li><Link to="/dashboard/charity">Overview</Link></li>
                                    {/* <li><Link to="/dashboard/campaigns">My Campaigns</Link></li>
                                    <li><Link to="/dashboard/create">Create Campaign</Link></li>
                                    <li><Link to="/dashboard/donations">Donations</Link></li>
                                    <li><Link to="/dashboard/profile">Profile</Link></li> */}
                                    <div className="divider my-1"></div>
                                </>
                            )}

                            {/* Donor dashboard shortcuts */}
                            {(!userRole || userRole === 'donor') && (
                                <>
                                    <li className="menu-title"><span>Donor</span></li>
                                    <li><Link to="/dashboard">Overview</Link></li>
                                    {/* <li><Link to="/dashboard/donations">My Donations</Link></li>
                                    <li><Link to="/dashboard/saved">Saved Campaigns</Link></li>
                                    <li><Link to="/dashboard/profile">Profile</Link></li> */}
                                </>
                            )}
                        </ul>
                    </div>
                )}
                {userMenu}
            </div>
        </div>
    );
};

export default Navber;