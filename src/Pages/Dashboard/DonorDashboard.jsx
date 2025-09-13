import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../provider/authProvider';
import { mockDonations, mockCampaigns } from '../../data/mockData';
import { 
  FaHeart, 
  FaDollarSign, 
  FaChartLine, 
  FaUsers, 
  FaCalendarAlt,
  FaArrowRight,
  FaEye
} from 'react-icons/fa';

const DonorDashboard = () => {
    const { currentUser } = useAuth();
    
    // Mock data for donor stats
    const donorStats = {
        totalDonations: 15000,
        campaignsSupported: 8,
        totalImpact: 45,
        thisMonth: 5000
    };

    const recentDonations = mockDonations.slice(0, 5);
    const savedCampaigns = mockCampaigns.filter(campaign => campaign.featured).slice(0, 3);

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
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Donated</p>
                                    <p className="text-2xl font-bold text-primary">
                                        {donorStats.totalDonations.toLocaleString()} BDT
                                    </p>
                                </div>
                                <FaDollarSign className="text-3xl text-primary opacity-60" />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Campaigns Supported</p>
                                    <p className="text-2xl font-bold text-secondary">
                                        {donorStats.campaignsSupported}
                                    </p>
                                </div>
                                <FaHeart className="text-3xl text-secondary opacity-60" />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Lives Impacted</p>
                                    <p className="text-2xl font-bold text-accent">
                                        {donorStats.totalImpact}+
                                    </p>
                                </div>
                                <FaUsers className="text-3xl text-accent opacity-60" />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">This Month</p>
                                    <p className="text-2xl font-bold text-info">
                                        {donorStats.thisMonth.toLocaleString()} BDT
                                    </p>
                                </div>
                                <FaChartLine className="text-3xl text-info opacity-60" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Recent Donations */}
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="card-title">Recent Donations</h2>
                                <Link to="/dashboard/donations" className="btn btn-sm btn-outline">
                                    View All
                                    <FaArrowRight className="ml-1" />
                                </Link>
                            </div>
                            
                            <div className="space-y-4">
                                {recentDonations.map((donation) => {
                                    const campaign = mockCampaigns.find(c => c.id === donation.campaignId);
                                    return (
                                        <div key={donation.id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                                            <div className="flex-1">
                                                <h4 className="font-semibold">{campaign?.title || 'Campaign'}</h4>
                                                <p className="text-sm text-gray-600">
                                                    {donation.amount.toLocaleString()} BDT • {donation.date}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`badge ${
                                                    donation.status === 'completed' ? 'badge-success' : 'badge-warning'
                                                }`}>
                                                    {donation.status}
                                                </span>
                                                <Link to={`/campaigns/${donation.campaignId}`} className="btn btn-xs btn-ghost">
                                                    <FaEye />
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Saved Campaigns */}
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="card-title">Saved Campaigns</h2>
                                <Link to="/dashboard/saved" className="btn btn-sm btn-outline">
                                    View All
                                    <FaArrowRight className="ml-1" />
                                </Link>
                            </div>
                            
                            <div className="space-y-4">
                                {savedCampaigns.map((campaign) => (
                                    <div key={campaign.id} className="flex items-center gap-4 p-3 bg-base-200 rounded-lg">
                                        <img 
                                            src={campaign.image} 
                                            alt={campaign.title}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-semibold line-clamp-1">{campaign.title}</h4>
                                            <p className="text-sm text-gray-600">
                                                {Math.round((campaign.raised / campaign.goal) * 100)}% funded
                                            </p>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                <div 
                                                    className="bg-primary h-2 rounded-full" 
                                                    style={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <Link to={`/campaigns/${campaign.id}`} className="btn btn-sm btn-primary">
                                            View
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
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
