import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaUsers, FaBuilding, FaHeart, FaShieldAlt, FaChartLine, FaClock, FaMoneyBillWave, FaCheckCircle, FaHourglassEnd } from 'react-icons/fa';
import { getCampaignsByStatus, getCampaigns } from '../../utils/campaignStorage';
import { db } from '../../firebase/firebase.config';
import { collection, getCountFromServer } from 'firebase/firestore';

const AdminDashboard = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalCharities, setTotalCharities] = useState(0);
    const [activeCampaigns, setActiveCampaigns] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [totalRaised, setTotalRaised] = useState(0);
    const [loading, setLoading] = useState(true);
    const [completedCount, setCompletedCount] = useState(0);
    const [archivedCount, setArchivedCount] = useState(0);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Get all campaigns
            const [allCampaigns, pending, approved] = await Promise.all([
                getCampaigns(),
                getCampaignsByStatus('pending'),
                getCampaignsByStatus('approved')
            ]);
            
            // Count active campaigns (approved and end date not passed)
            const now = new Date();
            now.setHours(0, 0, 0, 0); // Reset time to start of day
            const active = approved.filter(campaign => {
                const endDate = new Date(campaign.endDate);
                endDate.setHours(23, 59, 59, 999); // Set to end of day
                return endDate >= now;
            });
            
            // Count unique charities
            const uniqueCharities = new Set(allCampaigns.map(c => c.charityId));
            
            // Calculate total raised amount
            const totalRaisedAmount = allCampaigns.reduce((sum, c) => sum + (c.currentAmount || 0), 0);
            
            // Get total users from Firestore 'users' collection
            const coll = collection(db, 'users');
            const snapshot = await getCountFromServer(coll);
            
            const completed = allCampaigns.filter(c => (c.currentAmount || 0) >= c.goalAmount);
            const archived = allCampaigns.filter(c => new Date(c.endDate) < now);

            setTotalUsers(snapshot.data().count || 0);
            setTotalCharities(uniqueCharities.size);
            setActiveCampaigns(active.length);
            setPendingCount(pending.length);
            setTotalRaised(totalRaisedAmount);
            setCompletedCount(completed.length);
            setArchivedCount(archived.length);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

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

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
                    <div className="card bg-gradient-to-br from-success to-success/80 text-white shadow-xl hover:shadow-2xl transition-shadow">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Total Raised</p>
                                    {loading ? (
                                        <span className="loading loading-spinner loading-sm"></span>
                                    ) : (
                                        <p className="text-2xl font-bold">৳{totalRaised.toLocaleString()}</p>
                                    )}
                                    <p className="text-xs opacity-75 mt-1">All donations</p>
                                </div>
                                <FaMoneyBillWave className="text-4xl opacity-30" />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-red-100 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Users</p>
                                    {loading ? (
                                        <span className="loading loading-spinner loading-sm"></span>
                                    ) : (
                                        <p className="text-2xl font-bold text-primary">{totalUsers}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">Registered accounts</p>
                                </div>
                                <FaUsers className="text-3xl text-primary opacity-60" />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-green-200 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Charities</p>
                                    {loading ? (
                                        <span className="loading loading-spinner loading-sm"></span>
                                    ) : (
                                        <p className="text-2xl font-bold text-secondary">{totalCharities}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">Registered charities</p>
                                </div>
                                <FaBuilding className="text-3xl text-secondary opacity-60" />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-red-200 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="card-body bg-gradient-to-br">
                            <div className="flex bg-gradient-to-br items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Active Campaigns</p>
                                    {loading ? (
                                        <span className="loading loading-spinner loading-sm"></span>
                                    ) : (
                                        <p className="text-2xl font-bold text-info">{activeCampaigns}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">Approved & ongoing</p>
                                </div>
                                <FaHeart className="text-3xl text-info opacity-60" />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-green-200 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Pending Reviews</p>
                                    <p className="text-2xl font-bold text-warning">{pendingCount}</p>
                                    <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
                                </div>
                                <FaClock className="text-3xl text-warning opacity-60" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link
                        to="/campaigns?view=completed"
                        className="card bg-gradient-to-br from-success/20 via-success/10 to-success/5 shadow-lg border border-success/30 hover:shadow-2xl transition-all hover:scale-105"
                    >
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-base-content/70 font-medium">Completed Campaigns</p>
                                    <p className="text-3xl font-bold text-success">{completedCount}</p>
                                    <p className="text-xs text-base-content/60 mt-1">Targets achieved across the platform</p>
                                </div>
                                <FaCheckCircle className="text-4xl text-success/70" />
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/dashboard/admin/campaigns/archived"
                        className="card bg-gradient-to-br from-warning/20 via-warning/10 to-warning/5 shadow-lg border border-warning/30 hover:shadow-2xl transition-all hover:scale-105"
                    >
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-base-content/70 font-medium">Ended Campaigns</p>
                                    <p className="text-3xl font-bold text-warning">{archivedCount}</p>
                                    <p className="text-xs text-base-content/60 mt-1">Awaiting extension & follow-up</p>
                                </div>
                                <FaHourglassEnd className="text-4xl text-warning/70" />
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="card bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5 shadow-lg border border-primary/20">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link 
                                to="/dashboard/admin/campaigns" 
                                className="btn btn-warning btn-lg justify-start"
                            >
                                <FaClock className="mr-2" />
                                <div className="text-left">
                                    <div>Review Campaigns</div>
                                    <div className="text-xs opacity-70">{pendingCount} pending approval</div>
                                </div>
                            </Link>
                            <Link 
                                to="/dashboard/admin/campaigns/archived" 
                                className="btn btn-info btn-lg justify-start"
                            >
                                <FaHourglassEnd className="mr-2" />
                                <div className="text-left">
                                    <div>Manage Extensions</div>
                                    <div className="text-xs opacity-70">{archivedCount} waiting to reopen</div>
                                </div>
                            </Link>
                            <Link 
                                to="/dashboard/admin/messages" 
                                className="btn btn-success btn-lg justify-start"
                            >
                                <FaChartLine className="mr-2" />
                                <div className="text-left">
                                    <div>Review Messages</div>
                                    <div className="text-xs opacity-70">Stay on top of contact requests</div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
