import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../provider/authProvider';
import { getDonationsByUser } from '../../utils/donationStorage';
import { getCampaigns } from '../../utils/campaignStorage';
import { 
    FaHeart, 
    FaCalendarAlt, 
    FaMoneyBillWave, 
    FaEye,
    FaChartLine,
    FaHandHoldingHeart,
    FaCreditCard
} from 'react-icons/fa';

const MyDonations = () => {
    const { currentUser } = useAuth();
    const [donations, setDonations] = useState([]);
    const [campaigns, setCampaigns] = useState({});
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalDonated: 0,
        totalDonations: 0,
        campaignsSupported: 0
    });

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        try {
            // Get user's donations
            const userDonations = getDonationsByUser(currentUser.uid);
            
            // Sort by date (newest first)
            const sortedDonations = userDonations.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            
            // Get all campaigns
            const allCampaigns = getCampaigns();
            const campaignsMap = {};
            allCampaigns.forEach(campaign => {
                campaignsMap[campaign.id] = campaign;
            });
            
            // Calculate stats
            const totalDonated = userDonations.reduce((sum, d) => sum + d.amount, 0);
            const uniqueCampaigns = new Set(userDonations.map(d => d.campaignId));
            
            setDonations(sortedDonations);
            setCampaigns(campaignsMap);
            setStats({
                totalDonated,
                totalDonations: userDonations.length,
                campaignsSupported: uniqueCampaigns.size
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching donations:', error);
            setLoading(false);
        }
    }, [currentUser]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>My Donations - Donor Dashboard</title>
            </Helmet>

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-6 shadow-xl">
                    <h1 className="text-3xl font-bold mb-2">My Donations</h1>
                    <p className="text-lg opacity-90">Track your contributions and impact</p>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card bg-gradient-to-br from-primary to-primary/80 text-white shadow-xl">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Total Donated</p>
                                    <p className="text-3xl font-bold">৳{stats.totalDonated.toLocaleString()}</p>
                                </div>
                                <FaMoneyBillWave className="text-5xl opacity-30" />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-secondary to-secondary/80 text-white shadow-xl">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Total Donations</p>
                                    <p className="text-3xl font-bold">{stats.totalDonations}</p>
                                </div>
                                <FaHeart className="text-5xl opacity-30" />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-accent to-accent/80 text-white shadow-xl">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Campaigns Supported</p>
                                    <p className="text-3xl font-bold">{stats.campaignsSupported}</p>
                                </div>
                                <FaChartLine className="text-5xl opacity-30" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Donations List */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-4">Donation History</h2>
                        
                        {donations.length === 0 ? (
                            <div className="text-center py-12">
                                <FaHandHoldingHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">No Donations Yet</h3>
                                <p className="text-gray-600 mb-6">Start making a difference by supporting a campaign!</p>
                                <Link to="/campaigns" className="btn btn-primary">
                                    <FaHeart className="mr-2" />
                                    Browse Campaigns
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {donations.map((donation) => {
                                    const campaign = campaigns[donation.campaignId];
                                    return (
                                        <div key={donation.id} className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow">
                                            <div className="card-body">
                                                <div className="flex flex-col lg:flex-row gap-4">
                                                    {/* Campaign Image */}
                                                    {campaign && (
                                                        <figure className="lg:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                                            <img 
                                                                src={campaign.image} 
                                                                alt={campaign.title}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.src = 'https://via.placeholder.com/300x200';
                                                                }}
                                                            />
                                                        </figure>
                                                    )}
                                                    
                                                    {/* Donation Details */}
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <h3 className="text-xl font-bold">{donation.campaignTitle}</h3>
                                                                <p className="text-sm text-gray-600">By: {donation.charityName}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-2xl font-bold text-primary">৳{donation.amount.toLocaleString()}</p>
                                                                <span className="badge badge-success badge-sm">Completed</span>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                                                            <div className="flex items-center gap-2">
                                                                <FaCalendarAlt className="text-primary" />
                                                                <div>
                                                                    <p className="text-xs text-gray-600">Date</p>
                                                                    <p className="text-sm font-semibold">
                                                                        {new Date(donation.createdAt).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-2">
                                                                <FaCreditCard className="text-secondary" />
                                                                <div>
                                                                    <p className="text-xs text-gray-600">Payment</p>
                                                                    <p className="text-sm font-semibold capitalize">{donation.paymentMethod}</p>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-2">
                                                                <FaHeart className="text-accent" />
                                                                <div>
                                                                    <p className="text-xs text-gray-600">Visibility</p>
                                                                    <p className="text-sm font-semibold">
                                                                        {donation.anonymous ? 'Anonymous' : 'Public'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            
                                                            {campaign && (
                                                                <div className="flex items-center gap-2">
                                                                    <FaChartLine className="text-info" />
                                                                    <div>
                                                                        <p className="text-xs text-gray-600">Campaign Status</p>
                                                                        <p className="text-sm font-semibold capitalize">{campaign.status}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        {/* Campaign Progress */}
                                                        {campaign && (
                                                            <div className="mt-4">
                                                                <div className="flex justify-between text-sm mb-1">
                                                                    <span className="text-gray-600">Campaign Progress</span>
                                                                    <span className="font-semibold">
                                                                        {Math.round(((campaign.currentAmount || 0) / campaign.goalAmount) * 100)}% funded
                                                                    </span>
                                                                </div>
                                                                <progress 
                                                                    className="progress progress-primary w-full" 
                                                                    value={campaign.currentAmount || 0} 
                                                                    max={campaign.goalAmount}
                                                                ></progress>
                                                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                                    <span>Raised: ৳{(campaign.currentAmount || 0).toLocaleString()}</span>
                                                                    <span>Goal: ৳{campaign.goalAmount.toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Action Button */}
                                                        <div className="card-actions justify-end mt-4">
                                                            {campaign ? (
                                                                <Link 
                                                                    to={`/campaigns/${campaign.id}`} 
                                                                    className="btn btn-primary btn-sm"
                                                                >
                                                                    <FaEye className="mr-2" />
                                                                    View Campaign
                                                                </Link>
                                                            ) : (
                                                                <span className="text-sm text-gray-500 italic">Campaign no longer available</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyDonations;
