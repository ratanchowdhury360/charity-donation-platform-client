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
  FaShieldAlt
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
        switch (userRole) {
            case 'donor':
                return [
                    { path: '/dashboard', icon: FaTachometerAlt, label: 'Overview', exact: true },
                    { path: '/dashboard/donations', icon: FaHeart, label: 'My Donations' },
                    { path: '/dashboard/saved', icon: FaHeart, label: 'Saved Campaigns' },
                    { path: '/dashboard/profile', icon: FaUser, label: 'Profile' },
                ];
            case 'charity':
                return [
                    { path: '/dashboard/charity', icon: FaTachometerAlt, label: 'Overview', exact: true },
                    { path: '/dashboard/campaigns', icon: FaHeart, label: 'My Campaigns' },
                    { path: '/dashboard/create', icon: FaPlus, label: 'Create Campaign' },
                    { path: '/dashboard/donations', icon: FaUsers, label: 'Donations' },
                    { path: '/dashboard/profile', icon: FaUser, label: 'Profile' },
                ];
            case 'admin':
                return [
                    { path: '/dashboard/admin', icon: FaTachometerAlt, label: 'Overview', exact: true },
                    { path: '/dashboard/users', icon: FaUsers, label: 'Users' },
                    { path: '/dashboard/charities', icon: FaBuilding, label: 'Charities' },
                    { path: '/dashboard/campaigns', icon: FaHeart, label: 'Campaigns' },
                    { path: '/dashboard/verification', icon: FaShieldAlt, label: 'Verification' },
                    { path: '/dashboard/settings', icon: FaCog, label: 'Settings' },
                ];
            default:
                return [];
        }
    };

    const dashboardItems = getDashboardItems();

    return (
        <div className="min-h-screen bg-base-200 pt-20">
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