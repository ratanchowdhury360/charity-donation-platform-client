const API_BASE_URL = (import.meta.env && import.meta.env.VITE_API_URL) || 'https://charity-donation-platform-server.vercel.app';

const normalizeMessage = (message) => {
    if (!message) return message;
    return {
        ...message,
        id: message.id || (message._id ? message._id.toString() : undefined),
    };
};

const handleResponse = async (response) => {
    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Request failed');
    }
    return response.json();
};

const buildQueryString = (params = {}) => {
    const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '');
    if (!entries.length) return '';
    const searchParams = new URLSearchParams(entries);
    return `?${searchParams.toString()}`;
};

export const createMessage = async (payload) => {
    const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    const data = await handleResponse(response);
    return normalizeMessage(data);
};

export const getMessages = async (params = {}) => {
    const response = await fetch(`${API_BASE_URL}/messages${buildQueryString(params)}`);
    const data = await handleResponse(response);
    return data.map(normalizeMessage);
};

export const getUserMessages = async (userId) => {
    if (!userId) {
        return [];
    }
    const response = await fetch(`${API_BASE_URL}/messages/user/${userId}`);
    const data = await handleResponse(response);
    return data.map(normalizeMessage);
};

export const getMessageById = async (messageId) => {
    const response = await fetch(`${API_BASE_URL}/messages/${messageId}`);
    const data = await handleResponse(response);
    return normalizeMessage(data);
};

export const replyToMessage = async (messageId, replyPayload) => {
    const response = await fetch(`${API_BASE_URL}/messages/${messageId}/reply`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(replyPayload),
    });
    const data = await handleResponse(response);
    return normalizeMessage(data);
};

export const updateMessageStatus = async (messageId, status) => {
    const response = await fetch(`${API_BASE_URL}/messages/${messageId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });
    const data = await handleResponse(response);
    return normalizeMessage(data);
};

