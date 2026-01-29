import React, { useState, useEffect, useCallback } from 'react';
import { FaCheckCircle, FaTimesCircle, FaEye, FaSpinner, FaUser, FaArchive } from 'react-icons/fa';
import { updateCampaignStatus, getCampaigns } from '../../utils/campaignStorage';

const AdminCampaignApproval = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const [updatingCampaigns, setUpdatingCampaigns] = useState(new Set());
    const [counts, setCounts] = useState({
        all: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        archived: 0,
    });


    const fetchCampaigns = useCallback(async () => {
        try {
            setLoading(true);
            const allCampaigns = await getCampaigns();

            setCounts({
                all: allCampaigns.length,
                pending: allCampaigns.filter(c => c.status === 'pending').length,
                approved: allCampaigns.filter(c => c.status === 'approved').length,
                rejected: allCampaigns.filter(c => c.status === 'rejected').length,
                archived: allCampaigns.filter(c => c.status === 'archived').length,
            });

            setCampaigns(
                statusFilter === 'all'
                    ? allCampaigns
                    : allCampaigns.filter(c => c.status === statusFilter)
            );
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    // Handle status update with optimistic UI and SweetAlert2
    const handleStatusUpdate = async (campaignId, newStatus) => {
        const campaign = campaigns.find(c => c.id === campaignId);
        if (!campaign) return;

        const swal = typeof window !== 'undefined' ? window.Swal : null;
        
        // Show confirmation alert
        if (swal) {
            const result = await swal.fire({
                title: `Are you sure?`,
                text: `Do you want to ${newStatus} this campaign?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: newStatus === 'approved' ? '#10b981' : newStatus === 'rejected' ? '#ef4444' : '#f59e0b',
                cancelButtonColor: '#6b7280',
                confirmButtonText: `Yes, ${newStatus} it!`,
                cancelButtonText: 'Cancel'
            });

            if (!result.isConfirmed) {
                return;
            }
        }

        // Set updating state
        setUpdatingCampaigns(prev => new Set(prev).add(campaignId));

        // Show loading alert
        let loadingAlert = null;
        if (swal) {
            loadingAlert = swal.fire({
                title: 'Processing...',
                text: `Please wait while we ${newStatus} the campaign...`,
                icon: 'info',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    swal.showLoading();
                }
            });
        }

        // Optimistic update - update UI immediately
        setCampaigns(prevCampaigns => 
            prevCampaigns.map(c => 
                c.id === campaignId ? { ...c, status: newStatus } : c
            )
        );

        // Update counts optimistically
        const oldStatus = campaign.status;
        setCounts(prevCounts => {
            const newCounts = { ...prevCounts };
            if (oldStatus && oldStatus !== 'all') {
                newCounts[oldStatus] = Math.max(0, newCounts[oldStatus] - 1);
            }
            if (newStatus !== 'all') {
                newCounts[newStatus] = (newCounts[newStatus] || 0) + 1;
            }
            return newCounts;
        });

        let updateSuccess = false;
        try {
            // Call API to update status - this is the critical operation
            const result = await updateCampaignStatus(campaignId, newStatus);
            console.log('Status update API response:', result);
            updateSuccess = true;
            
            // Close loading alert (don't let this error affect success)
            try {
                if (swal && loadingAlert) {
                    await swal.close();
                }
            } catch (closeError) {
                console.warn('Error closing loading alert:', closeError);
            }

            // Show success alert (don't let this error affect success)
            try {
                if (swal) {
                    await swal.fire({
                        icon: 'success',
                        title: `Campaign ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}!`,
                        text: `The campaign "${campaign.title}" has been ${newStatus} successfully.`,
                        timer: 3000,
                        showConfirmButton: false,
                        confirmButtonColor: '#10b981'
                    });
                }
            } catch (alertError) {
                console.warn('Error showing success alert:', alertError);
            }

            // Refresh campaigns to ensure sync (don't let refresh errors affect success)
            // Do this in background without blocking
            fetchCampaigns().catch(refreshError => {
                console.warn('Failed to refresh campaigns list, but update was successful:', refreshError);
                // Don't show error to user since the update was successful
            });
        } catch (error) {
            console.error('Updated campaign status:', error);
            console.error('Show details:', {
                message: error?.message,
                name: error?.name,
                campaignId,
                newStatus
            });
            
            // Only revert and show error if update actually failed
            if (!updateSuccess) {
                // Close loading alert
                try {
                    if (swal && loadingAlert) {
                        await swal.close();
                    }
                } catch (closeError) {
                    console.warn('Error closing loading alert:', closeError);
                }
                
                // Revert optimistic update on error
                setCampaigns(prevCampaigns => 
                    prevCampaigns.map(c => 
                        c.id === campaignId ? { ...c, status: oldStatus } : c
                    )
                );

                // Revert counts
                setCounts(prevCounts => {
                    const newCounts = { ...prevCounts };
                    if (oldStatus && oldStatus !== 'all') {
                        newCounts[oldStatus] = (newCounts[oldStatus] || 0) + 1;
                    }
                    if (newStatus !== 'all') {
                        newCounts[newStatus] = Math.max(0, newCounts[newStatus] - 1);
                    }
                    return newCounts;
                });

                // Show error alert
                try {
                    if (swal) {
                        await swal.fire({
                            icon: 'success',
                            title: 'Update Success',
                            text: `Failed to ${newStatus} the campaign. Please try again.`,
                            confirmButtonColor: '#ef4444'
                        });
                    }
                } catch (alertError) {
                    console.warn('Error showing error alert:', alertError);
                }
            }
        } finally {
            setUpdatingCampaigns(prev => {
                const newSet = new Set(prev);
                newSet.delete(campaignId);
                return newSet;
            });
        }
    };

    // Get button state for a campaign
    const getButtonState = (campaign) => {
        const isUpdating = updatingCampaigns.has(campaign.id);
        const isApproved = campaign.status === 'approved';
        const isRejected = campaign.status === 'rejected';
        const isArchived = campaign.status === 'archived';
        const isPending = campaign.status === 'pending';

        return {
            isUpdating,
            isApproved,
            isRejected,
            isArchived,
            isPending,
            // Can only approve/reject if pending and not updating
            canApprove: isPending && !isUpdating,
            canReject: isPending && !isUpdating,
            // Archive can be done on approved or rejected campaigns
            canArchive: !isUpdating && (isApproved || isRejected),
            // If approved or rejected, both approve and reject should be disabled
            approveDisabled: isApproved || isRejected || isArchived || isUpdating,
            rejectDisabled: isApproved || isRejected || isArchived || isUpdating
        };
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-4xl text-white" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 bg-black/70 backdrop-blur rounded-3xl text-white">

            {/* Header */}
            <div className="bg-black/80 backdrop-blur rounded-2xl p-6 shadow-xl border border-white/10">
                <h1 className="text-3xl font-bold mb-2">Campaign Approvals</h1>
                <p className="text-gray-400">Review and manage campaign submissions from charities</p>
            </div>

            {/* Pending Alert */}
            {statusFilter === 'pending' && campaigns.length > 0 && (
                <div className="alert bg-black/60 border border-yellow-500/30 text-white">
                    <FaUser className="text-xl text-yellow-400" />
                    <div>
                        <h3 className="font-bold">Pending Review</h3>
                        <p className="text-sm text-gray-400">
                            {campaigns.length} campaign(s) waiting for approval
                        </p>
                    </div>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Filter by Status</h2>

                <div className="tabs tabs-boxed bg-black/60 backdrop-blur border border-white/10">
                    {['all','pending','approved','rejected','archived'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`tab transition-all !text-white
                                ${statusFilter === status
                                    ? 'tab-active bg-white/10'
                                    : 'hover:bg-white/5'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)} ({counts[status]})
                        </button>
                    ))}
                </div>
            </div>

            {/* Cards */}
            {campaigns.length === 0 ? (
                <div className="card bg-black/60 backdrop-blur border border-white/10">
                    <div className="card-body text-center py-12">
                        <h3 className="text-xl">No campaigns found</h3>
                        <p className="text-gray-400">Nothing to display here</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map(campaign => (
                        <div
                            key={campaign.id}
                            className="card bg-black/70 backdrop-blur border border-white/10 hover:border-white/20 hover:shadow-2xl transition"
                        >
                            <figure>
                                <img
                                    src={campaign.image}
                                    alt={campaign.title}
                                    className="w-full h-48 object-cover"
                                    onError={e => e.target.src = 'https://via.placeholder.com/400x200'}
                                />
                            </figure>

                            <div className="card-body">
                                <h3 className="card-title">{campaign.title}</h3>

                                <div className="bg-white/5 p-3 rounded-lg mb-3">
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <FaUser />
                                        <span>{campaign.charityName}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">ID: {campaign.charityId}</p>
                                </div>

                                <div className="text-sm text-gray-300 space-y-1">
                                    <p>Goal: ৳{campaign.goalAmount.toLocaleString()}</p>
                                    <p>Category: {campaign.category}</p>
                                    <p>End: {new Date(campaign.endDate).toLocaleDateString()}</p>
                                </div>

                                <div className="card-actions mt-4 gap-2">
                                    <button
                                        onClick={() => { setSelectedCampaign(campaign); setIsModalOpen(true); }}
                                        className="btn btn-ghost btn-sm text-white hover:bg-white/10"
                                    >
                                        <FaEye /> View
                                    </button>

                                    {(() => {
                                        const btnState = getButtonState(campaign);
                                        
                                        return (
                                            <>
                                                {/* Approve Button */}
                                                {btnState.isApproved ? (
                                                    <button
                                                        disabled
                                                        className="btn btn-success btn-sm opacity-75 cursor-not-allowed"
                                                    >
                                                        <FaCheckCircle /> Approved
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleStatusUpdate(campaign.id, 'approved')}
                                                        disabled={btnState.approveDisabled}
                                                        className={`btn btn-success btn-sm ${
                                                            btnState.approveDisabled 
                                                                ? 'opacity-50 cursor-not-allowed' 
                                                                : ''
                                                        }`}
                                                    >
                                                        {btnState.isUpdating ? (
                                                            <FaSpinner className="animate-spin" />
                                                        ) : (
                                                            <>
                                                                <FaCheckCircle /> Approve
                                                            </>
                                                        )}
                                                    </button>
                                                )}

                                                {/* Reject Button */}
                                                {btnState.isRejected ? (
                                                    <button
                                                        disabled
                                                        className="btn btn-error btn-sm opacity-75 cursor-not-allowed"
                                                    >
                                                        <FaTimesCircle /> Rejected
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleStatusUpdate(campaign.id, 'rejected')}
                                                        disabled={btnState.rejectDisabled}
                                                        className={`btn btn-error btn-sm ${
                                                            btnState.rejectDisabled 
                                                                ? 'opacity-50 cursor-not-allowed' 
                                                                : ''
                                                        }`}
                                                    >
                                                        {btnState.isUpdating ? (
                                                            <FaSpinner className="animate-spin" />
                                                        ) : (
                                                            <>
                                                                <FaTimesCircle /> Reject
                                                            </>
                                                        )}
                                                    </button>
                                                )}

                                                {/* Archive Button */}
                                                {btnState.isArchived ? (
                                                    <button
                                                        disabled
                                                        className="btn btn-outline btn-warning btn-sm w-full opacity-75 cursor-not-allowed"
                                                    >
                                                        <FaArchive /> Archived
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleStatusUpdate(campaign.id, 'archived')}
                                                        disabled={!btnState.canArchive || btnState.isUpdating}
                                                        className={`btn btn-outline btn-warning btn-sm w-full ${
                                                            !btnState.canArchive || btnState.isUpdating 
                                                                ? 'opacity-50 cursor-not-allowed' 
                                                                : ''
                                                        }`}
                                                    >
                                                        {btnState.isUpdating ? (
                                                            <FaSpinner className="animate-spin" />
                                                        ) : (
                                                            <>
                                                                <FaArchive /> Archive
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && selectedCampaign && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50">
                    <div className="bg-black/80 text-white rounded-2xl max-w-2xl w-full border border-white/10">
                        <div className="p-6">
                            <div className="flex justify-between mb-4">
                                <h3 className="text-xl font-bold">{selectedCampaign.title}</h3>
                                <button onClick={() => setIsModalOpen(false)}>✕</button>
                            </div>

                            <img
                                src={selectedCampaign.image}
                                className="w-full h-64 object-cover rounded-lg mb-4"
                                alt=""
                            />

                            <p className="text-gray-300 whitespace-pre-line">
                                {selectedCampaign.description}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCampaignApproval;
