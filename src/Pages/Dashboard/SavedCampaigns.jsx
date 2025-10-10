import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaHeart, FaRegHeart, FaDonate, FaUsers, FaCalendarAlt, FaEye, FaHandHoldingHeart } from 'react-icons/fa';
import { useAuth } from '../../provider/authProvider';
import { getCampaignsByStatus } from '../../utils/campaignStorage';

export default function SavedCampaigns() {
    const { currentUser } = useAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        try {
            // Get all approved campaigns
            const approvedCampaigns = getCampaignsByStatus('approved');
            setCampaigns(approvedCampaigns);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            setLoading(false);
        }
    }, []);

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
                <title>All Campaigns - Donor Dashboard</title>
            </Helmet>
            
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-6 shadow-xl">
                    <h1 className="text-3xl font-bold mb-2">All Campaigns</h1>
                    <p className="text-lg opacity-90">
                        Browse and support {campaigns.length} approved {campaigns.length === 1 ? 'campaign' : 'campaigns'}
                    </p>
                </div>

                {campaigns.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campaigns.map((campaign) => (
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
                                        <span className="badge badge-success">Approved</span>
                                    </div>
                                    
                                    <h3 className="card-title text-base">{campaign.title}</h3>
                                    
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                        <FaUsers className="w-4 h-4" />
                                        <span>{campaign.charityName}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                        <FaCalendarAlt className="w-4 h-4" />
                                        <span>Ends {new Date(campaign.endDate).toLocaleDateString()}</span>
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {campaign.description}
                                    </p>
                                    
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
                                            <span>{Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days left</span>
                                        </div>
                                    </div>
                                    
                                    <div className="card-actions justify-between items-center mt-4">
                                        <Link 
                                            to={`/campaigns/${campaign.id}`} 
                                            className="btn btn-ghost btn-sm"
                                        >
                                            <FaEye className="mr-1" /> Details
                                        </Link>
                                        <Link 
                                            to={`/campaigns/${campaign.id}/donate`} 
                                            className="btn btn-primary btn-sm"
                                        >
                                            <FaHeart className="mr-1" /> Donate
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body text-center py-12">
                            <div className="flex justify-center mb-4">
                                <FaHandHoldingHeart className="text-6xl text-gray-300" />
                            </div>
                            <h3 className="text-xl font-medium mb-2">No Campaigns Available</h3>
                            <p className="text-gray-500 mb-6">
                                There are no approved campaigns at the moment. Check back soon!
                            </p>
                            <Link to="/campaigns" className="btn btn-primary">
                                <FaHeart className="mr-2" />
                                View All Campaigns
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
