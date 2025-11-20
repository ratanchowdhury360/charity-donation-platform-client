import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane, FaInfoCircle, FaCommentDots } from 'react-icons/fa';
import { useAuth } from '../../provider/authProvider';
import { createMessage, getUserMessages, replyToMessage } from '../../utils/messageStorage';

const subjectOptions = [
    'General Inquiry',
    'Donation Support',
    'Charity Registration',
    'Technical Issue',
    'Partnership Opportunity',
];

const Contact = () => {
    const { currentUser, userRole } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: subjectOptions[0],
        message: '',
        wantsReply: false,
    });
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', text: '' });
    const [threads, setThreads] = useState([]);
    const [threadLoading, setThreadLoading] = useState(false);
    const [replyDrafts, setReplyDrafts] = useState({});
    const [replySubmitting, setReplySubmitting] = useState({});

    useEffect(() => {
        if (currentUser) {
            setFormData((prev) => ({
                ...prev,
                name: currentUser.displayName || prev.name,
                email: currentUser.email || prev.email,
                wantsReply: true,
            }));
        }
    }, [currentUser]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFeedback({ type: '', text: '' });
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const loadThreads = useCallback(async () => {
        if (!currentUser) {
            setThreads([]);
            return;
        }
        try {
            setThreadLoading(true);
            const userThreads = await getUserMessages(currentUser.uid);
            setThreads(userThreads);
        } catch (error) {
            console.error('Failed to load user messages', error);
        } finally {
            setThreadLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        loadThreads();
    }, [loadThreads]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            setFeedback({ type: 'error', text: 'Please complete every required field.' });
            return;
        }

        setSubmitting(true);
        try {
            await createMessage({
                senderName: formData.name.trim(),
                senderEmail: formData.email.trim(),
                subject: formData.subject,
                message: formData.message.trim(),
                userId: currentUser?.uid || null,
                userRole: userRole || 'guest',
                wantsReply: Boolean(formData.wantsReply && currentUser),
            });
            setFeedback({ type: 'success', text: 'Your message has been delivered to the admin team.' });
            setFormData((prev) => ({
                ...prev,
                message: '',
                wantsReply: Boolean(currentUser),
            }));
            loadThreads();
        } catch (error) {
            console.error('Failed to send message', error);
            setFeedback({ type: 'error', text: 'We could not send your message. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleThreadDraftChange = (messageId, value) => {
        setReplyDrafts((prev) => ({
            ...prev,
            [messageId]: value,
        }));
    };

    const handleThreadReply = async (messageId) => {
        const draft = replyDrafts[messageId];
        if (!currentUser || !draft || !draft.trim()) {
            setFeedback({ type: 'error', text: 'Please enter a reply before sending.' });
            return;
        }

        setReplySubmitting((prev) => ({ ...prev, [messageId]: true }));
        setFeedback({ type: '', text: '' });
        try {
            await replyToMessage(messageId, {
                reply: draft.trim(),
                actorType: 'user',
                userId: currentUser.uid,
                userName: currentUser.displayName || currentUser.email || 'You',
            });
            setReplyDrafts((prev) => ({ ...prev, [messageId]: '' }));
            loadThreads();
            setFeedback({ type: 'success', text: 'Reply sent successfully.' });
        } catch (error) {
            console.error('Failed to send thread reply', error);
            setFeedback({ type: 'error', text: 'Failed to send reply. Please try again.' });
        } finally {
            setReplySubmitting((prev) => ({ ...prev, [messageId]: false }));
        }
    };

    const renderConversation = (thread) => {
        const history = [
            {
                message: thread.message,
                actorType: thread.userId ? 'user' : 'guest',
                actorName: thread.senderName,
                createdAt: thread.createdAt,
            },
            ...(thread.replies || []),
        ];

        return history.map((entry, idx) => {
            const label =
                entry.actorType === 'admin'
                    ? entry.actorName || 'Admin'
                    : entry.actorType === 'user'
                        ? 'You'
                        : entry.actorName || 'Guest';
            return (
                <div
                    key={`${thread.id}-reply-${idx}`}
                    className={`rounded-lg p-3 text-sm ${
                        entry.actorType === 'admin' ? 'bg-primary/10 border border-primary/30' : 'bg-base-200'
                    }`}
                >
                    <p className="font-semibold text-xs text-gray-600 mb-1">
                        {label} • {new Date(entry.createdAt).toLocaleString()}
                    </p>
                    <p className="text-gray-700 whitespace-pre-line">{entry.message}</p>
                </div>
            );
        });
    };

    return (
        <>
            <Helmet>
                <title>Contact Us - Charity Donation Platform</title>
                <meta
                    name="description"
                    content="Get in touch with our team. We're here to help with any questions about donations, charity registration, or platform features."
                />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-b from-base-200 via-base-100 to-base-200 pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="badge badge-primary badge-lg mb-4">We usually reply in under 24 hours</p>
                        <h1 className="text-4xl md:text-5xl font-black mb-3">Let's build impact together</h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Whether you're a donor, charity partner, or supporter, our team is here to help you keep campaigns healthy
                            and communities supported.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-10">
                        <div className="card bg-base-100 shadow-xl border border-base-200">
                            <div className="card-body">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <FaCommentDots className="text-xl" />
                                    </div>
                                    <div>
                                        <h2 className="card-title mb-0">Send us a message</h2>
                                        <p className="text-sm text-gray-500">We'll respond as quickly as possible</p>
                                    </div>
                                </div>

                                {!currentUser && (
                                    <div className="alert alert-warning mb-4">
                                        <FaInfoCircle className="text-xl" />
                                        <div>
                                            <p className="font-semibold">Want a reply from admin?</p>
                                            <p className="text-sm">
                                                Please log in first. Guests can still contact us, but replies are only sent to registered users.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {feedback.text && (
                                    <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-error'} mb-4`}>
                                        {feedback.text}
                                    </div>
                                )}

                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Name</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Your full name"
                                                className="input input-bordered focus:input-primary"
                                                required
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Email</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="you@email.com"
                                                className="input input-bordered focus:input-primary"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Subject</span>
                                        </label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="select select-bordered focus:select-primary"
                                        >
                                            {subjectOptions.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Message</span>
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="textarea textarea-bordered h-32 focus:textarea-primary"
                                            placeholder="Share how we can support you..."
                                            required
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label cursor-pointer justify-start gap-3">
                                            <input
                                                type="checkbox"
                                                name="wantsReply"
                                                className="checkbox checkbox-primary"
                                                checked={Boolean(formData.wantsReply && currentUser)}
                                                disabled={!currentUser}
                                                onChange={handleChange}
                                            />
                                            <span className="label-text">
                                                I'd like the admin team to follow up with me via my dashboard inbox
                                            </span>
                                        </label>
                                        {!currentUser && (
                                            <p className="text-xs text-error mt-1">Login required to receive replies.</p>
                                        )}
                                    </div>

                                    <button className="btn btn-primary w-full" disabled={submitting}>
                                        {submitting ? (
                                            <>
                                                <span className="loading loading-spinner"></span>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <FaPaperPlane />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="card bg-gradient-to-br from-primary to-primary/80 text-white shadow-xl">
                                    <div className="card-body">
                                        <FaPhone className="text-3xl opacity-80" />
                                        <p className="uppercase text-xs tracking-wide mt-4 opacity-80">Hotline</p>
                                        <h3 className="text-2xl font-bold">+880 1700-000000</h3>
                                        <p className="text-sm opacity-80">24/7 emergency support</p>
                                    </div>
                                </div>
                                <div className="card bg-gradient-to-br from-secondary to-secondary/80 text-white shadow-xl">
                                    <div className="card-body">
                                        <FaEnvelope className="text-3xl opacity-80" />
                                        <p className="uppercase text-xs tracking-wide mt-4 opacity-80">Email</p>
                                        <h3 className="text-xl font-semibold break-all">support@charitydonation.bd</h3>
                                        <p className="text-sm opacity-80">We reply within one business day</p>
                                    </div>
                                </div>
                            </div>

                            <div className="card bg-base-100 shadow-xl border border-base-200">
                                <div className="card-body space-y-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center">
                                            <FaMapMarkerAlt className="text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Visit our hub</h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                Charity Donation Platform<br />
                                                Gulshan-1, Dhaka 1212<br />
                                                Bangladesh
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center">
                                            <FaClock className="text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Support hours</h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                Sunday - Thursday: 9:00 AM - 8:00 PM
                                                <br />
                                                Friday - Saturday: 10:00 AM - 6:00 PM
                                                <br />
                                                <span className="text-primary text-sm">Emergency response available 24/7</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h3 className="card-title mb-2">Support policy</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        All contact messages instantly reach the admin dashboard. Replies appear inside your donor or charity
                                        dashboard inbox as soon as an admin responds.
                                    </p>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <FaInfoCircle className="mt-1 text-primary" />
                                            <span>Log in before sending a message if you expect a reply.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <FaInfoCircle className="mt-1 text-primary" />
                                            <span>Urgent donation or compliance issues automatically get priority handling.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <FaInfoCircle className="mt-1 text-primary" />
                                            <span>We keep a full history of all conversations for transparency.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {currentUser && (
                        <div id="inbox" className="card bg-base-100 shadow-xl border border-base-200 mt-12">
                            <div className="card-body">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                                    <div>
                                        <h2 className="card-title mb-1">Your Support Inbox</h2>
                                        <p className="text-sm text-gray-500">
                                            Continue the conversation with our admin team. Every reply stays in this thread.
                                        </p>
                                    </div>
                                </div>

                                {threadLoading ? (
                                    <div className="flex justify-center py-10">
                                        <span className="loading loading-spinner text-primary"></span>
                                    </div>
                                ) : threads.length === 0 ? (
                                    <div className="text-center py-10 text-gray-500">
                                        No previous messages yet. Use the form above to start a new conversation.
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {threads.map((thread) => (
                                            <div key={thread.id} className="border border-base-200 rounded-lg p-4">
                                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                                                    <div>
                                                        <p className="text-xs uppercase tracking-wide text-gray-500">{thread.status}</p>
                                                        <h3 className="text-lg font-semibold">{thread.subject}</h3>
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        Updated {new Date(thread.updatedAt || thread.createdAt).toLocaleString()}
                                                    </span>
                                                </div>

                                                <div className="space-y-3">{renderConversation(thread)}</div>

                                                {thread.canReply ? (
                                                    <div className="mt-4">
                                                        <label className="label">
                                                            <span className="label-text text-sm font-semibold">Reply to this thread</span>
                                                        </label>
                                                        <textarea
                                                            className="textarea textarea-bordered w-full h-24"
                                                            placeholder="Write your reply..."
                                                            value={replyDrafts[thread.id] || ''}
                                                            onChange={(e) => handleThreadDraftChange(thread.id, e.target.value)}
                                                        ></textarea>
                                                        <button
                                                            className="btn btn-primary btn-sm mt-2"
                                                            type="button"
                                                            disabled={replySubmitting[thread.id]}
                                                            onClick={() => handleThreadReply(thread.id)}
                                                        >
                                                            {replySubmitting[thread.id] ? (
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
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-warning mt-3">
                                                        This conversation started without an account. Please use the contact form above to open a
                                                        new, reply-enabled thread.
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Contact;
