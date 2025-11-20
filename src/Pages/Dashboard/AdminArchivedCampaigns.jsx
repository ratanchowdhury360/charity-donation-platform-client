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
            console.error('Failed to fetch archived campaigns', error);
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
            console.error('Failed to extend campaign', error);
            setFeedback({ type: 'error', text: 'Failed to extend campaign. Please try again.' });
            setProcessing(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Archived Campaigns - Admin</title>
            </Helmet>

            <div className="space-y-6">
                <div className="bg-gradient-to-r from-warning to-secondary text-white rounded-lg p-6 shadow-xl flex flex-col gap-2">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <FaHourglassEnd />
                        Ended Campaigns
                    </h1>
                    <p className="text-white/80">
                        Campaigns that passed their end time appear here automatically. Extend a deadline to bring them back to the live
                        campaign list instantly.
                    </p>
                </div>

                {feedback.text && (
                    <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                        {feedback.text}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-20">
                        <span className="loading loading-spinner loading-lg text-warning"></span>
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body text-center py-16">
                            <FaHourglassEnd className="text-5xl text-warning mx-auto mb-4" />
                            <h3 className="text-2xl font-semibold mb-2">No ended campaigns 🎉</h3>
                            <p className="text-gray-500">All approved campaigns are currently within their timeline.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {campaigns.map((campaign) => (
                            <div key={campaign.id} className="card bg-base-100 shadow-xl border border-warning/30">
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <span className="badge badge-warning badge-outline">Ended</span>
                                        <span className="text-xs text-gray-500">
                                            Created {new Date(campaign.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="card-title text-lg mt-2">{campaign.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4">By {campaign.charityName}</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Goal</span>
                                            <span className="font-semibold">৳{campaign.goalAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Raised</span>
                                            <span className="font-semibold text-success">৳{(campaign.currentAmount || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="flex items-center gap-1">
                                                <FaCalendarAlt /> Ended On
                                            </span>
                                            <span>{new Date(campaign.endDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="card-actions mt-4">
                                        <button className="btn btn-outline btn-warning w-full" onClick={() => openExtendModal(campaign)}>
                                            <FaRedoAlt />
                                            Extend timeline
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedCampaign && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-base-100 rounded-lg w-full max-w-md shadow-2xl">
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold">Extend Campaign</h3>
                                    <button className="btn btn-sm btn-ghost" onClick={closeModal}>
                                        ✕
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500">{selectedCampaign.title}</p>
                                <form className="space-y-4" onSubmit={handleExtend}>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">New end date</span>
                                        </label>
                                        <input
                                            type="date"
                                            min={new Date().toISOString().split('T')[0]}
                                            className="input input-bordered"
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

