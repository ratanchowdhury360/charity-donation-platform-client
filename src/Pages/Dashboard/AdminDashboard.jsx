import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FaUsers, FaBuilding, FaHeart, FaShieldAlt, FaChartLine } from 'react-icons/fa';

const AdminDashboard = () => {
    return (
        <>
            <Helmet>
                <title>Admin Dashboard - Charity Platform</title>
            </Helmet>

            <div className="space-y-8">
                <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-6">
                    <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-lg opacity-90">Manage platform operations and oversee all activities</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Users</p>
                                    <p className="text-2xl font-bold text-primary">2,500</p>
                                </div>
                                <FaUsers className="text-3xl text-primary opacity-60" />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Verified Charities</p>
                                    <p className="text-2xl font-bold text-secondary">45</p>
                                </div>
                                <FaBuilding className="text-3xl text-secondary opacity-60" />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Active Campaigns</p>
                                    <p className="text-2xl font-bold text-accent">150</p>
                                </div>
                                <FaHeart className="text-3xl text-accent opacity-60" />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Pending Reviews</p>
                                    <p className="text-2xl font-bold text-info">12</p>
                                </div>
                                <FaShieldAlt className="text-3xl text-info opacity-60" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <button className="btn btn-primary btn-lg">
                                <FaUsers className="mr-2" />
                                Manage Users
                            </button>
                            <button className="btn btn-outline btn-lg">
                                <FaBuilding className="mr-2" />
                                Verify Charities
                            </button>
                            <button className="btn btn-outline btn-lg">
                                <FaHeart className="mr-2" />
                                Review Campaigns
                            </button>
                            <button className="btn btn-outline btn-lg">
                                <FaChartLine className="mr-2" />
                                View Analytics
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
