/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaEnvelopeOpenText, FaPaperPlane } from 'react-icons/fa';
import { getMessages, replyToMessage, updateMessageStatus } from '../../utils/messageStorage';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [processing, setProcessing] = useState(false);

    const fetchMessages = useCallback(async () => {
        setLoading(true);
        const response = await getMessages({});
        setMessages(response);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText.trim() || !selectedMessage) return;

        setProcessing(true);
        const messageId = selectedMessage._id || selectedMessage.id;

        await replyToMessage(messageId, {
            reply: replyText,
            adminName: 'Platform Admin',
            adminId: 'admin',
            actorType: 'admin',
        });

        setReplyText('');
        setProcessing(false);
        fetchMessages();
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

                    {messages.map(msg => (
                        <button
                            key={msg.id}
                            onClick={() => setSelectedMessage(msg)}
                            className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/10 transition ${
                                selectedMessage?.id === msg.id ? 'bg-white/10' : ''
                            }`}
                        >
                            <p className="font-semibold text-white">{msg.senderName}</p>
                            <p className="text-xs text-gray-400 truncate">{msg.message}</p>
                        </button>
                    ))}
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
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {/* Original message */}
                                <div className="flex justify-start">
                                    <div className="bg-white/10 text-white p-3 rounded-2xl max-w-md">
                                        {selectedMessage.message}
                                    </div>
                                </div>

                                {/* Replies */}
                                {selectedMessage.replies?.map((reply, idx) => (
                                    <div
                                        key={idx}
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
                                            }`}
                                        >
                                            {reply.message}
                                        </div>
                                    </div>
                                ))}
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
                                />
                                <button
                                    className="btn btn-primary"
                                    disabled={processing}
                                >
                                    <FaPaperPlane />
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
