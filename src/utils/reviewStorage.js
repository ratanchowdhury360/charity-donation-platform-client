// Review Storage Utility
// This uses API calls to persist review data

const API_BASE_URL = (import.meta.env && import.meta.env.VITE_API_URL) || 'https://charity-donation-platform-server.vercel.app';

const normalizeReview = (review) => {
    if (!review) return review;
    return {
        ...review,
        id: review.id || (review._id ? review._id.toString() : undefined),
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

// Get all reviews with optional filters
export const getAllReviews = async (params = {}) => {
    const response = await fetch(`${API_BASE_URL}/reviews${buildQueryString(params)}`);
    const data = await handleResponse(response);
    return data.map(normalizeReview);
};

// Get reviews by user
export const getReviewsByUser = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/reviews/user/${userId}`);
    const data = await handleResponse(response);
    return data.map(normalizeReview);
};

// Get single review by ID
export const getReviewById = async (reviewId) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`);
    const data = await handleResponse(response);
    return normalizeReview(data);
};

// Save review (create new)
export const saveReview = async (reviewData) => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
    });
    const data = await handleResponse(response);
    return normalizeReview(data);
};

// Update review
export const updateReview = async (reviewId, updates) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });
    const data = await handleResponse(response);
    return normalizeReview(data);
};

// Update review rating only
export const updateReviewRating = async (reviewId, rating) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/rating`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
    });
    const data = await handleResponse(response);
    return normalizeReview(data);
};

// Delete review
export const deleteReview = async (reviewId) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
    });
    await handleResponse(response);
    return true;
};

// Get average rating and statistics
export const getAverageRating = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/reviews/stats/average`);
        const data = await handleResponse(response);
        return parseFloat(data.averageRating) || 0;
    } catch (error) {
        console.error('Error getting average rating:', error);
        return 0;
    }
};

// Get review statistics
export const getReviewStats = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/reviews/stats/average`);
        const data = await handleResponse(response);
        return data;
    } catch (error) {
        console.error('Error getting review stats:', error);
        return {
            averageRating: 0,
            totalReviews: 0,
            ratingDistribution: {
                5: 0,
                4: 0,
                3: 0,
                2: 0,
                1: 0
            }
        };
    }
};
