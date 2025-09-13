import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
    return (
        <>
            <Helmet>
                <title>Page Not Found - Charity Platform</title>
            </Helmet>
            
            <div className="min-h-screen flex items-center justify-center bg-base-200 pt-20">
                <div className="text-center">
                    <div className="text-9xl font-bold text-primary mb-4">404</div>
                    <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/" className="btn btn-primary btn-lg">
                            <FaHome className="mr-2" />
                            Go Home
                        </Link>
                        <button onClick={() => window.history.back()} className="btn btn-outline btn-lg">
                            <FaArrowLeft className="mr-2" />
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotFound;
