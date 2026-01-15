import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaHeart, FaRegHeart, FaDonate, FaUsers, FaCalendarAlt, FaEye, FaHandHoldingHeart, FaLock } from 'react-icons/fa';
import { getCampaignsByStatus, isCampaignActive } from '../../utils/campaignStorage';

export default function SavedCampaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const loadCampaigns = async () => {
            try {
                const approvedCampaigns = await getCampaignsByStatus('approved');
                setCampaigns(approvedCampaigns);
            } catch (error) {
                console.error('Error fetching campaigns:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCampaigns();
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
                <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white rounded-lg p-6 shadow-xl border-2 border-purple-400/30">
                    <h1 className="text-3xl font-bold mb-2">All Campaigns</h1>
                    <p className="text-lg opacity-95">
                        Browse and support {campaigns.length} approved {campaigns.length === 1 ? 'campaign' : 'campaigns'}
                    </p>
                </div>

                {campaigns.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campaigns.map((campaign) => (
                            <div key={campaign.id} className="card bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 shadow-lg border-2 border-purple-200 hover:shadow-xl hover:border-purple-400 hover:scale-[1.02] transition-all">
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
                                    
                                    <h3 className="card-title text-base text-purple-900 font-bold">{campaign.title}</h3>
                                    
                                    <div className="flex items-center gap-2 text-sm mb-1 font-medium">
                                        <FaUsers className="w-4 h-4 text-pink-600" />
                                        <span className="text-pink-700 font-bold">{campaign.charityName}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-sm mb-2 font-medium">
                                        <FaCalendarAlt className="w-4 h-4 text-indigo-600" />
                                        <span className="text-indigo-700">Ends {new Date(campaign.endDate).toLocaleDateString()}</span>
                                    </div>
                                    
                                    <p className="text-sm text-gray-700 line-clamp-2 font-medium">
                                        {campaign.description}
                                    </p>
                                    
                                    <div className="mt-4 p-3 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 rounded-lg border-2 border-purple-300 shadow-md">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-black text-purple-800">{Math.round(((campaign.currentAmount || 0) / campaign.goalAmount) * 100)}% funded</span>
                                            <span className="font-black text-pink-700 text-lg">৳{(campaign.currentAmount || 0).toLocaleString()}</span>
                                        </div>
                                        <progress 
                                            className="progress progress-secondary w-full h-3" 
                                            value={campaign.currentAmount || 0} 
                                            max={campaign.goalAmount}
                                        ></progress>
                                        <div className="flex justify-between text-xs mt-2 font-bold">
                                            <span className="text-purple-900">Goal: ৳{campaign.goalAmount.toLocaleString()}</span>
                                            <span className="text-indigo-700">{Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days left</span>
                                        </div>
                                    </div>
                                    
                                    <div className="card-actions justify-between items-center mt-4">
                                        <Link 
                                            to={`/campaigns/${campaign.id}`} 
                                            className="btn btn-outline btn-sm border-purple-400 text-purple-700 hover:bg-purple-100"
                                        >
                                            <FaEye className="mr-1" /> Details
                                        </Link>
                                        {isCampaignActive(campaign) ? (
                                            <Link 
                                                to={`/campaigns/${campaign.id}/donate`} 
                                                className="btn bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 btn-sm hover:from-pink-600 hover:to-purple-700 shadow-lg"
                                            >
                                                <FaHeart className="mr-1" /> Donate
                                            </Link>
                                        ) : (
                                            <button 
                                                className="btn btn-disabled btn-sm" 
                                                disabled
                                                title={
                                                    campaign.status !== 'approved' ? 'Campaign Pending Approval' :
                                                    (campaign.currentAmount || 0) >= campaign.goalAmount ? 'Campaign Goal Reached' :
                                                    'Campaign Ended'
                                                }
                                            >
                                                <FaLock className="mr-1" /> Donate
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100 shadow-lg border-2 border-purple-300">
                        <div className="card-body text-center py-12">
                            <div className="flex justify-center mb-4">
                                <FaHandHoldingHeart className="text-6xl text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-purple-900">No Campaigns Available</h3>
                            <p className="text-purple-700 mb-6 font-medium">
                                There are no approved campaigns at the moment. Check back soon!
                            </p>
                            <Link to="/campaigns" className="btn bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 hover:from-pink-600 hover:to-purple-700 shadow-lg">
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
