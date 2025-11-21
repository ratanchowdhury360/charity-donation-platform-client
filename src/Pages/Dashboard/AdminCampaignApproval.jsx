import React, { useState, useEffect, useCallback } from 'react';
import { FaCheckCircle, FaTimesCircle, FaEye, FaSpinner, FaUser, FaEnvelope, FaTrash } from 'react-icons/fa';
import { updateCampaignStatus, getCampaigns, deleteCampaign } from '../../utils/campaignStorage';

const AdminCampaignApproval = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
    const [counts, setCounts] = useState({
        all: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
    });

    const fetchCampaigns = useCallback(async () => {
        try {
            setLoading(true);
            const allCampaigns = await getCampaigns();

            const pendingCount = allCampaigns.filter(c => c.status === 'pending').length;
            const approvedCount = allCampaigns.filter(c => c.status === 'approved').length;
            const rejectedCount = allCampaigns.filter(c => c.status === 'rejected').length;

            setCounts({
                all: allCampaigns.length,
                pending: pendingCount,
                approved: approvedCount,
                rejected: rejectedCount,
            });

            const filteredList =
                statusFilter === 'all'
                    ? allCampaigns
                    : allCampaigns.filter(campaign => campaign.status === statusFilter);

            setCampaigns(filteredList);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    const handleApprove = async (campaignId) => {
        try {
            // Optimistically update the UI immediately
            setCampaigns(prevCampaigns => 
                prevCampaigns.filter(c => c.id !== campaignId)
            );
            
            // Update counts immediately
            setCounts(prevCounts => ({
                ...prevCounts,
                pending: Math.max(0, prevCounts.pending - 1),
                approved: prevCounts.approved + 1,
            }));

            // Update selected campaign in modal if it's open
            if (isModalOpen && selectedCampaign?.id === campaignId) {
                setSelectedCampaign(prev => prev ? { ...prev, status: 'approved' } : null);
            }

            // Update the actual status in storage
            await updateCampaignStatus(campaignId, 'approved');
            
            // Refetch to ensure consistency
            await fetchCampaigns();
            
            // Close modal if it was the approved campaign
            if (isModalOpen && selectedCampaign?.id === campaignId) {
                closeModal();
            }
        } catch (error) {
            console.error('Error approving campaign:', error);
            // Revert on error by refetching
            await fetchCampaigns();
        }
    };

    const handleReject = async (campaignId) => {
        try {
            // Optimistically update the UI immediately
            setCampaigns(prevCampaigns => 
                prevCampaigns.filter(c => c.id !== campaignId)
            );
            
            // Update counts immediately
            setCounts(prevCounts => ({
                ...prevCounts,
                pending: Math.max(0, prevCounts.pending - 1),
                rejected: prevCounts.rejected + 1,
            }));

            // Update selected campaign in modal if it's open
            if (isModalOpen && selectedCampaign?.id === campaignId) {
                setSelectedCampaign(prev => prev ? { ...prev, status: 'rejected' } : null);
            }

            // Update the actual status in storage
            await updateCampaignStatus(campaignId, 'rejected');
            
            // Refetch to ensure consistency
            await fetchCampaigns();
            
            // Close modal if it was the rejected campaign
            if (isModalOpen && selectedCampaign?.id === campaignId) {
                closeModal();
            }
        } catch (error) {
            console.error('Error rejecting campaign:', error);
            // Revert on error by refetching
            await fetchCampaigns();
        }
    };

    const handleDelete = async (campaignId) => {
        if (!window.confirm('Are you sure you want to permanently delete this campaign? This action cannot be undone.')) {
            return;
        }

        try {
            // Optimistically update the UI immediately
            const campaignToDelete = campaigns.find(c => c.id === campaignId);
            setCampaigns(prevCampaigns => 
                prevCampaigns.filter(c => c.id !== campaignId)
            );
            
            // Update counts immediately
            if (campaignToDelete) {
                setCounts(prevCounts => ({
                    ...prevCounts,
                    all: Math.max(0, prevCounts.all - 1),
                    [campaignToDelete.status]: Math.max(0, prevCounts[campaignToDelete.status] - 1),
                }));
            }

            // Delete from storage
            await deleteCampaign(campaignId);
            
            // Refetch to ensure consistency
            await fetchCampaigns();
            
            // Close modal if it was the deleted campaign
            if (isModalOpen && selectedCampaign?.id === campaignId) {
                closeModal();
            }
        } catch (error) {
            console.error('Error deleting campaign:', error);
            alert('Failed to delete campaign. Please try again.');
            // Revert on error by refetching
            await fetchCampaigns();
        }
    };

    const openModal = (campaign) => {
        setSelectedCampaign(campaign);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCampaign(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-4xl text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-6 shadow-xl">
                <h1 className="text-3xl font-bold mb-2">Campaign Approvals</h1>
                <p className="text-lg opacity-90">Review and manage campaign submissions from charities</p>
            </div>

            {/* Summary Stats */}
            {statusFilter === 'pending' && campaigns.length > 0 && (
                <div className="alert alert-warning shadow-lg">
                    <FaUser className="text-2xl" />
                    <div>
                        <h3 className="font-bold">Pending Review</h3>
                        <div className="text-sm">
                            {campaigns.length} campaign{campaigns.length > 1 ? 's' : ''} waiting for approval from {new Set(campaigns.map(c => c.charityName)).size} {new Set(campaigns.map(c => c.charityName)).size > 1 ? 'charities' : 'charity'}
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Filter by Status</h2>
                <div className="tabs tabs-boxed bg-gradient-to-r from-primary/10 to-secondary/10 shadow-md border border-primary/20">
                    <button 
                        className={`tab ${statusFilter === 'all' ? 'tab-active' : ''}`}
                        onClick={() => setStatusFilter('all')}
                    >
                        All ({counts.all})
                    </button>
                    <button 
                        className={`tab ${statusFilter === 'pending' ? 'tab-active' : ''}`}
                        onClick={() => setStatusFilter('pending')}
                    >
                        Pending ({counts.pending})
                    </button>
                    <button 
                        className={`tab ${statusFilter === 'approved' ? 'tab-active' : ''}`}
                        onClick={() => setStatusFilter('approved')}
                    >
                        Approved ({counts.approved})
                    </button>
                    <button 
                        className={`tab ${statusFilter === 'rejected' ? 'tab-active' : ''}`}
                        onClick={() => setStatusFilter('rejected')}
                    >
                        Rejected ({counts.rejected})
                    </button>
                </div>
            </div>

            {campaigns.length === 0 ? (
                <div className="card bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5 shadow-lg border border-primary/20">
                    <div className="card-body text-center py-12">
                        <h3 className="text-xl font-medium">No {statusFilter} campaigns</h3>
                        <p className="text-gray-500">
                            {statusFilter === 'pending' 
                                ? 'There are no campaigns waiting for approval.' 
                                : `There are no ${statusFilter} campaigns.`}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map((campaign) => (
                        <div key={campaign.id} className="card bg-gradient-to-br from-white via-primary/10 to-secondary/10 shadow-xl border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-2xl hover:scale-[1.02]">
                            <figure>
                                <img 
                                    src={campaign.image} 
                                    alt={campaign.title} 
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400x200';
                                    }}
                                />
                            </figure>
                            <div className="card-body">
                                <h3 className="card-title text-lg">{campaign.title}</h3>
                                
                                {/* Charity Info - Highlighted */}
                                <div className="bg-primary/10 p-3 rounded-lg mb-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <FaUser className="text-primary" />
                                        <span className="font-semibold text-primary">Charity Information</span>
                                    </div>
                                    <p className="text-sm font-medium">{campaign.charityName}</p>
                                    <p className="text-xs text-gray-600">ID: {campaign.charityId}</p>
                                </div>
                                
                                <div className="text-sm space-y-1">
                                    <p><span className="font-medium">Goal:</span> ৳{campaign.goalAmount.toLocaleString()}</p>
                                    <p><span className="font-medium">Category:</span> <span className="capitalize">{campaign.category}</span></p>
                                    <p><span className="font-medium">End Date:</span> {new Date(campaign.endDate).toLocaleDateString()}</p>
                                    <p><span className="font-medium">Created:</span> {new Date(campaign.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="card-actions flex-col gap-2 mt-4">
                                    <div className="flex justify-between w-full">
                                        <button 
                                            onClick={() => openModal(campaign)}
                                            className="btn btn-ghost btn-sm"
                                        >
                                            <FaEye className="mr-1" /> View Details
                                        </button>
                                        {statusFilter === 'all' && campaign.status !== 'pending' && (
                                            <span className={`badge ${campaign.status === 'approved' ? 'badge-success' : 'badge-error'}`}>
                                                {campaign.status}
                                            </span>
                                        )}
                                    </div>
                                    {(statusFilter === 'pending' || (statusFilter === 'all' && campaign.status === 'pending')) && (
                                        <div className="flex gap-2 w-full">
                                            <button 
                                                onClick={() => handleApprove(campaign.id)}
                                                className="btn btn-success btn-sm flex-1"
                                            >
                                                <FaCheckCircle className="mr-1" /> Approve
                                            </button>
                                            <button 
                                                onClick={() => handleReject(campaign.id)}
                                                className="btn btn-error btn-sm flex-1"
                                            >
                                                <FaTimesCircle className="mr-1" /> Reject
                                            </button>
                                        </div>
                                    )}
                                    <button 
                                        onClick={() => handleDelete(campaign.id)}
                                        className="btn btn-outline btn-error btn-sm w-full"
                                    >
                                        <FaTrash className="mr-1" /> Delete Campaign
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Campaign Details Modal */}
            {isModalOpen && selectedCampaign && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-base-100 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold">{selectedCampaign.title}</h3>
                                <button onClick={closeModal} className="btn btn-ghost btn-sm">
                                    ✕
                                </button>
                            </div>
                            
                            <img 
                                src={selectedCampaign.image} 
                                alt={selectedCampaign.title}
                                className="w-full h-64 object-cover rounded-lg mb-4"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/800x400';
                                }}
                            />
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Charity</p>
                                    <p>{selectedCampaign.charityName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Category</p>
                                    <p className="capitalize">{selectedCampaign.category}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Goal Amount</p>
                                    <p>৳{selectedCampaign.goalAmount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">End Date</p>
                                    <p>{new Date(selectedCampaign.endDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <h4 className="font-medium mb-2">Description</h4>
                                <p className="whitespace-pre-line">{selectedCampaign.description}</p>
                            </div>
                            
                            <div className="mt-6 space-y-3">
                                {(statusFilter === 'pending' || (statusFilter === 'all' && selectedCampaign.status === 'pending')) && (
                                    <div className="flex justify-end space-x-2">
                                        <button 
                                            onClick={() => handleReject(selectedCampaign.id)}
                                            className="btn btn-error"
                                        >
                                            <FaTimesCircle className="mr-1" /> Reject
                                        </button>
                                        <button 
                                            onClick={() => handleApprove(selectedCampaign.id)}
                                            className="btn btn-success"
                                        >
                                            <FaCheckCircle className="mr-1" /> Approve
                                        </button>
                                    </div>
                                )}
                                {statusFilter === 'all' && selectedCampaign.status !== 'pending' && (
                                    <div>
                                        <span className={`badge badge-lg ${selectedCampaign.status === 'approved' ? 'badge-success' : 'badge-error'}`}>
                                            Status: {selectedCampaign.status}
                                        </span>
                                    </div>
                                )}
                                <div className="border-t pt-3">
                                    <button 
                                        onClick={() => handleDelete(selectedCampaign.id)}
                                        className="btn btn-outline btn-error w-full"
                                    >
                                        <FaTrash className="mr-2" /> Delete Campaign Permanently
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCampaignApproval;
