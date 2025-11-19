import React, { useState, useEffect } from 'react';
import { useAuth } from '../../provider/authProvider';
import { getCampaignsByCharity } from '../../utils/campaignStorage';
import { FaEye, FaEdit, FaTrash, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MyCampaigns = () => {
    const { currentUser } = useAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

    useEffect(() => {
        fetchMyCampaigns();
    }, [currentUser]);

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
                <div>
                    <h1 className="text-3xl font-bold">My Campaigns</h1>
                    <p className="text-gray-600 mt-1">Manage and track your fundraising campaigns</p>
                </div>
                <Link to="/dashboard/charity/campaigns/create" className="btn btn-primary">
                    <FaEdit className="mr-2" /> Create New Campaign
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <h3 className="text-sm text-gray-600">Total Campaigns</h3>
                        <p className="text-3xl font-bold text-primary">{campaigns.length}</p>
                    </div>
                </div>
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <h3 className="text-sm text-gray-600">Pending</h3>
                        <p className="text-3xl font-bold text-warning">
                            {campaigns.filter(c => c.status === 'pending').length}
                        </p>
                    </div>
                </div>
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <h3 className="text-sm text-gray-600">Approved</h3>
                        <p className="text-3xl font-bold text-success">
                            {campaigns.filter(c => c.status === 'approved').length}
                        </p>
                    </div>
                </div>
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <h3 className="text-sm text-gray-600">Rejected</h3>
                        <p className="text-3xl font-bold text-error">
                            {campaigns.filter(c => c.status === 'rejected').length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="tabs tabs-boxed bg-base-100 shadow-md w-fit">
                <button 
                    className={`tab ${filter === 'all' ? 'tab-active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All ({campaigns.length})
                </button>
                <button 
                    className={`tab ${filter === 'pending' ? 'tab-active' : ''}`}
                    onClick={() => setFilter('pending')}
                >
                    Pending ({campaigns.filter(c => c.status === 'pending').length})
                </button>
                <button 
                    className={`tab ${filter === 'approved' ? 'tab-active' : ''}`}
                    onClick={() => setFilter('approved')}
                >
                    Approved ({campaigns.filter(c => c.status === 'approved').length})
                </button>
                <button 
                    className={`tab ${filter === 'rejected' ? 'tab-active' : ''}`}
                    onClick={() => setFilter('rejected')}
                >
                    Rejected ({campaigns.filter(c => c.status === 'rejected').length})
                </button>
            </div>

            {/* Campaigns List */}
            {filteredCampaigns.length === 0 ? (
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body text-center py-12">
                        <h3 className="text-xl font-medium">No campaigns found</h3>
                        <p className="text-gray-500 mt-2">
                            {filter === 'all' 
                                ? "You haven't created any campaigns yet. Click 'Create New Campaign' to get started!"
                                : `You don't have any ${filter} campaigns.`}
                        </p>
                        {filter === 'all' && (
                            <Link to="/dashboard/charity/campaigns/create" className="btn btn-primary mt-4 w-fit mx-auto">
                                Create Your First Campaign
                            </Link>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCampaigns.map((campaign) => (
                        <div key={campaign.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                            <figure className="relative">
                                <img 
                                    src={campaign.image} 
                                    alt={campaign.title}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400x200';
                                    }}
                                />
                                <div className="absolute top-2 right-2">
                                    {getStatusBadge(campaign.status)}
                                </div>
                            </figure>
                            <div className="card-body">
                                <h3 className="card-title text-lg">{campaign.title}</h3>
                                
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Goal:</span>
                                        <span className="font-semibold">৳{campaign.goalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Raised:</span>
                                        <span className="font-semibold text-success">৳{campaign.currentAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Category:</span>
                                        <span className="capitalize">{campaign.category}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">End Date:</span>
                                        <span>{new Date(campaign.endDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Created:</span>
                                        <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>Progress</span>
                                        <span>{Math.round((campaign.currentAmount / campaign.goalAmount) * 100)}%</span>
                                    </div>
                                    <progress 
                                        className="progress progress-primary w-full" 
                                        value={campaign.currentAmount} 
                                        max={campaign.goalAmount}
                                    ></progress>
                                </div>

                                <div className="card-actions justify-end mt-4">
                                    <button className="btn btn-ghost btn-sm">
                                        <FaEye className="mr-1" /> View Details
                                    </button>
                                    {campaign.status === 'approved' && (
                                        <button className="btn btn-primary btn-sm">
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
