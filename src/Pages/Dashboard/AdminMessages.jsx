/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaEnvelopeOpenText, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { getMessages, replyToMessage, updateMessageStatus } from '../../utils/messageStorage';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [processing, setProcessing] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // Auto-scroll to bottom when new messages are added
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (selectedMessage?.replies?.length) {
            scrollToBottom();
        }
    }, [selectedMessage?.replies?.length]);

    const fetchMessages = useCallback(async (showErrorAlert = false) => {
        setLoading(true);
        try {
            const response = await getMessages({});
            setMessages(response);
            
            // Update selected message if it exists
            if (selectedMessage) {
                const updatedMessage = response.find(
                    msg => (msg.id === selectedMessage.id) || (msg._id === selectedMessage._id)
                );
                if (updatedMessage) {
                    setSelectedMessage(updatedMessage);
                }
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            // Show warning if fetch fails and we want to show alert
            if (showErrorAlert) {
                const swal = typeof window !== 'undefined' ? window.Swal : null;
                if (swal) {
                    swal.fire({
                        icon: 'warning',
                        title: 'Failed to Load Messages',
                        html: 'Could not load messages. Please <strong>reload the browser</strong> to refresh.',
                        confirmButtonText: 'Reload Page',
                        confirmButtonColor: '#3b82f6',
                        showCancelButton: true,
                        cancelButtonText: 'Cancel',
                        cancelButtonColor: '#6b7280'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                }
            }
        } finally {
            setLoading(false);
        }
    }, [selectedMessage]);

    useEffect(() => {
        const loadMessages = async () => {
            setLoading(true);
            try {
                const response = await getMessages({});
                setMessages(response);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
                // Show warning if initial fetch fails
                const swal = typeof window !== 'undefined' ? window.Swal : null;
                if (swal) {
                    swal.fire({
                        icon: 'warning',
                        title: 'Failed to Load Messages',
                        html: 'Could not load messages. Please <strong>reload the browser</strong> to refresh.',
                        confirmButtonText: 'Reload Page',
                        confirmButtonColor: '#3b82f6',
                        showCancelButton: true,
                        cancelButtonText: 'Cancel',
                        cancelButtonColor: '#6b7280'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                }
            } finally {
                setLoading(false);
            }
        };
        loadMessages();
    }, []);

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText.trim() || !selectedMessage || processing) return;

        const messageId = selectedMessage._id || selectedMessage.id;
        const replyTextToSend = replyText.trim();
        
        // Create optimistic reply
        const optimisticReply = {
            message: replyTextToSend,
            actorType: 'admin',
            adminName: 'Platform Admin',
            adminId: 'admin',
            createdAt: new Date().toISOString(),
            _temp: true // Mark as temporary
        };

        // Optimistic update - add reply immediately to UI
        setSelectedMessage(prev => ({
            ...prev,
            replies: [...(prev.replies || []), optimisticReply]
        }));

        // Update messages list optimistically
        setMessages(prevMessages => 
            prevMessages.map(msg => {
                if ((msg.id === selectedMessage.id) || (msg._id === selectedMessage._id)) {
                    return {
                        ...msg,
                        replies: [...(msg.replies || []), optimisticReply]
                    };
                }
                return msg;
            })
        );

        // Clear input immediately
        setReplyText('');
        setProcessing(true);

        try {
            // Send reply to server
            const result = await replyToMessage(messageId, {
                reply: replyTextToSend,
                adminName: 'Platform Admin',
                adminId: 'admin',
                actorType: 'admin',
            });

            // Refresh messages to get the actual reply from server
            // This ensures we have the correct ID and timestamp
            await fetchMessages(false);
        } catch (error) {
            console.error('Failed to send reply:', error);
            
            // Revert optimistic update on error
            setSelectedMessage(prev => ({
                ...prev,
                replies: prev.replies?.filter(reply => !reply._temp) || []
            }));

            setMessages(prevMessages => 
                prevMessages.map(msg => {
                    if ((msg.id === selectedMessage.id) || (msg._id === selectedMessage._id)) {
                        return {
                            ...msg,
                            replies: msg.replies?.filter(reply => !reply._temp) || []
                        };
                    }
                    return msg;
                })
            );

            // Restore reply text so user can try again
            setReplyText(replyTextToSend);
            
            // Show error alert with reload suggestion
            const swal = typeof window !== 'undefined' ? window.Swal : null;
            if (swal) {
                swal.fire({
                    icon: 'warning',
                    title: 'Sending May Have Failed',
                    html: 'There was an issue sending your reply. The message may have been sent successfully.<br/><br/>Please <strong>reload the browser</strong> to check if your message was sent.',
                    confirmButtonText: 'Reload Page',
                    confirmButtonColor: '#3b82f6',
                    showCancelButton: true,
                    cancelButtonText: 'Cancel',
                    cancelButtonColor: '#6b7280'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Admin Messages</title>
            </Helmet>

            <div className="h-[calc(100vh-120px)] bg-black/70 backdrop-blur rounded-3xl overflow-hidden flex">

                {/* LEFT: Conversation List */}
                <div className="w-full max-w-sm border-r border-white/10 overflow-y-auto">
                    <div className="p-4 border-b border-white/10 flex items-center gap-2 text-white">
                        <FaEnvelopeOpenText />
                        <h2 className="font-bold">Messages</h2>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center p-8">
                            <FaSpinner className="animate-spin text-2xl text-white" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                            <p>No messages yet</p>
                        </div>
                    ) : (
                        messages.map(msg => (
                            <button
                                key={msg.id || msg._id}
                                onClick={() => setSelectedMessage(msg)}
                                className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/10 transition ${
                                    (selectedMessage?.id === msg.id || selectedMessage?._id === msg._id) 
                                        ? 'bg-white/10' 
                                        : ''
                                }`}
                            >
                                <p className="font-semibold text-white">{msg.senderName}</p>
                                <p className="text-xs text-gray-400 truncate">{msg.message}</p>
                                {msg.replies && msg.replies.length > 0 && (
                                    <p className="text-xs text-blue-400 mt-1">
                                        {msg.replies.length} {msg.replies.length === 1 ? 'reply' : 'replies'}
                                    </p>
                                )}
                            </button>
                        ))
                    )}
                </div>

                {/* RIGHT: Chat Window */}
                <div className="flex-1 flex flex-col">

                    {!selectedMessage ? (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            Select a conversation
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="p-4 border-b border-white/10">
                                <h3 className="font-semibold text-white">
                                    {selectedMessage.senderName}
                                </h3>
                                <p className="text-xs text-gray-400">
                                    {selectedMessage.senderEmail}
                                </p>
                            </div>

                            {/* Messages */}
                            <div 
                                ref={messagesContainerRef}
                                className="flex-1 overflow-y-auto p-4 space-y-3"
                            >
                                {/* Original message */}
                                <div className="flex justify-start">
                                    <div className="bg-white/10 text-white p-3 rounded-2xl max-w-md">
                                        <p className="whitespace-pre-line">{selectedMessage.message}</p>
                                        {selectedMessage.subject && (
                                            <p className="text-xs text-gray-400 mt-2">
                                                Subject: {selectedMessage.subject}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Replies */}
                                {selectedMessage.replies?.map((reply, idx) => (
                                    <div
                                        key={reply._id || reply.id || `reply-${idx}`}
                                        className={`flex ${
                                            reply.actorType === 'admin'
                                                ? 'justify-end'
                                                : 'justify-start'
                                        }`}
                                    >
                                        <div
                                            className={`p-3 rounded-2xl max-w-md text-sm ${
                                                reply.actorType === 'admin'
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-white/10 text-white'
                                            } ${reply._temp ? 'opacity-70' : ''}`}
                                        >
                                            <p className="whitespace-pre-line">{reply.message || reply.reply}</p>
                                            {reply.createdAt && !reply._temp && (
                                                <p className="text-xs opacity-75 mt-1">
                                                    {new Date(reply.createdAt).toLocaleString()}
                                                </p>
                                            )}
                                            {reply._temp && (
                                                <p className="text-xs opacity-75 mt-1 italic flex items-center gap-1">
                                                    <FaSpinner className="animate-spin" />
                                                    Sending...
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <form
                                onSubmit={handleReplySubmit}
                                className="p-4 border-t border-white/10 flex gap-2"
                            >
                                <input
                                    type="text"
                                    className="input bg-black/60 border border-white/20 text-white flex-1"
                                    placeholder="Type a message…"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    disabled={processing}
                                />
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={processing || !replyText.trim()}
                                >
                                    {processing ? (
                                        <FaSpinner className="animate-spin" />
                                    ) : (
                                        <FaPaperPlane />
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminMessages;
