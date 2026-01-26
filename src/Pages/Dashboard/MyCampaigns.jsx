import React, { useState, useEffect } from 'react';
import { useAuth } from '../../provider/authProvider';
import { getCampaignsByCharity } from '../../utils/campaignStorage';
import { FaEye, FaEdit, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MyCampaigns = () => {
    const { currentUser } = useAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchMyCampaigns = async () => {
            try {
                setLoading(true);
                if (currentUser?.uid) {
                    const myCampaigns = await getCampaignsByCharity(currentUser.uid);
                    setCampaigns(myCampaigns);
                } else {
                    setCampaigns([]);
                }
            } catch (error) {
                console.error('Error fetching campaigns:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyCampaigns();
    }, [currentUser]);

    const getFilteredCampaigns = () => {
        if (filter === 'all') return campaigns;
        return campaigns.filter(campaign => campaign.status === filter);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return (
                    <div className="badge badge-warning gap-2">
                        <FaClock /> Pending
                    </div>
                );
            case 'approved':
                return (
                    <div className="badge badge-success gap-2">
                        <FaCheckCircle /> Approved
                    </div>
                );
            case 'rejected':
                return (
                    <div className="badge badge-error gap-2">
                        <FaTimesCircle /> Rejected
                    </div>
                );
            default:
                return <div className="badge">{status}</div>;
        }
    };

    const filteredCampaigns = getFilteredCampaigns();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-600 text-white rounded-lg p-6 shadow-xl border-2 border-teal-400/30">
                    <h1 className="text-3xl font-bold">My Campaigns</h1>
                    <p className="text-lg opacity-95 mt-1">
                        Manage and track your fundraising campaigns
                    </p>
                </div>

                <Link
                    to="/dashboard/charity/campaigns/create"
                    className="btn bg-gradient-to-r from-teal-500 to-cyan-600 text-white border-0 hover:from-teal-600 hover:to-cyan-700 shadow-lg"
                >
                    <FaEdit className="mr-2" /> Create New Campaign
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card bg-gradient-to-br from-teal-500 via-cyan-500 to-teal-600 shadow-lg border-2 border-teal-400">
                    <div className="card-body">
                        <h3 className="text-sm text-white font-bold">Total Campaigns</h3>
                        <p className="text-3xl font-black text-white">{campaigns.length}</p>
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 shadow-lg border-2 border-amber-400">
                    <div className="card-body">
                        <h3 className="text-sm text-white font-bold">Pending</h3>
                        <p className="text-3xl font-black text-white">
                            {campaigns.filter(c => c.status === 'pending').length}
                        </p>
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 shadow-lg border-2 border-emerald-400">
                    <div className="card-body">
                        <h3 className="text-sm text-white font-bold">Approved</h3>
                        <p className="text-3xl font-black text-white">
                            {campaigns.filter(c => c.status === 'approved').length}
                        </p>
                    </div>
                </div>

                <div className="card bg-gradient-to-br from-rose-500 via-red-500 to-rose-600 shadow-lg border-2 border-rose-400">
                    <div className="card-body">
                        <h3 className="text-sm text-white font-bold">Rejected</h3>
                        <p className="text-3xl font-black text-white">
                            {campaigns.filter(c => c.status === 'rejected').length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="tabs tabs-boxed bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 text-white shadow-lg border-2 border-teal-600 w-fit">
                <button className={`tab ${filter === 'all' ? 'tab-active' : ''}`} onClick={() => setFilter('all')}>
                    All ({campaigns.length})
                </button>
                <button className={`tab ${filter === 'pending' ? 'tab-active' : ''}`} onClick={() => setFilter('pending')}>
                    Pending ({campaigns.filter(c => c.status === 'pending').length})
                </button>
                <button className={`tab ${filter === 'approved' ? 'tab-active' : ''}`} onClick={() => setFilter('approved')}>
                    Approved ({campaigns.filter(c => c.status === 'approved').length})
                </button>
                <button className={`tab ${filter === 'rejected' ? 'tab-active' : ''}`} onClick={() => setFilter('rejected')}>
                    Rejected ({campaigns.filter(c => c.status === 'rejected').length})
                </button>
            </div>

            {/* Campaign Cards */}
            {filteredCampaigns.length === 0 ? (
                <div className="card bg-gradient-to-br from-teal-100 via-cyan-100 to-teal-100 shadow-lg border-2 border-teal-300">
                    <div className="card-body text-center py-12">
                        <h3 className="text-xl font-bold text-teal-900">No campaigns found</h3>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCampaigns.map((campaign) => (
                        <div
                            key={campaign.id}
                            className="card bg-black/70 backdrop-blur-md text-white
                                       shadow-xl border border-teal-500/30
                                       hover:border-cyan-400/60 hover:shadow-cyan-500/20
                                       hover:scale-[1.02] transition-all duration-300"
                        >
                            <figure className="relative">
                                <img
                                    src={campaign.image}
                                    alt={campaign.title}
                                    className="w-full h-48 object-cover opacity-90"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400x200';
                                    }}
                                />
                                <div className="absolute top-2 right-2">
                                    {getStatusBadge(campaign.status)}
                                </div>
                            </figure>

                            <div className="card-body">
                                <h3 className="card-title text-lg font-bold text-white">
                                    {campaign.title}
                                </h3>

                                <div className="space-y-2 text-sm p-3 bg-black/60 rounded-lg border border-teal-500/30">
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Goal:</span>
                                        <span className="font-bold text-teal-300">
                                            ৳{campaign.goalAmount.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Raised:</span>
                                        <span className="font-bold text-emerald-400">
                                            ৳{campaign.currentAmount.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Category:</span>
                                        <span className="capitalize font-bold text-cyan-300">
                                            {campaign.category}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">End Date:</span>
                                        <span className="font-bold text-teal-300">
                                            {new Date(campaign.endDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <progress
                                        className="progress progress-secondary w-full h-3"
                                        value={campaign.currentAmount}
                                        max={campaign.goalAmount}
                                    ></progress>
                                </div>

                                <div className="card-actions justify-end mt-4">
                                    <button className="btn btn-outline btn-sm border-gray-500 text-gray-200 hover:bg-white/10">
                                        <FaEye className="mr-1" /> View Details
                                    </button>
                                    {campaign.status === 'approved' && (
                                        <button className="btn btn-sm bg-gradient-to-r from-teal-500 to-cyan-600 text-white border-0">
                                            <FaEdit className="mr-1" /> Edit
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyCampaigns;
