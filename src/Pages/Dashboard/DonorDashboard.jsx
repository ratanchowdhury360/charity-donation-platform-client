import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../provider/authProvider';
import { getCampaignsByStatus } from '../../utils/campaignStorage';
import { getUserDonationStats } from '../../utils/donationStorage';
import { getUserMessages } from '../../utils/messageStorage';
import {
  FaHeart,
  FaDollarSign,
  FaChartLine,
  FaUsers,
  FaCalendarAlt,
  FaArrowRight,
  FaEye,
  FaHandHoldingHeart,
  FaCheckCircle,
  FaHourglassEnd,
  FaInbox
} from 'react-icons/fa';

const DonorDashboard = () => {
    const { currentUser } = useAuth();
    const [stats, setStats] = useState({
        totalDonations: 0,
        campaignsSupported: 0,
        totalImpact: 0,
        thisMonth: 0
    });
    const [activeCampaigns, setActiveCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [campaignPulse, setCampaignPulse] = useState({ completed: 0, archived: 0 });
    const [messageThreads, setMessageThreads] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!currentUser) {
                    setLoading(false);
                    return;
                }
                
                // Get user-specific donation statistics
                const userStats = await getUserDonationStats(currentUser.uid);
                
                setStats({
                    totalDonations: userStats.totalDonated || 0,
                    campaignsSupported: userStats.campaignsSupported || 0,
                    totalImpact: userStats.impact || 0,
                    thisMonth: userStats.thisMonth || 0
                });
                
                // Get active campaigns for display (approved and end date not passed)
                const approvedCampaigns = await getCampaignsByStatus('approved');
                const now = new Date();
                now.setHours(0, 0, 0, 0); // Reset time to start of day
                const active = approvedCampaigns.filter(campaign => {
                    const endDate = new Date(campaign.endDate);
                    endDate.setHours(23, 59, 59, 999); // Set to end of day
                    return endDate >= now;
                }).slice(0, 6); // Top 6 active campaigns

                const completedCount = approvedCampaigns.filter(c => (c.currentAmount || 0) >= c.goalAmount).length;
                const archivedCount = approvedCampaigns.filter(c => new Date(c.endDate) < now).length;
                setCampaignPulse({ completed: completedCount, archived: archivedCount });

                if (currentUser?.uid) {
                    const inbox = await getUserMessages(currentUser.uid);
                    setMessageThreads(inbox);
                }
                
                setActiveCampaigns(active);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching donor dashboard data:', error);
                setLoading(false);
            }
        };
        
        fetchData();
    }, [currentUser]);

    return (
        <>
            <Helmet>
                <title>Donor Dashboard - Charity Platform</title>
            </Helmet>

            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-6">
                    <h1 className="text-3xl font-bold mb-2">
                        Welcome back, {currentUser?.displayName || 'Donor'}!
                    </h1>
                    <p className="text-lg opacity-90">
                        Thank you for making a difference in your community
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card bg-gradient-to-br from-primary to-primary/80 text-white shadow-xl hover:shadow-2xl transition-shadow">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Total Donated</p>
                                    <p className="text-3xl font-bold">
                                        ৳{stats.totalDonations.toLocaleString()}
                                    </p>
                                    <p className="text-xs opacity-75 mt-1">All time contributions</p>
                                </div>
                                <FaDollarSign className="text-5xl opacity-30" />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-secondary to-secondary/80 text-white shadow-xl hover:shadow-2xl transition-shadow">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Campaigns Supported</p>
                                    <p className="text-3xl font-bold">
                                        {stats.campaignsSupported}
                                    </p>
                                    <p className="text-xs opacity-75 mt-1">Active campaigns</p>
                                </div>
                                <FaHeart className="text-5xl opacity-30" />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-accent to-accent/80 text-white shadow-xl hover:shadow-2xl transition-shadow">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Lives Impacted</p>
                                    <p className="text-3xl font-bold">
                                        {stats.totalImpact}+
                                    </p>
                                    <p className="text-xs opacity-75 mt-1">People helped</p>
                                </div>
                                <FaUsers className="text-5xl opacity-30" />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-info to-info/80 text-white shadow-xl hover:shadow-2xl transition-shadow">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">This Month</p>
                                    <p className="text-3xl font-bold">
                                        ৳{stats.thisMonth.toLocaleString()}
                                    </p>
                                    <p className="text-xs opacity-75 mt-1">{new Date().toLocaleString('default', { month: 'long' })}</p>
                                </div>
                                <FaChartLine className="text-5xl opacity-30" />
                            </div>
                        </div>
                    </div>
                </div>

                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link
                            to="/campaigns?view=completed"
                            className="card bg-gradient-to-br from-success/20 via-success/10 to-success/5 shadow-lg border border-success/30 hover:shadow-2xl transition-all hover:scale-105"
                        >
                            <div className="card-body flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-base-content/70 font-medium">Completed campaigns</p>
                                    <p className="text-3xl font-bold text-success">{campaignPulse.completed}</p>
                                    <p className="text-xs text-base-content/60 mt-1">Targets reached across the platform</p>
                                </div>
                                <FaCheckCircle className="text-4xl text-success/70" />
                            </div>
                        </Link>
                        <Link
                            to="/campaigns?view=archived"
                            className="card bg-gradient-to-br from-warning/20 via-warning/10 to-warning/5 shadow-lg border border-warning/30 hover:shadow-2xl transition-all hover:scale-105"
                        >
                            <div className="card-body flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-base-content/70 font-medium">Ended timelines</p>
                                    <p className="text-3xl font-bold text-warning">{campaignPulse.archived}</p>
                                    <p className="text-xs text-base-content/60 mt-1">Campaigns waiting for admin extension</p>
                                </div>
                                <FaHourglassEnd className="text-4xl text-warning/70" />
                            </div>
                        </Link>
                    </div>
                )}

                {/* Active Campaigns */}
                <div className="card bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5 shadow-xl border border-primary/20">
                    <div className="card-body">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">Active Campaigns</h2>
                                <p className="text-sm text-gray-600">Support these ongoing campaigns</p>
                            </div>
                            <Link to="/campaigns" className="btn btn-primary btn-sm">
                                View All <FaArrowRight className="ml-2" />
                            </Link>
                        </div>
                        
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                            </div>
                        ) : activeCampaigns.length === 0 ? (
                            <div className="text-center py-12">
                                <FaHandHoldingHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">No Active Campaigns</h3>
                                <p className="text-gray-600 mb-4">Check back soon for new campaigns to support!</p>
                                <Link to="/campaigns" className="btn btn-primary">
                                    Browse All Campaigns
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activeCampaigns.map(campaign => (
                                    <div key={campaign.id} className="card bg-gradient-to-br from-white via-primary/10 to-secondary/10 shadow-lg border-2 border-primary/20 hover:shadow-xl hover:border-primary/40 hover:scale-[1.02] transition-all">
                                        <figure>
                                            <img 
                                                src={campaign.image} 
                                                alt={campaign.title} 
                                                className="w-full h-48 object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/400x300';
                                                }}
                                            />
                                        </figure>
                                        <div className="card-body">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="badge badge-primary capitalize">{campaign.category}</span>
                                                <span className="badge badge-success">Active</span>
                                            </div>
                                            <h3 className="card-title text-base text-base-content">{campaign.title}</h3>
                                            <p className="text-xs text-base-content/70 mb-1 font-medium">By: <span className="text-primary font-semibold">{campaign.charityName}</span></p>
                                            <p className="text-sm text-base-content/70 line-clamp-2">{campaign.description}</p>
                                            <div className="mt-4 p-3 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 rounded-lg border border-primary/20">
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="font-bold text-primary">{Math.round(((campaign.currentAmount || 0) / campaign.goalAmount) * 100)}% funded</span>
                                                    <span className="font-bold text-success text-lg">৳{(campaign.currentAmount || 0).toLocaleString()}</span>
                                                </div>
                                                <progress 
                                                    className="progress progress-success w-full h-2" 
                                                    value={campaign.currentAmount || 0} 
                                                    max={campaign.goalAmount}
                                                ></progress>
                                                <div className="flex justify-between text-xs text-base-content/70 mt-2 font-medium">
                                                    <span>Goal: ৳{campaign.goalAmount.toLocaleString()}</span>
                                                    <span>Ends: {new Date(campaign.endDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="card-actions justify-between items-center mt-4">
                                                <Link 
                                                    to={`/campaigns/${campaign.id}`} 
                                                    className="btn btn-ghost btn-sm"
                                                >
                                                    <FaEye className="mr-1" /> Details
                                                </Link>
                                                <Link to={`/campaigns/${campaign.id}/donate`} className="btn btn-primary btn-sm">
                                                    <FaHeart className="mr-1" /> Donate
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {currentUser && (
                    <div className="card bg-gradient-to-br from-info/10 via-primary/5 to-secondary/5 shadow-lg border border-info/20">
                        <div className="card-body">
                            <div className="flex items-center gap-3 mb-4">
                                <FaInbox className="text-primary text-2xl" />
                                <div>
                                    <h2 className="card-title mb-0">Messages from Admin</h2>
                                    <p className="text-sm text-gray-500">Replies land here after you use the contact form</p>
                                </div>
                            </div>
                            {messageThreads.length === 0 ? (
                                <div className="text-center py-6 text-gray-500">
                                    No replies yet. <Link to="/contact" className="link link-primary">Send us a message</Link> to get help.
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
                                            Continue conversation
                                        </Link>
                                    </div>
                                )}
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="card bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5 shadow-lg border border-primary/20">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link to="/campaigns" className="btn btn-primary btn-lg">
                                <FaHeart className="mr-2" />
                                Browse Campaigns
                            </Link>
                            <Link to="/dashboard/donations" className="btn btn-outline btn-lg">
                                <FaCalendarAlt className="mr-2" />
                                View Donation History
                            </Link>
                            <Link to="/profile" className="btn btn-outline btn-lg">
                                <FaUsers className="mr-2" />
                                Update Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DonorDashboard;
