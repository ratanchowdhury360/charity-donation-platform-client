import React from 'react';
import { Helmet } from 'react-helmet';
import { FaHeart, FaDollarSign, FaUsers, FaChartLine, FaPlus } from 'react-icons/fa';

const CharityDashboard = () => {
    return (
        <>
            <Helmet>
                <title>Charity Dashboard - Charity Platform</title>
            </Helmet>

            <div className="space-y-8">
                <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-6">
                    <h1 className="text-3xl font-bold mb-2">Charity Dashboard</h1>
                    <p className="text-lg opacity-90">Manage your campaigns and track donations</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Active Campaigns</p>
                                    <p className="text-2xl font-bold text-primary">5</p>
                                </div>
                                <FaHeart className="text-3xl text-primary opacity-60" />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Raised</p>
                                    <p className="text-2xl font-bold text-secondary">250,000 BDT</p>
                                </div>
                                <FaDollarSign className="text-3xl text-secondary opacity-60" />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Donors</p>
                                    <p className="text-2xl font-bold text-accent">156</p>
                                </div>
                                <FaUsers className="text-3xl text-accent opacity-60" />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Success Rate</p>
                                    <p className="text-2xl font-bold text-info">87%</p>
                                </div>
                                <FaChartLine className="text-3xl text-info opacity-60" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button className="btn btn-primary btn-lg">
                                <FaPlus className="mr-2" />
                                Create Campaign
                            </button>
                            <button className="btn btn-outline btn-lg">
                                <FaChartLine className="mr-2" />
                                View Analytics
                            </button>
                            <button className="btn btn-outline btn-lg">
                                <FaUsers className="mr-2" />
                                Manage Donors
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CharityDashboard;
