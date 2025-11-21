import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../provider/authProvider';
import {
  FaTachometerAlt,
  FaHeart,
  FaPlus,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaBuilding,
  FaShieldAlt,
  FaStar,
  FaHourglassEnd,
  FaInbox
} from 'react-icons/fa';

const Dashboard = () => {
    const { userRole, logout } = useAuth();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const getDashboardItems = () => {
        const basePath = userRole === 'donor' ? '/dashboard/donor' : 
                        userRole === 'charity' ? '/dashboard/charity' : 
                        userRole === 'admin' ? '/dashboard/admin' : '/dashboard';
                        
        const items = [
            { path: basePath, icon: FaTachometerAlt, label: 'Overview', exact: true }
        ];

        if (userRole === 'donor') {
            items.push(
                { path: `${basePath}/donations`, icon: FaHeart, label: 'My Donations' },
                { path: `${basePath}/saved`, icon: FaHeart, label: 'All Campaigns' },
                { path: `${basePath}/reviews`, icon: FaStar, label: 'My Reviews' },
                { path: `${basePath}/profile`, icon: FaUser, label: 'Profile' }
            );
        } else if (userRole === 'charity') {
            items.push(
                { path: `${basePath}/campaigns`, icon: FaHeart, label: 'My Campaigns' },
                { path: `${basePath}/campaigns/create`, icon: FaPlus, label: 'Create Campaign' },
                { path: `${basePath}/reviews`, icon: FaStar, label: 'My Reviews' },
                { path: `${basePath}/profile`, icon: FaUser, label: 'Profile' }
            );
        } else if (userRole === 'admin') {
            items.push(
                { path: `${basePath}/users`, icon: FaUsers, label: 'Users' },
                { path: `${basePath}/charities`, icon: FaBuilding, label: 'Charities' },
                { path: `${basePath}/campaigns`, icon: FaHeart, label: 'Campaigns' },
                { path: `${basePath}/campaigns/archived`, icon: FaHourglassEnd, label: 'Archived' },
                { path: `${basePath}/messages`, icon: FaInbox, label: 'Messages' },
                { path: `${basePath}/settings`, icon: FaCog, label: 'Settings' },
                { path: `${basePath}/profile`, icon: FaUser, label: 'Profile' }
            );
        }

        return items;
    };

    const dashboardItems = getDashboardItems();

    return (
        <div className="min-h-screen bg-base-200 pt-20">
            <div className="navbar fixed top-0 left-0 right-0 bg-gradient-to-r from-primary/90 via-secondary/80 to-primary/90 backdrop-blur-sm shadow-lg z-50">
                <div className="flex-1">
                    <Link to="/" className="btn btn-ghost normal-case text-xl">
                        Charity Platform
                    </Link>
                    <span className="ml-2 badge badge-primary badge-outline">
                        {userRole === 'donor' && 'Donor Dashboard'}
                        {userRole === 'charity' && 'Charity Dashboard'}
                        {userRole === 'admin' && 'Admin Dashboard'}
                    </span>
                </div>
                <div className="flex-none">
                    <Link to="/" className="btn btn-ghost">Home</Link>
                </div>
                <div className="flex-none gap-2 pr-4">
                    <button onClick={handleLogout} className="btn btn-ghost gap-2">
                        <FaSignOutAlt />
                        Sign Out
                    </button>
                </div>
            </div>
            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-base-100 shadow-lg min-h-screen">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-8">
                            {userRole === 'donor' && 'Donor Dashboard'}
                            {userRole === 'charity' && 'Charity Dashboard'}
                            {userRole === 'admin' && 'Admin Dashboard'}
                        </h2>
                        
                        <nav className="space-y-2">
                            {dashboardItems.map((item) => {
                                const isActive = item.exact 
                                    ? location.pathname === item.path
                                    : location.pathname.startsWith(item.path);
                                
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                            isActive 
                                                ? 'bg-primary text-white' 
                                                : 'hover:bg-base-200'
                                        }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="mt-8 pt-8 border-t">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-error hover:text-white transition-colors w-full text-left"
                            >
                                <FaSignOutAlt className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;