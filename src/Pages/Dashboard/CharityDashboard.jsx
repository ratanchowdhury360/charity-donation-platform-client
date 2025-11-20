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

                <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Charity Dashboard</h1>
                            <p className="text-lg opacity-90">Manage your campaigns and track donations</p>
                        </div>
                        <Link 
                            to="/dashboard/charity/campaigns/create" 
                            className="btn btn-accent mt-4 md:mt-0"
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
                        <div className="card bg-gradient-to-br from-primary to-primary/80 text-white shadow-xl hover:shadow-2xl transition-shadow">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm opacity-90">Active Campaigns</p>
                                        <p className="text-3xl font-bold">{stats.activeCampaigns}</p>
                                        <p className="text-xs opacity-75 mt-1">Approved & ongoing</p>
                                    </div>
                                    <FaHeart className="text-5xl opacity-30" />
                                </div>
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-success to-success/80 text-white shadow-xl hover:shadow-2xl transition-shadow">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm opacity-90">Total Raised</p>
                                        <p className="text-3xl font-bold">৳{stats.totalRaised.toLocaleString()}</p>
                                        <p className="text-xs opacity-75 mt-1">All campaigns</p>
                                    </div>
                                    <FaDollarSign className="text-5xl opacity-30" />
                                </div>
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-secondary to-secondary/80 text-white shadow-xl hover:shadow-2xl transition-shadow">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm opacity-90">Total Donors</p>
                                        <p className="text-3xl font-bold">{stats.totalDonors}</p>
                                        <p className="text-xs opacity-75 mt-1">Unique contributors</p>
                                    </div>
                                    <FaUsers className="text-5xl opacity-30" />
                                </div>
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-info to-info/80 text-white shadow-xl hover:shadow-2xl transition-shadow">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm opacity-90">Success Rate</p>
                                        <p className="text-3xl font-bold">{stats.successRate}%</p>
                                        <p className="text-xs opacity-75 mt-1">Goals reached</p>
                                    </div>
                                    <FaChartLine className="text-5xl opacity-30" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link to="/dashboard/charity/campaigns" className="card bg-base-100 shadow-lg border border-success/30 hover:shadow-xl transition-shadow">
                            <div className="card-body flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Completed targets</p>
                                    <p className="text-3xl font-bold text-success">{lifecycleCounts.completed}</p>
                                    <p className="text-xs text-gray-400 mt-1">Great storytelling material</p>
                                </div>
                                <FaCheckCircle className="text-4xl text-success/70" />
                            </div>
                        </Link>
                        <Link to="/dashboard/charity/campaigns" className="card bg-base-100 shadow-lg border border-warning/30 hover:shadow-xl transition-shadow">
                            <div className="card-body flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Ended timelines</p>
                                    <p className="text-3xl font-bold text-warning">{lifecycleCounts.archived}</p>
                                    <p className="text-xs text-gray-400 mt-1">Request an extension from admin</p>
                                </div>
                                <FaHourglassEnd className="text-4xl text-warning/70" />
                            </div>
                        </Link>
                    </div>
                )}

                {/* Campaign Overview */}
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Campaign Overview</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="stat bg-base-200 rounded-lg p-4">
                                <div className="stat-title text-sm">Total Campaigns</div>
                                <div className="stat-value text-2xl text-primary">{stats.totalCampaigns}</div>
                                <div className="stat-desc">All time</div>
                            </div>
                            <div className="stat bg-base-200 rounded-lg p-4">
                                <div className="stat-title text-sm">Approved</div>
                                <div className="stat-value text-2xl text-success">{stats.approvedCampaigns}</div>
                                <div className="stat-desc">Live campaigns</div>
                            </div>
                            <div className="stat bg-base-200 rounded-lg p-4">
                                <div className="stat-title text-sm">Pending</div>
                                <div className="stat-value text-2xl text-warning">{stats.pendingCampaigns}</div>
                                <div className="stat-desc">Awaiting approval</div>
                            </div>
                            <div className="stat bg-base-200 rounded-lg p-4">
                                <div className="stat-title text-sm">Active</div>
                                <div className="stat-value text-2xl text-info">{stats.activeCampaigns}</div>
                                <div className="stat-desc">Currently running</div>
                            </div>
                        </div>
                    </div>
                </div>

                {currentUser && (
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <div className="flex items-center gap-3 mb-4">
                                <FaInbox className="text-primary text-2xl" />
                                <div>
                                    <h2 className="card-title mb-0">Admin Messages</h2>
                                    <p className="text-sm text-gray-500">Platform updates and replies to your support requests</p>
                                </div>
                            </div>
                            {messageThreads.length === 0 ? (
                                <div className="text-center py-6 text-gray-500">
                                    Nothing pending. <Link to="/contact" className="link link-primary">Reach out</Link> if you need anything.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messageThreads.slice(0, 3).map((thread) => {
                                        const latestReply = thread.replies?.[thread.replies.length - 1];
                                        return (
                                            <div key={thread.id} className="border border-base-200 rounded-lg p-4">
                                                <div className="flex justify-between text-sm text-gray-500 mb-2">
                                                    <span>{thread.subject}</span>
                                                    <span>{new Date(thread.updatedAt || thread.createdAt).toLocaleString()}</span>
                                                </div>
                                                <p className="text-gray-700 text-sm mb-2 line-clamp-2">{thread.message}</p>
                                                {latestReply ? (
                                                    <div className="bg-base-200 rounded p-3 text-sm text-gray-700">
                                                        <p className="font-semibold text-primary mb-1">
                                                            {latestReply.actorType === 'admin' ? 'Admin' : 'You'} •{' '}
                                                            {new Date(latestReply.createdAt).toLocaleString()}
                                                        </p>
                                                        <p className="line-clamp-3">{latestReply.message}</p>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-gray-500">Awaiting admin response</p>
                                                )}
                                            </div>
                                        );
                                    })}
                                    <Link to="/contact#inbox" className="btn btn-sm btn-primary w-fit">
                                        View all messages
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link to="/dashboard/charity/campaigns/create" className="btn btn-primary btn-lg">
                                <FaPlus className="mr-2" />
                                Create Campaign
                            </Link>
                            <Link to="/dashboard/charity/campaigns" className="btn btn-outline btn-lg">
                                <FaHeart className="mr-2" />
                                View My Campaigns
                            </Link>
                            <Link to="/dashboard/charity/profile" className="btn btn-outline btn-lg">
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
