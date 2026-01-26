// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../provider/authProvider';

const RoleDashboardIndex = () => {
    const { userRole, loading } = useAuth();

    // While auth state or role is being resolved, show a spinner instead of
    // prematurely sending the user to the donor dashboard.
    if (loading || !userRole) {
        return (
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-semibold mb-4">Loading...</h1>
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    if (userRole === 'admin') {
        return (
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
                <p>Welcome, Admin!</p>
                <Navigate to="/dashboard/admin" replace />
            </div>
        );
    }

    if (userRole === 'charity') {
        return <Navigate to="/dashboard/charity" replace />;
    }

    // Default to donor dashboard if no specific role or if role is 'donor'
    return <Navigate to="/dashboard/donor" replace />;
};

export default RoleDashboardIndex;
