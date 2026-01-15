const resolveApiBaseUrl = () => {
    // Prefer explicit env; otherwise default to deployed API base
    const envUrl = (import.meta.env && import.meta.env.VITE_API_URL) || '';
    const base = envUrl || 'https://charity-donation-platform-server.vercel.app';
    return base.replace(/\/$/, '');
};

const API_BASE_URL = resolveApiBaseUrl();

const normalizeCampaign = (campaign) => {
    if (!campaign) return campaign;
    return {
        ...campaign,
        id: campaign.id || (campaign._id ? campaign._id.toString() : undefined),
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

export const getCampaigns = async (params = {}) => {
    const response = await fetch(`${API_BASE_URL}/campaigns${buildQueryString(params)}`);
    const data = await handleResponse(response);
    return data.map(normalizeCampaign);
};

export const getCampaignsByStatus = async (status) => {
    return getCampaigns({ status });
};

export const getCampaignsByCharity = async (charityId) => {
    return getCampaigns({ charityId });
};

export const addCampaign = async (campaignData) => {
    const response = await fetch(`${API_BASE_URL}/campaigns`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignData),
    });
    const data = await handleResponse(response);
    return normalizeCampaign(data);
};

export const updateCampaign = async (campaignId, updates) => {
    const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });
    const data = await handleResponse(response);
    return normalizeCampaign(data);
};

export const updateCampaignStatus = async (campaignId, status) => {
    const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });
    const data = await handleResponse(response);
    return normalizeCampaign(data);
};

export const deleteCampaign = async (campaignId) => {
    const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}`, {
        method: 'DELETE',
    });
    await handleResponse(response);
    return true;
};

export const addDonationToCampaign = async (campaignId, donationAmount, donorIncrement = 1) => {
    const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/progress`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount: donationAmount,
            donorIncrement,
        }),
    });
    const data = await handleResponse(response);
    return normalizeCampaign(data);
};

export const clearAllCampaigns = async () => {
    return Promise.resolve();
};

// Check if a campaign is active (can accept donations)
export const isCampaignActive = (campaign) => {
    if (!campaign) return false;
    
    // Campaign must be approved
    if (campaign.status !== 'approved') return false;
    
    // Check if campaign is completed (reached goal)
    const isCompleted = (campaign.currentAmount || 0) >= campaign.goalAmount;
    if (isCompleted) return false;
    
    // Check if campaign has ended (end date passed)
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const endDate = new Date(campaign.endDate);
    endDate.setHours(23, 59, 59, 999);
    const isEnded = endDate < now;
    if (isEnded) return false;
    
    return true;
};

