const API_BASE_URL = (import.meta.env && import.meta.env.VITE_API_URL) || 'https://charity-donation-platform-server.vercel.app';

const normalizeMessage = (message) => {
    if (!message) return message;
    // Preserve both id and _id for compatibility
    const normalized = {
        ...message,
        id: message.id || (message._id ? message._id.toString() : undefined),
    };
    // Keep _id if it exists (for MongoDB compatibility)
    if (message._id && !normalized._id) {
        normalized._id = message._id.toString();
    }
    return normalized;
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
    // Ensure we have a valid messageId
    if (!messageId) {
        throw new Error('Message ID is required');
    }
    
    // Try the messageId as-is first, then try _id if it exists
    let url = `${API_BASE_URL}/messages/${messageId}/reply`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(replyPayload),
    });
    
    // Check if response is ok (status 200-299)
    if (response.ok) {
        try {
            const data = await response.json();
            return normalizeMessage(data);
        } catch (parseError) {
            // If JSON parsing fails but status is OK, still consider it success
            console.warn('Response parsing warning:', parseError);
            // Return a success indicator even if we can't parse the response
            return { success: true, messageId };
        }
    } else {
        // Only throw error if response is not OK
        let errorText;
        try {
            const errorData = await response.json();
            errorText = errorData.message || JSON.stringify(errorData);
        } catch {
            errorText = await response.text();
        }
        throw new Error(errorText || `Server returned status ${response.status}`);
    }
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

