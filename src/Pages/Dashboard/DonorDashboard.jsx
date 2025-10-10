import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../provider/authProvider';
import { getCampaigns, getCampaignsByStatus } from '../../utils/campaignStorage';
import { getUserDonationStats, getDonationsByUser } from '../../utils/donationStorage';
import { 
  FaHeart, 
  FaDollarSign, 
  FaChartLine, 
  FaUsers, 
  FaCalendarAlt,
  FaArrowRight,
  FaEye,
  FaHandHoldingHeart
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

    useEffect(() => {
        const fetchData = () => {
            try {
                if (!currentUser) {
                    setLoading(false);
                    return;
                }
                
                // Get user-specific donation statistics
                const userStats = getUserDonationStats(currentUser.uid);
                
                setStats({
                    totalDonations: userStats.totalDonated,
                    campaignsSupported: userStats.campaignsSupported,
                    totalImpact: userStats.impact,
                    thisMonth: userStats.thisMonth
                });
                
                // Get active campaigns for display (approved and end date not passed)
                const approvedCampaigns = getCampaignsByStatus('approved');
                const now = new Date();
                now.setHours(0, 0, 0, 0); // Reset time to start of day
                const active = approvedCampaigns.filter(campaign => {
                    const endDate = new Date(campaign.endDate);
                    endDate.setHours(23, 59, 59, 999); // Set to end of day
                    return endDate >= now;
                }).slice(0, 6); // Top 6 active campaigns
                
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

                {/* Active Campaigns */}
                <div className="card bg-base-100 shadow-xl">
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
                                    <div key={campaign.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
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
                                            <h3 className="card-title text-base">{campaign.title}</h3>
                                            <p className="text-xs text-gray-600 mb-1">By: {campaign.charityName}</p>
                                            <p className="text-sm text-gray-600 line-clamp-2">{campaign.description}</p>
                                            <div className="mt-4">
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="font-semibold">{Math.round(((campaign.currentAmount || 0) / campaign.goalAmount) * 100)}% funded</span>
                                                    <span className="text-gray-600">৳{(campaign.currentAmount || 0).toLocaleString()}</span>
                                                </div>
                                                <progress 
                                                    className="progress progress-primary w-full" 
                                                    value={campaign.currentAmount || 0} 
                                                    max={campaign.goalAmount}
                                                ></progress>
                                                <div className="flex justify-between text-xs text-gray-500 mt-1">
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

                {/* Quick Actions */}
                <div className="card bg-base-100 shadow-lg">
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
