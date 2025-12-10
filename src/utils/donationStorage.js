// Donation storage utility for tracking user donations
// This uses API calls to persist donation data

const API_BASE_URL = (import.meta.env && import.meta.env.VITE_API_URL) || 'https://charity-donation-platform-server.vercel.app';

const normalizeDonation = (donation) => {
    if (!donation) return donation;
    return {
        ...donation,
        id: donation.id || (donation._id ? donation._id.toString() : undefined),
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

// Get all donations with optional filters
export const getAllDonations = async (params = {}) => {
    const response = await fetch(`${API_BASE_URL}/donations${buildQueryString(params)}`);
    const data = await handleResponse(response);
    return data.map(normalizeDonation);
};

// Get donations by user
export const getDonationsByUser = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/donations/donor/${userId}`);
    const data = await handleResponse(response);
    return data.map(normalizeDonation);
};

// Get donations by campaign
export const getDonationsByCampaign = async (campaignId) => {
    const response = await fetch(`${API_BASE_URL}/donations/campaign/${campaignId}`);
    const data = await handleResponse(response);
    return data.map(normalizeDonation);
};

// Get donations by charity
export const getDonationsByCharity = async (charityId) => {
    const response = await fetch(`${API_BASE_URL}/donations/charity/${charityId}`);
    const data = await handleResponse(response);
    return data.map(normalizeDonation);
};

// Get single donation by ID
export const getDonationById = async (donationId) => {
    const response = await fetch(`${API_BASE_URL}/donations/${donationId}`);
    const data = await handleResponse(response);
    return normalizeDonation(data);
};

// Add a new donation
export const addDonation = async (donationData) => {
    const response = await fetch(`${API_BASE_URL}/donations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
    });
    const data = await handleResponse(response);
    return normalizeDonation(data);
};

// Update donation
export const updateDonation = async (donationId, updates) => {
    const response = await fetch(`${API_BASE_URL}/donations/${donationId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });
    const data = await handleResponse(response);
    return normalizeDonation(data);
};

// Update donation status
export const updateDonationStatus = async (donationId, status) => {
    const response = await fetch(`${API_BASE_URL}/donations/${donationId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });
    const data = await handleResponse(response);
    return normalizeDonation(data);
};

// Delete donation
export const deleteDonation = async (donationId) => {
    const response = await fetch(`${API_BASE_URL}/donations/${donationId}`, {
        method: 'DELETE',
    });
    await handleResponse(response);
    return true;
};

// Get user donation statistics
export const getUserDonationStats = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/donations/donor/${userId}/stats`);
    const data = await handleResponse(response);
    return data;
};

// Get campaign donation statistics
export const getCampaignDonationStats = async (campaignId) => {
    const response = await fetch(`${API_BASE_URL}/donations/campaign/${campaignId}/stats`);
    const data = await handleResponse(response);
    return data;
};

// Get unique donor count for a campaign
export const getUniqueDonorCount = async (campaignId) => {
    const stats = await getCampaignDonationStats(campaignId);
    return stats.donorCount || 0;
};

// Get all unique donor counts for all campaigns (helper function)
export const getAllCampaignDonorCounts = async () => {
    try {
        const allDonations = await getAllDonations();
        const donorCounts = {};
        
        allDonations.forEach(donation => {
            if (!donorCounts[donation.campaignId]) {
                donorCounts[donation.campaignId] = new Set();
            }
            donorCounts[donation.campaignId].add(donation.donorId);
        });
        
        // Convert Sets to counts
        const counts = {};
        Object.keys(donorCounts).forEach(campaignId => {
            counts[campaignId] = donorCounts[campaignId].size;
        });
        
        return counts;
    } catch (error) {
        console.error('Error getting all campaign donor counts:', error);
        return {};
    }
};

// Clear all donations (for testing/admin purposes - not recommended for production)
export const clearAllDonations = async () => {
    // Note: This would require a bulk delete endpoint on the server
    // For now, this is a placeholder
    console.warn('clearAllDonations is not implemented via API');
    return Promise.resolve();
};
