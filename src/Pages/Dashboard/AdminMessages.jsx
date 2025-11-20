import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaEnvelopeOpenText, FaInbox, FaFilter, FaReply, FaPaperPlane } from 'react-icons/fa';
import { getMessages, replyToMessage, updateMessageStatus } from '../../utils/messageStorage';

const statusTabs = [
    { key: 'all', label: 'All' },
    { key: 'open', label: 'Open' },
    { key: 'responded', label: 'Responded' },
    { key: 'closed', label: 'Closed' },
];

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('open');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [feedback, setFeedback] = useState({ type: '', text: '' });
    const [processing, setProcessing] = useState(false);

    const fetchMessages = useCallback(async () => {
        try {
            setLoading(true);
            const params = statusFilter === 'all' ? {} : { status: statusFilter };
            const response = await getMessages(params);
            setMessages(response);
            setFeedback({ type: '', text: '' });
        } catch (error) {
            console.error('Failed to load messages', error);
            setFeedback({ type: 'error', text: 'Unable to load messages. Please try again.' });
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const openReplyModal = (message) => {
        setSelectedMessage(message);
        setReplyText('');
    };

    const closeModal = () => {
        setSelectedMessage(null);
        setReplyText('');
        setProcessing(false);
    };

    const handleReplySubmit = async (event) => {
        event.preventDefault();
        if (!selectedMessage || !replyText.trim()) return;
        try {
            setProcessing(true);
            await replyToMessage(selectedMessage.id, {
                reply: replyText.trim(),
                adminName: 'Platform Admin',
                adminId: 'admin',
                actorType: 'admin',
            });
            setFeedback({ type: 'success', text: 'Reply sent successfully.' });
            closeModal();
            fetchMessages();
        } catch (error) {
            console.error('Failed to send reply', error);
            setFeedback({ type: 'error', text: 'Failed to send reply. Please try again.' });
            setProcessing(false);
        }
    };

    const handleStatusChange = async (messageId, status) => {
        try {
            await updateMessageStatus(messageId, status);
            fetchMessages();
        } catch (error) {
            console.error('Failed to update message status', error);
            setFeedback({ type: 'error', text: 'Could not update message status.' });
        }
    };

    return (
        <>
            <Helmet>
                <title>Message Center - Admin</title>
            </Helmet>

            <div className="space-y-6">
                <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-6 shadow-xl flex flex-col gap-2">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <FaEnvelopeOpenText />
                        Message Center
                    </h1>
                    <p className="text-white/80">
                        All contact form submissions are logged here. Reply to donors and charities directly—responses appear inside their
                        dashboards instantly.
                    </p>
                </div>

                <div className="card bg-base-100 shadow-md">
                    <div className="card-body">
                        <div className="flex items-center gap-3 mb-4">
                            <FaFilter className="text-primary" />
                            <h2 className="card-title mb-0">Filter by status</h2>
                        </div>
                        <div className="tabs tabs-boxed w-fit">
                            {statusTabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    className={`tab ${statusFilter === tab.key ? 'tab-active' : ''}`}
                                    onClick={() => setStatusFilter(tab.key)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {feedback.text && (
                    <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                        {feedback.text}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-20">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body text-center py-16">
                            <FaInbox className="text-5xl text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No messages in this view</h3>
                            <p className="text-gray-500">Try switching the filter to see other conversations.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {messages.map((message) => (
                            <div key={message.id} className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                {message.subject} • {new Date(message.createdAt).toLocaleString()}
                                            </p>
                                            <h3 className="text-lg font-semibold">{message.senderName}</h3>
                                            <p className="text-xs text-gray-500">{message.senderEmail}</p>
                                        </div>
                                        <span
                                            className={`badge ${
                                                message.status === 'closed'
                                                    ? 'badge-ghost'
                                                    : message.status === 'responded'
                                                        ? 'badge-success'
                                                        : 'badge-warning'
                                            }`}
                                        >
                                            {message.status}
                                        </span>
                                    </div>
                                    <p className="mt-4 text-gray-700">{message.message}</p>

                                    {message.replies?.length > 0 && (
                                        <div className="mt-4 p-3 rounded-lg bg-base-200 space-y-2 max-h-48 overflow-y-auto">
                                            {message.replies.map((reply, idx) => (
                                                <div key={idx}>
                                                    <p className="text-sm font-semibold text-primary">
                                                        Admin • {new Date(reply.createdAt).toLocaleString()}
                                                    </p>
                                                    <p className="text-sm text-gray-700">{reply.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="card-actions mt-4 flex-col gap-2">
                                        <div className="flex gap-2">
                                            <button
                                                className="btn btn-primary btn-sm flex-1"
                                                onClick={() => openReplyModal(message)}
                                                disabled={!message.canReply}
                                            >
                                                <FaReply />
                                                Reply
                                            </button>
                                            {message.status !== 'closed' && (
                                                <button
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => handleStatusChange(message.id, 'closed')}
                                                >
                                                    Close
                                                </button>
                                            )}
                                        </div>
                                        {!message.canReply && (
                                            <p className="text-xs text-warning text-center">
                                                Guest message — replies not available.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedMessage && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-base-100 rounded-lg w-full max-w-xl shadow-2xl">
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold">Reply to {selectedMessage.senderName}</h3>
                                    <button className="btn btn-sm btn-ghost" onClick={closeModal}>
                                        ✕
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500">{selectedMessage.subject}</p>
                                <p className="p-3 bg-base-200 rounded text-sm">{selectedMessage.message}</p>
                                <form className="space-y-4" onSubmit={handleReplySubmit}>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Your reply</span>
                                        </label>
                                        <textarea
                                            className="textarea textarea-bordered h-32"
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button className="btn btn-primary w-full" disabled={processing}>
                                        {processing ? (
                                            <>
                                                <span className="loading loading-spinner"></span>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <FaPaperPlane />
                                                Send Reply
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

export default AdminMessages;

