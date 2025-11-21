import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../provider/authProvider';
import { getCampaigns } from '../../utils/campaignStorage';
import { getAllCampaignDonorCounts } from '../../utils/donationStorage';
import { getUserMessages } from '../../utils/messageStorage';
import { FaHeart, FaDollarSign, FaUsers, FaChartLine, FaPlus, FaCheckCircle, FaHourglassEnd, FaInbox } from 'react-icons/fa';

const CharityDashboard = () => {
    const location = useLocation();
    const { currentUser } = useAuth();
    const [successMessage, setSuccessMessage] = useState('');
    const [stats, setStats] = useState({
        activeCampaigns: 0,
        totalRaised: 0,
        totalDonors: 0,
        successRate: 0,
        totalCampaigns: 0,
        pendingCampaigns: 0,
        approvedCampaigns: 0
    });
    const [loading, setLoading] = useState(true);
    const [lifecycleCounts, setLifecycleCounts] = useState({ completed: 0, archived: 0 });
    const [messageThreads, setMessageThreads] = useState([]);

    useEffect(() => {
        // Check for success message from navigation state
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            // Clear the message after 5 seconds
            setTimeout(() => setSuccessMessage(''), 5000);
            // Clear the state to prevent showing message on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    useEffect(() => {
        const fetchCharityStats = async () => {
            try {
                if (!currentUser) {
                    setLoading(false);
                    return;
                }

                // Get all campaigns
                const allCampaigns = await getCampaigns();
                
                // Filter campaigns by this charity (using user's email or uid as charityId)
                const charityCampaigns = allCampaigns.filter(
                    campaign => campaign.charityId === currentUser.uid || campaign.charityEmail === currentUser.email
                );

                // Calculate total raised from charity's campaigns
                const totalRaised = charityCampaigns.reduce((sum, c) => sum + (c.currentAmount || 0), 0);

                // Get current date for comparison
                const now = new Date();
                now.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

                // Count active campaigns (approved and end date not passed)
                const activeCampaigns = charityCampaigns.filter(campaign => {
                    const endDate = new Date(campaign.endDate);
                    endDate.setHours(23, 59, 59, 999); // Set to end of day
                    return campaign.status === 'approved' && endDate >= now;
                }).length;

                // Count campaigns by status (only those not expired)
                const approvedCampaigns = charityCampaigns.filter(c => {
                    const endDate = new Date(c.endDate);
                    endDate.setHours(23, 59, 59, 999);
                    return c.status === 'approved' && endDate >= now;
                }).length;
                
                const pendingCampaigns = charityCampaigns.filter(c => c.status === 'pending').length;

                // Calculate total unique donors across all charity campaigns
                const donorCounts = await getAllCampaignDonorCounts();
                const totalDonors = charityCampaigns.reduce((sum, campaign) => {
                    return sum + (donorCounts[campaign.id] || 0);
                }, 0);

                // Calculate average success rate based on percentage of goal reached
                // Success rate = average of (currentAmount / goalAmount * 100) for all campaigns
                const totalSuccessPercentage = charityCampaigns.reduce((sum, campaign) => {
                    const percentage = (campaign.currentAmount || 0) / campaign.goalAmount * 100;
                    // Cap at 100% per campaign for average calculation
                    return sum + Math.min(percentage, 100);
                }, 0);
                
                const successRate = charityCampaigns.length > 0 
                    ? Math.round(totalSuccessPercentage / charityCampaigns.length)
                    : 0;

                const completedCount = charityCampaigns.filter(c => (c.currentAmount || 0) >= c.goalAmount).length;
                const archivedCount = charityCampaigns.filter(c => {
                    const endDate = new Date(c.endDate);
                    endDate.setHours(23, 59, 59, 999);
                    return endDate < now;
                }).length;

                setStats({
                    activeCampaigns,
                    totalRaised,
                    totalDonors,
                    successRate,
                    totalCampaigns: charityCampaigns.length,
                    pendingCampaigns,
                    approvedCampaigns
                });
                setLifecycleCounts({ completed: completedCount, archived: archivedCount });

                if (currentUser?.uid) {
                    const inbox = await getUserMessages(currentUser.uid);
                    setMessageThreads(inbox);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching charity stats:', error);
                setLoading(false);
            }
        };

        fetchCharityStats();
    }, [currentUser]);

    return (
        <>
            <Helmet>
                <title>Charity Dashboard - Charity Platform</title>
            </Helmet>

            <div className="space-y-8">
                {/* Success Message */}
                {successMessage && (
                    <div className="alert alert-success shadow-lg">
                        <FaCheckCircle className="text-2xl" />
                        <span className="text-lg">{successMessage}</span>
                    </div>
                )}

                <div className="bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-600 text-white rounded-lg p-6 shadow-xl border-2 border-teal-400/30">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Charity Dashboard</h1>
                            <p className="text-lg opacity-95">Manage your campaigns and track donations</p>
                        </div>
                        <Link 
                            to="/dashboard/charity/campaigns/create" 
                            className="btn bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 hover:from-pink-600 hover:to-purple-700 shadow-lg mt-4 md:mt-0"
                        >
                            <FaPlus className="mr-2" /> Create Campaign
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="card bg-gradient-to-br from-teal-500 via-cyan-500 to-teal-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all border-2 border-teal-400">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold">Active Campaigns</p>
                                        <p className="text-3xl font-black">{stats.activeCampaigns}</p>
                                        <p className="text-xs opacity-90 mt-1">Approved & ongoing</p>
                                    </div>
                                    <FaHeart className="text-5xl opacity-30" />
                                </div>
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all border-2 border-emerald-400">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold">Total Raised</p>
                                        <p className="text-3xl font-black">৳{stats.totalRaised.toLocaleString()}</p>
                                        <p className="text-xs opacity-90 mt-1">All campaigns</p>
                                    </div>
                                    <FaDollarSign className="text-5xl opacity-30" />
                                </div>
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all border-2 border-purple-400">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold">Total Donors</p>
                                        <p className="text-3xl font-black">{stats.totalDonors}</p>
                                        <p className="text-xs opacity-90 mt-1">Unique contributors</p>
                                    </div>
                                    <FaUsers className="text-5xl opacity-30" />
                                </div>
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all border-2 border-blue-400">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold">Success Rate</p>
                                        <p className="text-3xl font-black">{stats.successRate}%</p>
                                        <p className="text-xs opacity-90 mt-1">Goals reached</p>
                                    </div>
                                    <FaChartLine className="text-5xl opacity-30" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link to="/dashboard/charity/campaigns" className="card bg-gradient-to-br from-emerald-200 via-green-200 to-emerald-200 shadow-lg border-2 border-emerald-400 hover:shadow-xl transition-all hover:scale-105">
                            <div className="card-body flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-emerald-900 font-bold">Completed targets</p>
                                    <p className="text-3xl font-black text-emerald-800">{lifecycleCounts.completed}</p>
                                    <p className="text-xs text-emerald-700 mt-1 font-medium">Great storytelling material</p>
                                </div>
                                <FaCheckCircle className="text-4xl text-emerald-600" />
                            </div>
                        </Link>
                        <Link to="/dashboard/charity/campaigns" className="card bg-gradient-to-br from-amber-200 via-orange-200 to-amber-200 shadow-lg border-2 border-amber-400 hover:shadow-xl transition-all hover:scale-105">
                            <div className="card-body flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-amber-900 font-bold">Ended timelines</p>
                                    <p className="text-3xl font-black text-amber-800">{lifecycleCounts.archived}</p>
                                    <p className="text-xs text-amber-700 mt-1 font-medium">Request an extension from admin</p>
                                </div>
                                <FaHourglassEnd className="text-4xl text-amber-600" />
                            </div>
                        </Link>
                    </div>
                )}

                {/* Campaign Overview */}
                <div className="card bg-gradient-to-br from-teal-100 via-cyan-100 to-teal-100 shadow-lg border-2 border-teal-300">
                    <div className="card-body">
                        <h2 className="card-title mb-4 text-teal-900 font-bold">Campaign Overview</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="stat bg-gradient-to-br from-teal-200 to-cyan-200 rounded-lg p-4 border-2 border-teal-300 shadow-md">
                                <div className="stat-title text-sm text-teal-900 font-bold">Total Campaigns</div>
                                <div className="stat-value text-2xl text-teal-800 font-black">{stats.totalCampaigns}</div>
                                <div className="stat-desc text-teal-700 font-medium">All time</div>
                            </div>
                            <div className="stat bg-gradient-to-br from-emerald-200 to-green-200 rounded-lg p-4 border-2 border-emerald-300 shadow-md">
                                <div className="stat-title text-sm text-emerald-900 font-bold">Approved</div>
                                <div className="stat-value text-2xl text-emerald-800 font-black">{stats.approvedCampaigns}</div>
                                <div className="stat-desc text-emerald-700 font-medium">Live campaigns</div>
                            </div>
                            <div className="stat bg-gradient-to-br from-amber-200 to-orange-200 rounded-lg p-4 border-2 border-amber-300 shadow-md">
                                <div className="stat-title text-sm text-amber-900 font-bold">Pending</div>
                                <div className="stat-value text-2xl text-amber-800 font-black">{stats.pendingCampaigns}</div>
                                <div className="stat-desc text-amber-700 font-medium">Awaiting approval</div>
                            </div>
                            <div className="stat bg-gradient-to-br from-blue-200 to-indigo-200 rounded-lg p-4 border-2 border-blue-300 shadow-md">
                                <div className="stat-title text-sm text-blue-900 font-bold">Active</div>
                                <div className="stat-value text-2xl text-blue-800 font-black">{stats.activeCampaigns}</div>
                                <div className="stat-desc text-blue-700 font-medium">Currently running</div>
                            </div>
                        </div>
                    </div>
                </div>

                {currentUser && (
                    <div className="card bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-100 shadow-lg border-2 border-blue-300">
                        <div className="card-body">
                            <div className="flex items-center gap-3 mb-4">
                                <FaInbox className="text-blue-600 text-2xl" />
                                <div>
                                    <h2 className="card-title mb-0 text-blue-900 font-bold">Admin Messages</h2>
                                    <p className="text-sm text-blue-700 font-medium">Platform updates and replies to your support requests</p>
                                </div>
                            </div>
                            {messageThreads.length === 0 ? (
                                <div className="text-center py-6 text-blue-700 font-medium">
                                    Nothing pending. <Link to="/contact" className="link text-blue-600 font-bold hover:text-blue-800">Reach out</Link> if you need anything.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messageThreads.slice(0, 3).map((thread) => {
                                        const latestReply = thread.replies?.[thread.replies.length - 1];
                                        return (
                                            <div key={thread.id} className="border-2 border-blue-300 rounded-lg p-4 bg-white/50 backdrop-blur-sm">
                                                <div className="flex justify-between text-sm text-blue-800 font-bold mb-2">
                                                    <span>{thread.subject}</span>
                                                    <span>{new Date(thread.updatedAt || thread.createdAt).toLocaleString()}</span>
                                                </div>
                                                <p className="text-blue-900 text-sm mb-2 line-clamp-2 font-medium">{thread.message}</p>
                                                {latestReply ? (
                                                    <div className="bg-blue-100 rounded p-3 text-sm text-blue-900 border border-blue-300">
                                                        <p className="font-bold text-blue-800 mb-1">
                                                            {latestReply.actorType === 'admin' ? 'Admin' : 'You'} •{' '}
                                                            {new Date(latestReply.createdAt).toLocaleString()}
                                                        </p>
                                                        <p className="line-clamp-3 font-medium">{latestReply.message}</p>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-blue-700 font-medium">Awaiting admin response</p>
                                                )}
                                            </div>
                                        );
                                    })}
                                    <Link to="/contact#inbox" className="btn btn-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 hover:from-blue-600 hover:to-indigo-700 shadow-lg w-fit">
                                        View all messages
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="card bg-gradient-to-br from-teal-100 via-cyan-100 to-teal-100 shadow-lg border-2 border-teal-300">
                    <div className="card-body">
                        <h2 className="card-title mb-4 text-teal-900 font-bold">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link to="/dashboard/charity/campaigns/create" className="btn bg-gradient-to-r from-teal-500 to-cyan-600 text-white border-0 btn-lg hover:from-teal-600 hover:to-cyan-700 shadow-lg">
                                <FaPlus className="mr-2" />
                                Create Campaign
                            </Link>
                            <Link to="/dashboard/charity/campaigns" className="btn btn-outline btn-lg border-teal-400 text-teal-700 hover:bg-teal-100">
                                <FaHeart className="mr-2" />
                                View My Campaigns
                            </Link>
                            <Link to="/dashboard/charity/profile" className="btn btn-outline btn-lg border-purple-400 text-purple-700 hover:bg-purple-100">
                                <FaUsers className="mr-2" />
                                Edit Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CharityDashboard;
