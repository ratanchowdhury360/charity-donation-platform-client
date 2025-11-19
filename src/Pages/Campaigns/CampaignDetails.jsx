import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getCampaigns } from '../../utils/campaignStorage';
import { getUniqueDonorCount } from '../../utils/donationStorage';
import { FaHeart, FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaShare, FaFlag, FaCheckCircle, FaBuilding } from 'react-icons/fa';

const CampaignDetails = () => {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [donorCount, setDonorCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCampaign = async () => {
            try {
                const allCampaigns = await getCampaigns();
                const foundCampaign = allCampaigns.find(c => c.id === id);
                setCampaign(foundCampaign);

                if (foundCampaign) {
                    const count = await getUniqueDonorCount(id);
                    setDonorCount(count);
                }
            } catch (error) {
                console.error('Failed to load campaign details', error);
            } finally {
                setLoading(false);
            }
        };

        loadCampaign();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200 pt-20">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200 pt-20">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Campaign Not Found</h1>
                    <p className="text-xl text-gray-600 mb-8">The campaign you're looking for doesn't exist.</p>
                    <Link to="/campaigns" className="btn btn-primary">Back to Campaigns</Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{campaign.title} - Charity Campaign</title>
                <meta name="description" content={campaign.description} />
            </Helmet>

            <div className="min-h-screen bg-base-200 pt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Campaign Image */}
                            <div className="card bg-base-100 shadow-xl">
                                <figure>
                                    <img 
                                        src={campaign.image} 
                                        alt={campaign.title} 
                                        className="w-full h-96 object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/800x400';
                                        }}
                                    />
                                </figure>
                            </div>

                            {/* Campaign Info */}
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="badge badge-primary capitalize">{campaign.category}</span>
                                        {campaign.status === 'approved' && <span className="badge badge-success"><FaCheckCircle className="mr-1" /> Approved</span>}
                                        {campaign.status === 'pending' && <span className="badge badge-warning">Pending Review</span>}
                                    </div>
                                    
                                    <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>
                                    
                                    {/* Charity Info */}
                                    <div className="flex items-center gap-3 mb-6 p-4 bg-base-200 rounded-lg">
                                        <FaBuilding className="text-2xl text-primary" />
                                        <div>
                                            <p className="text-sm text-gray-600">Organized by</p>
                                            <p className="font-bold text-lg">{campaign.charityName}</p>
                                            <p className="text-xs text-gray-500">Charity ID: {campaign.charityId}</p>
                                        </div>
                                    </div>

                                    <div className="divider">Campaign Description</div>
                                    <p className="text-lg text-gray-700 whitespace-pre-line leading-relaxed mb-6">{campaign.description}</p>

                                    {/* Campaign Details Grid */}
                                    <div className="divider">Additional Information</div>
                                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                                        <div className="p-4 bg-base-200 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Goal Amount</p>
                                            <p className="text-2xl font-bold text-primary">৳{campaign.goalAmount.toLocaleString()}</p>
                                        </div>
                                        <div className="p-4 bg-base-200 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Amount Raised</p>
                                            <p className="text-2xl font-bold text-success">৳{(campaign.currentAmount || 0).toLocaleString()}</p>
                                        </div>
                                        <div className="p-4 bg-base-200 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Start Date</p>
                                            <p className="font-semibold">{new Date(campaign.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                        <div className="p-4 bg-base-200 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">End Date</p>
                                            <p className="font-semibold">{new Date(campaign.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Donation Card */}
                            <div className="card bg-base-100 shadow-xl sticky top-24">
                                <div className="card-body">
                                    <h2 className="card-title mb-4">Support This Campaign</h2>
                                    
                                    <div className="mb-6">
                                        <div className="text-center mb-4 p-4 bg-primary/10 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Total Raised</p>
                                            <p className="text-3xl font-bold text-primary">৳{(campaign.currentAmount || 0).toLocaleString()}</p>
                                            <p className="text-sm text-gray-600 mt-1">of ৳{campaign.goalAmount.toLocaleString()} goal</p>
                                        </div>
                                        
                                        <progress 
                                            className="progress progress-primary w-full h-3" 
                                            value={campaign.currentAmount || 0} 
                                            max={campaign.goalAmount}
                                        ></progress>
                                        
                                        <div className="flex justify-between text-sm mt-3">
                                            <span className="font-semibold text-primary">
                                                {Math.round(((campaign.currentAmount || 0) / campaign.goalAmount) * 100)}% funded
                                            </span>
                                            <span className="text-gray-600">
                                                ৳{(campaign.goalAmount - (campaign.currentAmount || 0)).toLocaleString()} to go
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center justify-center gap-2 mt-3 p-2 bg-base-200 rounded-lg">
                                            <FaUsers className="text-primary" />
                                            <span className="font-semibold">{donorCount}</span>
                                            <span className="text-sm text-gray-600">{donorCount === 1 ? 'donor' : 'donors'}</span>
                                        </div>
                                    </div>

                                    {campaign.status === 'approved' ? (
                                        <Link to={`/campaigns/${campaign.id}/donate`} className="btn btn-primary w-full mb-4">
                                            <FaHeart className="mr-2" />
                                            Donate Now
                                        </Link>
                                    ) : (
                                        <button className="btn btn-disabled w-full mb-4" disabled>
                                            Campaign Pending Approval
                                        </button>
                                    )}

                                    <div className="flex gap-2">
                                        <button className="btn btn-outline btn-sm flex-1">
                                            <FaShare className="mr-1" />
                                            Share
                                        </button>
                                        <button className="btn btn-outline btn-sm flex-1">
                                            <FaFlag className="mr-1" />
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Campaign Timeline */}
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h3 className="card-title mb-4">Campaign Timeline</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <FaCalendarAlt className="text-primary mt-1" />
                                            <div>
                                                <p className="font-semibold">Created</p>
                                                <p className="text-sm text-gray-600">{new Date(campaign.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FaCalendarAlt className="text-success mt-1" />
                                            <div>
                                                <p className="font-semibold">End Date</p>
                                                <p className="text-sm text-gray-600">{new Date(campaign.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(campaign.endDate) > new Date() 
                                                        ? `${Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days remaining`
                                                        : 'Campaign ended'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FaMapMarkerAlt className="text-info mt-1" />
                                            <div>
                                                <p className="font-semibold">Location</p>
                                                <p className="text-sm text-gray-600">Bangladesh</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Charity Info */}
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h3 className="card-title mb-4">Organized by</h3>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="avatar placeholder">
                                            <div className="bg-primary text-primary-content rounded-full w-16">
                                                <span className="text-2xl">{campaign.charityName.charAt(0).toUpperCase()}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">{campaign.charityName}</p>
                                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                                <FaCheckCircle className="text-success" />
                                                Registered Charity
                                            </p>
                                        </div>
                                    </div>
                                    <Link to={`/campaigns?charity=${campaign.charityId}`} className="btn btn-outline btn-sm w-full">
                                        View All Campaigns
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CampaignDetails;
