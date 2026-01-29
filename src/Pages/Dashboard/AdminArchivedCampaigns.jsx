import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getCampaigns, updateCampaign } from '../../utils/campaignStorage';
import { FaHourglassEnd, FaRedoAlt, FaCalendarAlt } from 'react-icons/fa';

const AdminArchivedCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [newEndDate, setNewEndDate] = useState('');
    const [feedback, setFeedback] = useState({ type: '', text: '' });
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchArchivedCampaigns();
    }, []);

    const fetchArchivedCampaigns = async () => {
        try {
            setLoading(true);
            const allCampaigns = await getCampaigns();
            const now = new Date();
            const archived = allCampaigns
                .filter(campaign => new Date(campaign.endDate) < now)
                .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
            setCampaigns(archived);
            setFeedback({ type: '', text: '' });
        } catch (error) {
            console.error(error);
            setFeedback({ type: 'error', text: 'Unable to load archived campaigns.' });
        } finally {
            setLoading(false);
        }
    };

    const openExtendModal = (campaign) => {
        setSelectedCampaign(campaign);
        setNewEndDate(new Date(campaign.endDate).toISOString().split('T')[0]);
    };

    const closeModal = () => {
        setSelectedCampaign(null);
        setNewEndDate('');
        setProcessing(false);
    };

    const handleExtend = async (event) => {
        event.preventDefault();
        if (!selectedCampaign || !newEndDate) return;

        try {
            setProcessing(true);
            await updateCampaign(selectedCampaign.id, { endDate: newEndDate });
            setFeedback({ type: 'success', text: `Extended ${selectedCampaign.title} to ${newEndDate}` });
            closeModal();
            fetchArchivedCampaigns();
        } catch (error) {
            console.error(error);
            setFeedback({ type: 'error', text: 'Failed to extend campaign. Please try again.' });
            setProcessing(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Archived Campaigns - Admin</title>
            </Helmet>

            <div className="space-y-6 p-4 bg-black/70 backdrop-blur rounded-3xl text-white">

                {/* Header */}
                <div className="bg-black/80 backdrop-blur rounded-2xl p-6 shadow-xl border border-white/10 flex flex-col gap-2">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <FaHourglassEnd />
                        Ended Campaigns
                    </h1>
                    <p className="text-gray-400">
                        Campaigns that passed their end time appear here automatically. Extend a deadline to bring them back live.
                    </p>
                </div>

                {feedback.text && (
                    <div
                        className={`alert ${
                            feedback.type === 'success'
                                ? 'bg-green-500/10 border border-green-500/30 text-green-300'
                                : 'bg-red-500/10 border border-red-500/30 text-red-300'
                        }`}
                    >
                        {feedback.text}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-20">
                        <span className="loading loading-spinner loading-lg text-white"></span>
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="card bg-black/60 backdrop-blur border border-white/10 shadow-xl">
                        <div className="card-body text-center py-16">
                            <FaHourglassEnd className="text-5xl text-yellow-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-semibold mb-2">No ended campaigns 🎉</h3>
                            <p className="text-gray-400">
                                All approved campaigns are currently within their timeline.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {campaigns.map((campaign) => (
                            <div
                                key={campaign.id}
                                className="card bg-black/70 backdrop-blur border border-white/10 hover:border-white/20 hover:shadow-2xl hover:scale-[1.02] transition-all"
                            >
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <span className="badge bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                                            Ended
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            Created {new Date(campaign.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <h3 className="card-title text-lg mt-2">{campaign.title}</h3>
                                    <p className="text-sm text-gray-400 mb-4">By {campaign.charityName}</p>

                                    <div className="space-y-2 text-sm text-gray-300">
                                        <div className="flex justify-between">
                                            <span>Goal</span>
                                            <span className="font-semibold">
                                                ৳{campaign.goalAmount.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Raised</span>
                                            <span className="font-semibold text-green-400">
                                                ৳{(campaign.currentAmount || 0).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="flex items-center gap-1">
                                                <FaCalendarAlt /> Ended On
                                            </span>
                                            <span>{new Date(campaign.endDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="card-actions mt-4">
                                        <button
                                            className="btn btn-outline btn-warning w-full"
                                            onClick={() => openExtendModal(campaign)}
                                        >
                                            <FaRedoAlt />
                                            Extend timeline
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Extend Modal */}
                {selectedCampaign && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50 p-4">
                        <div className="bg-black/80 text-white rounded-2xl w-full max-w-md shadow-2xl border border-white/10">
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold">Extend Campaign</h3>
                                    <button className="btn btn-sm btn-ghost text-white" onClick={closeModal}>
                                        ✕
                                    </button>
                                </div>

                                <p className="text-sm text-gray-400">{selectedCampaign.title}</p>

                                <form className="space-y-4" onSubmit={handleExtend}>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-gray-300 font-semibold">
                                                New end date
                                            </span>
                                        </label>
                                        <input
                                            type="date"
                                            min={new Date().toISOString().split('T')[0]}
                                            className="input bg-black/60 border border-white/20 text-white"
                                            value={newEndDate}
                                            onChange={(e) => setNewEndDate(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button className="btn btn-warning w-full" disabled={processing}>
                                        {processing ? (
                                            <>
                                                <span className="loading loading-spinner"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <FaRedoAlt />
                                                Extend & Restore
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminArchivedCampaigns;
