
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../provider/authProvider';
import { FaHeart, FaUser, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';

const Navber = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const { currentUser, userRole, logout } = auth || {};
    // no local navbar menu state currently required

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
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-gradient-to-br from-primary/95 to-secondary/95 backdrop-blur-md rounded-box w-52 border border-primary/30">
                <li className="menu-title">
                    <div className="w-full truncate max-w-[180px] px-1 text-white">
                        {currentUser?.displayName || currentUser?.email || 'User'}
                    </div>
                </li>
                <li><button onClick={handleLogout} className="flex items-center gap-2 text-error hover:bg-error/20"><FaSignOutAlt /> Logout</button></li>
            </ul>
        </div>
    ) : (
        <div className="flex gap-2">
            <Link to="/login" className="btn btn-ghost">Login</Link>
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
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
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-gradient-to-br from-primary/95 to-secondary/95 backdrop-blur-md rounded-box w-52 border border-primary/30">
                        {navOptions}
                        {currentUser && (
                            <>
                                <div className="divider my-1"></div>
                                <li>
                                    <Link to={userRole === 'donor' ? '/dashboard/donor' : 
                                             userRole === 'charity' ? '/dashboard/charity' : 
                                             userRole === 'admin' ? '/dashboard/admin' : '/dashboard'}
                                          className="text-white hover:bg-white/20">
                                        Dashboard
                                    </Link>
                                </li>
                                <li><Link to="/profile" className="text-white hover:bg-white/20">Profile</Link></li>
                                {userRole === 'charity' && (
                                    <li><Link to="/campaigns/create" className="text-white hover:bg-white/20">Create Campaign</Link></li>
                                )}
                                <li><button onClick={handleLogout} className="text-error hover:bg-error/20">Logout</button></li>
                            </>
                        )}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-3xl text-white flex items-center gap-2 hover:bg-primary/20 transition-colors">
                    <FaHeart className="text-white" />
                    <span className="text-white font-bold">Charity Platform</span>
                </Link>
            </div>
            
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 text-white">
                    {navOptions}
                </ul>
            </div>
            
            <div className="navbar-end">
                {currentUser && (
                    <div className="dropdown dropdown-end mr-2 hidden md:block">
                        <Link 
                            to={userRole === 'donor' ? '/dashboard/donor' : 
                                 userRole === 'charity' ? '/dashboard/charity' : 
                                 userRole === 'admin' ? '/dashboard/admin' : '/dashboard'}
                            className="btn btn-outline btn-primary border-white text-white hover:bg-white hover:text-primary flex items-center gap-2 transition-all"
                        >
                            <FaTachometerAlt />
                            Dashboard
                        </Link>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-gradient-to-br from-primary/95 to-secondary/95 backdrop-blur-md rounded-box w-64 border border-primary/30">
                            {/* Admin dashboard shortcuts */}
                            {userRole === 'admin' && (
                                <>
                                    <li className="menu-title"><span className="text-white">Admin</span></li>
                                    <li><Link to="/dashboard/admin" className="text-white hover:bg-white/20">Overview</Link></li>
                                    <li><Link to="/dashboard/admin/users" className="text-white hover:bg-white/20">Users</Link></li>
                                    <li><Link to="/dashboard/admin/charities" className="text-white hover:bg-white/20">Charities</Link></li>
                                    <li><Link to="/dashboard/admin/campaigns" className="text-white hover:bg-white/20">Campaigns</Link></li>
                                    {/* <li><Link to="/dashboard/settings">Settings</Link></li> */}
                                    <div className="divider my-1"></div>
                                </>
                            )}

                            {/* Charity dashboard shortcuts */}
                            {userRole === 'charity' && (
                                <>
                                    <li className="menu-title"><span className="text-white">Charity</span></li>
                                    <li><Link to="/dashboard/charity" className="text-white hover:bg-white/20">Overview</Link></li>
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
                                    <li className="menu-title"><span className="text-white">Donor</span></li>
                                    <li><Link to="/dashboard" className="text-white hover:bg-white/20">Overview</Link></li>
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