import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { mockCampaigns } from '../../data/mockData';
import { FaHeart, FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaShare, FaFlag } from 'react-icons/fa';

const CampaignDetails = () => {
    const { id } = useParams();
    const campaign = mockCampaigns.find(c => c.id === parseInt(id));

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
                                    <img src={campaign.image} alt={campaign.title} className="w-full h-96 object-cover" />
                                </figure>
                            </div>

                            {/* Campaign Info */}
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="badge badge-primary">{campaign.category}</span>
                                        {campaign.urgency === 'high' && <span className="badge badge-error">Urgent</span>}
                                        {campaign.verified && <span className="badge badge-success">Verified</span>}
                                    </div>
                                    
                                    <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>
                                    <p className="text-lg text-gray-600 mb-6">{campaign.longDescription}</p>

                                    {/* Campaign Images */}
                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        {campaign.images.map((image, index) => (
                                            <img key={index} src={image} alt={`Campaign ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                                        ))}
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {campaign.tags.map((tag, index) => (
                                            <span key={index} className="badge badge-outline">#{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Donation Card */}
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title mb-4">Support This Campaign</h2>
                                    
                                    <div className="mb-6">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Raised: {campaign.raised.toLocaleString()} BDT</span>
                                            <span>Goal: {campaign.goal.toLocaleString()} BDT</span>
                                        </div>
                                        <progress 
                                            className="progress progress-primary w-full" 
                                            value={campaign.raised} 
                                            max={campaign.goal}
                                        ></progress>
                                        <div className="flex justify-between text-sm mt-2">
                                            <span className="font-semibold">
                                                {Math.round((campaign.raised / campaign.goal) * 100)}% funded
                                            </span>
                                            <span className="text-gray-500 flex items-center gap-1">
                                                <FaUsers className="text-xs" />
                                                {campaign.donors} donors
                                            </span>
                                        </div>
                                    </div>

                                    <Link to={`/campaigns/${campaign.id}/donate`} className="btn btn-primary w-full mb-4">
                                        <FaHeart className="mr-2" />
                                        Donate Now
                                    </Link>

                                    <div className="flex gap-2">
                                        <button className="btn btn-outline flex-1">
                                            <FaShare className="mr-2" />
                                            Share
                                        </button>
                                        <button className="btn btn-outline flex-1">
                                            <FaFlag className="mr-2" />
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Campaign Details */}
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h3 className="card-title mb-4">Campaign Details</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <FaCalendarAlt className="text-primary" />
                                            <div>
                                                <p className="font-semibold">Start Date</p>
                                                <p className="text-sm text-gray-600">{new Date(campaign.startDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaCalendarAlt className="text-primary" />
                                            <div>
                                                <p className="font-semibold">End Date</p>
                                                <p className="text-sm text-gray-600">{new Date(campaign.endDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaMapMarkerAlt className="text-primary" />
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
                                    <div className="flex items-center gap-3">
                                        <img src="/api/placeholder/60/60" alt="Charity" className="w-15 h-15 rounded-full" />
                                        <div>
                                            <p className="font-semibold">{campaign.charityName}</p>
                                            <p className="text-sm text-gray-600">Verified Charity</p>
                                        </div>
                                    </div>
                                    <Link to={`/charities/${campaign.charityId}`} className="btn btn-outline btn-sm w-full mt-4">
                                        View Charity Profile
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
