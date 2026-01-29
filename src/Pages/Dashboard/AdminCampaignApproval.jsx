import React, { useState, useEffect, useCallback } from 'react';
import { FaCheckCircle, FaTimesCircle, FaEye, FaSpinner, FaUser, FaArchive } from 'react-icons/fa';
import { updateCampaignStatus, getCampaigns } from '../../utils/campaignStorage';

const AdminCampaignApproval = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
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

                                    <button
                                        onClick={() => updateCampaignStatus(campaign.id, 'approved')}
                                        className="btn btn-success btn-sm"
                                    >
                                        <FaCheckCircle /> Approve
                                    </button>

                                    <button
                                        onClick={() => updateCampaignStatus(campaign.id, 'rejected')}
                                        className="btn btn-error btn-sm"
                                    >
                                        <FaTimesCircle /> Reject
                                    </button>

                                    <button
                                        onClick={() => updateCampaignStatus(campaign.id, 'archived')}
                                        className="btn btn-outline btn-warning btn-sm w-full"
                                    >
                                        <FaArchive /> Archive
                                    </button>
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
