import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../provider/authProvider';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { currentUser, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Redirect to unauthorized page or home
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
