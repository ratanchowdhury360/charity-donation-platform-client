import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getCampaigns } from '../../utils/campaignStorage';
import { FaStar, FaUsers, FaHeart, FaBuilding, FaCheckCircle } from 'react-icons/fa';

const Charities = () => {
    const [charities, setCharities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get all campaigns and group by charity
        const allCampaigns = getCampaigns();
        
        // Group campaigns by charityId
        const charityMap = {};
        
        allCampaigns.forEach(campaign => {
            if (!charityMap[campaign.charityId]) {
                charityMap[campaign.charityId] = {
                    id: campaign.charityId,
                    name: campaign.charityName,
                    campaigns: [],
                    totalRaised: 0,
                    totalCampaigns: 0,
                    approvedCampaigns: 0
                };
            }
            
            charityMap[campaign.charityId].campaigns.push(campaign);
            charityMap[campaign.charityId].totalCampaigns++;
            charityMap[campaign.charityId].totalRaised += campaign.currentAmount;
            
            if (campaign.status === 'approved') {
                charityMap[campaign.charityId].approvedCampaigns++;
            }
        });
        
        // Convert to array
        const charitiesArray = Object.values(charityMap);
        setCharities(charitiesArray);
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 pt-20 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Verified Charities - Charity Platform</title>
                <meta name="description" content="Browse verified charity organizations making a positive impact in Bangladesh. Support trusted causes." />
            </Helmet>

            <div className="min-h-screen bg-base-200 pt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">Verified Charities</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Discover trusted charity organizations making a real difference in communities across Bangladesh
                        </p>
                    </div>

                    {charities.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🏢</div>
                            <h3 className="text-2xl font-bold mb-2">No Charities Yet</h3>
                            <p className="text-gray-600 mb-6">
                                Be the first charity to register and start making a difference!
                            </p>
                            <Link to="/charities/register" className="btn btn-primary">
                                <FaBuilding className="mr-2" />
                                Register Your Charity
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {charities.map((charity) => (
                                <div key={charity.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                                    <div className="card-body">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="avatar placeholder">
                                                <div className="bg-primary text-primary-content rounded-full w-16">
                                                    <span className="text-2xl">{charity.name.charAt(0).toUpperCase()}</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="card-title text-lg">{charity.name}</h3>
                                                <div className="flex items-center gap-1">
                                                    <FaCheckCircle className="text-success text-sm" />
                                                    <span className="text-xs text-gray-600">Registered Charity</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="divider my-2"></div>
                                        
                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-primary">{charity.totalCampaigns}</div>
                                                <div className="text-xs text-gray-600">Total Campaigns</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-success">{charity.approvedCampaigns}</div>
                                                <div className="text-xs text-gray-600">Approved</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-warning">{charity.totalCampaigns - charity.approvedCampaigns}</div>
                                                <div className="text-xs text-gray-600">Pending</div>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-secondary/20 to-accent/20 p-4 rounded-lg">
                                            <div className="text-center">
                                                <div className="text-sm text-gray-600 mb-1">Total Amount Raised</div>
                                                <div className="text-3xl font-bold text-secondary">৳{charity.totalRaised.toLocaleString()}</div>
                                            </div>
                                        </div>

                                        <div className="card-actions justify-center mt-4">
                                            <Link 
                                                to={`/campaigns?charity=${charity.id}`} 
                                                className="btn btn-primary btn-block"
                                            >
                                                <FaHeart className="mr-2" />
                                                View Campaigns
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {charities.length > 0 && (
                        <div className="text-center mt-12">
                            <div className="stats shadow mb-6">
                                <div className="stat">
                                    <div className="stat-title">Total Charities</div>
                                    <div className="stat-value text-primary">{charities.length}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Total Campaigns</div>
                                    <div className="stat-value text-secondary">{charities.reduce((sum, c) => sum + c.totalCampaigns, 0)}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Total Raised</div>
                                    <div className="stat-value text-accent">৳{charities.reduce((sum, c) => sum + c.totalRaised, 0).toLocaleString()}</div>
                                </div>
                            </div>
                            {/* <Link to="/charities/register" className="btn btn-primary btn-lg">
                                <FaBuilding className="mr-2" />
                                Register Your Charity
                            </Link> */}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Charities;
