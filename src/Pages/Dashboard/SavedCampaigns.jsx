import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaHeart, FaDonate, FaUsers, FaCalendarAlt, FaEye, FaHandHoldingHeart, FaLock } from 'react-icons/fa';
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
            <div className="flex justify-center items-center min-h-screen bg-black">
                <span className="loading loading-spinner loading-lg text-purple-500"></span>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>All Campaigns - Donor Dashboard</title>
            </Helmet>

            <div className="space-y-6 bg-black min-h-screen p-4">
                {/* Header */}
                <div className="bg-black/70 backdrop-blur-md text-white rounded-lg p-6 shadow-xl border border-purple-500/30">
                    <h1 className="text-3xl font-bold mb-2">All Campaigns</h1>
                    <p className="text-gray-300">
                        Browse and support {campaigns.length} approved {campaigns.length === 1 ? 'campaign' : 'campaigns'}
                    </p>
                </div>

                {campaigns.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campaigns.map((campaign) => (
                            <div
                                key={campaign.id}
                                className="card bg-black/70 backdrop-blur-md text-white
                                           shadow-xl border border-purple-500/30
                                           hover:border-pink-500/60 hover:shadow-pink-500/20
                                           hover:scale-[1.02] transition-all duration-300"
                            >
                                <figure>
                                    <img
                                        src={campaign.image}
                                        alt={campaign.title}
                                        className="w-full h-48 object-cover opacity-90"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x300';
                                        }}
                                    />
                                </figure>

                                <div className="card-body">
                                    {/* Badges */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="badge bg-purple-600/20 text-purple-300 border border-purple-500/40 capitalize">
                                            {campaign.category}
                                        </span>
                                        <span className="badge bg-green-600/20 text-green-300 border border-green-500/40">
                                            Approved
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="card-title text-base font-bold text-white">
                                        {campaign.title}
                                    </h3>

                                    {/* Charity */}
                                    <div className="flex items-center gap-2 text-sm mb-1">
                                        <FaUsers className="text-pink-400" />
                                        <span className="text-pink-300 font-semibold">
                                            {campaign.charityName}
                                        </span>
                                    </div>

                                    {/* End Date */}
                                    <div className="flex items-center gap-2 text-sm mb-2">
                                        <FaCalendarAlt className="text-indigo-400" />
                                        <span className="text-indigo-300">
                                            Ends {new Date(campaign.endDate).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-gray-300 line-clamp-2">
                                        {campaign.description}
                                    </p>

                                    {/* Funding Box */}
                                    <div className="mt-4 p-3 bg-black/60 rounded-lg border border-purple-500/30">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-bold text-purple-300">
                                                {Math.round(((campaign.currentAmount || 0) / campaign.goalAmount) * 100)}% funded
                                            </span>
                                            <span className="font-bold text-pink-400">
                                                ৳{(campaign.currentAmount || 0).toLocaleString()}
                                            </span>
                                        </div>

                                        <progress
                                            className="progress progress-secondary w-full h-2"
                                            value={campaign.currentAmount || 0}
                                            max={campaign.goalAmount}
                                        ></progress>

                                        <div className="flex justify-between text-xs mt-2">
                                            <span className="text-gray-300">
                                                Goal: ৳{campaign.goalAmount.toLocaleString()}
                                            </span>
                                            <span className="text-indigo-300">
                                                {Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days left
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="card-actions justify-between items-center mt-4">
                                        <Link
                                            to={`/campaigns/${campaign.id}`}
                                            className="btn btn-outline btn-sm border-gray-500 text-gray-200 hover:bg-white/10"
                                        >
                                            <FaEye className="mr-1" /> Details
                                        </Link>

                                        {isCampaignActive(campaign) ? (
                                            <Link
                                                to={`/campaigns/${campaign.id}/donate`}
                                                className="btn btn-sm bg-gradient-to-r from-pink-600 to-purple-700
                                                           text-white border-0 hover:from-pink-700 hover:to-purple-800 shadow-lg"
                                            >
                                                <FaHeart className="mr-1" /> Donate
                                            </Link>
                                        ) : (
                                            <button className="btn btn-disabled btn-sm">
                                                <FaLock className="mr-1" /> Donate
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card bg-black/70 backdrop-blur-md shadow-xl border border-purple-500/30">
                        <div className="card-body text-center py-12 text-white">
                            <FaHandHoldingHeart className="text-6xl text-purple-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">No Campaigns Available</h3>
                            <p className="text-gray-300 mb-6">
                                There are no approved campaigns at the moment. Check back soon!
                            </p>
                            <Link
                                to="/campaigns"
                                className="btn bg-gradient-to-r from-pink-600 to-purple-700
                                           text-white border-0 hover:from-pink-700 hover:to-purple-800 shadow-lg"
                            >
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
