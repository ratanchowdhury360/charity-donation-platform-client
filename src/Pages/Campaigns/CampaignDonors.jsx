import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getCampaigns } from '../../utils/campaignStorage';
import { getDonationsByCampaign } from '../../utils/donationStorage';
import { FaUsers, FaHeart, FaArrowLeft, FaUser, FaEnvelope, FaDollarSign, FaCalendarAlt, FaReceipt, FaUserSecret } from 'react-icons/fa';

const CampaignDonors = () => {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [donations, setDonations] = useState([]);
    const [donorSummary, setDonorSummary] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Load campaign details
                const allCampaigns = await getCampaigns();
                const foundCampaign = allCampaigns.find(c => c.id === id);
                setCampaign(foundCampaign);

                // Load donations for this campaign
                const campaignDonations = await getDonationsByCampaign(id);
                setDonations(campaignDonations);

                // Group donations by donor
                const donorMap = {};
                campaignDonations.forEach(donation => {
                    const donorId = donation.donorId;
                    if (!donorMap[donorId]) {
                        donorMap[donorId] = {
                            donorId: donorId,
                            donorName: donation.donorName || 'Anonymous',
                            donorEmail: donation.donorEmail || '',
                            anonymous: donation.anonymous || false,
                            totalAmount: 0,
                            donationCount: 0,
                            donations: [],
                            firstDonation: donation.createdAt || donation.date
                        };
                    }
                    donorMap[donorId].totalAmount += donation.amount || 0;
                    donorMap[donorId].donationCount++;
                    donorMap[donorId].donations.push(donation);
                });

                // Convert to array and sort by total amount (descending)
                const summary = Object.values(donorMap).sort((a, b) => b.totalAmount - a.totalAmount);
                setDonorSummary(summary);
            } catch (error) {
                console.error('Failed to load donor details', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 pt-20 flex items-center justify-center">
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
                <title>Donors - {campaign.title} | Charity Platform</title>
                <meta name="description" content={`View all donors who contributed to ${campaign.title}`} />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5 pt-20">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link 
                            to={`/campaigns/${campaign.id}`} 
                            className="btn btn-ghost btn-sm mb-4 text-white hover:text-primary"
                        >
                            <FaArrowLeft className="mr-2" />
                            Back to Campaign
                        </Link>
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                            Campaign Donors
                        </h1>
                        <p className="text-xl text-white font-medium">{campaign.title}</p>
                    </div>

                    {/* Stats Summary */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="card bg-black/30 backdrop-blur-md border border-gray-700 shadow-xl">
                            <div className="card-body">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-primary/20 rounded-lg">
                                        <FaUsers className="text-2xl text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-300">Total Donors</p>
                                        <p className="text-2xl font-bold text-white">{donorSummary.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card bg-black/30 backdrop-blur-md border border-gray-700 shadow-xl">
                            <div className="card-body">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-success/20 rounded-lg">
                                        <FaHeart className="text-2xl text-success" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-300">Total Donations</p>
                                        <p className="text-2xl font-bold text-white">{donations.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card bg-black/30 backdrop-blur-md border border-gray-700 shadow-xl">
                            <div className="card-body">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-secondary/20 rounded-lg">
                                        <FaDollarSign className="text-2xl text-secondary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-300">Total Raised</p>
                                        <p className="text-2xl font-bold text-white">৳{donations.reduce((sum, d) => sum + (d.amount || 0), 0).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Donors List */}
                    {donorSummary.length === 0 ? (
                        <div className="card bg-black/30 backdrop-blur-md border border-gray-700 shadow-xl">
                            <div className="card-body text-center py-12">
                                <FaUsers className="text-6xl text-gray-500 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold mb-2 text-white">No Donors Yet</h3>
                                <p className="text-gray-400 mb-6">
                                    Be the first to support this campaign!
                                </p>
                                <Link to={`/campaigns/${campaign.id}/donate`} className="btn btn-primary">
                                    <FaHeart className="mr-2" />
                                    Donate Now
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {donorSummary.map((donor, index) => (
                                <div 
                                    key={donor.donorId} 
                                    className="card bg-black/30 backdrop-blur-md border border-gray-700 shadow-xl hover:shadow-2xl transition-all"
                                >
                                    <div className="card-body">
                                        <div className="flex items-start justify-between flex-wrap gap-4">
                                            {/* Donor Info */}
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="avatar placeholder">
                                                    <div className="bg-gradient-to-br from-primary/70 via-secondary/70 to-primary/70 text-white rounded-full w-16">
                                                        {donor.anonymous ? (
                                                            <FaUserSecret className="text-2xl" />
                                                        ) : (
                                                            <span className="text-2xl font-bold">
                                                                {donor.donorName.charAt(0).toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="card-title text-lg text-white">
                                                            {donor.anonymous ? 'Anonymous Donor' : donor.donorName}
                                                        </h3>
                                                        {donor.anonymous && (
                                                            <span className="badge badge-ghost badge-sm">
                                                                <FaUserSecret className="mr-1" />
                                                                Anonymous
                                                            </span>
                                                        )}
                                                        {index < 3 && (
                                                            <span className="badge badge-primary badge-sm">
                                                                Top {index + 1}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {!donor.anonymous && donor.donorEmail && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                                                            <FaEnvelope className="text-xs" />
                                                            <span>{donor.donorEmail}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-4 text-sm text-gray-300">
                                                        <div className="flex items-center gap-1">
                                                            <FaHeart className="text-primary" />
                                                            <span>{donor.donationCount} {donor.donationCount === 1 ? 'donation' : 'donations'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <FaCalendarAlt className="text-secondary" />
                                                            <span>First: {new Date(donor.firstDonation).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Donation Amount */}
                                            <div className="text-right">
                                                <p className="text-sm text-gray-400 mb-1">Total Contributed</p>
                                                <p className="text-3xl font-bold text-success">
                                                    ৳{donor.totalAmount.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Individual Donations */}
                                        {donor.donations.length > 0 && (
                                            <div className="divider my-4 border-gray-700"></div>
                                        )}
                                        <div className="space-y-2">
                                            <p className="text-sm font-semibold text-gray-400 mb-2">Donation History:</p>
                                            {donor.donations
                                                .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
                                                .map((donation, idx) => (
                                                    <div 
                                                        key={donation.id || idx} 
                                                        className="flex items-center justify-between p-3 bg-black/20 backdrop-blur-sm rounded-lg border border-gray-600"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <FaReceipt className="text-primary" />
                                                            <div>
                                                                <p className="text-sm font-semibold text-white">
                                                                    ৳{donation.amount?.toLocaleString() || '0'}
                                                                </p>
                                                                <p className="text-xs text-gray-400">
                                                                    {donation.transactionId && `TXN: ${donation.transactionId}`}
                                                                    {donation.paymentMethod && ` • ${donation.paymentMethod}`}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-gray-400">
                                                                {new Date(donation.createdAt || donation.date).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </p>
                                                            {donation.status && (
                                                                <span className={`badge badge-sm mt-1 ${
                                                                    donation.status === 'completed' ? 'badge-success' : 
                                                                    donation.status === 'pending' ? 'badge-warning' : 
                                                                    'badge-error'
                                                                }`}>
                                                                    {donation.status}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CampaignDonors;

