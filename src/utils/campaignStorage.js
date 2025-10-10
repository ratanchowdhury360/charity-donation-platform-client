// Temporary storage utility for campaigns (until database is implemented)
// This uses localStorage to persist data across page refreshes

const STORAGE_KEY = 'charity_campaigns';

// Get all campaigns
export const getCampaigns = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading campaigns:', error);
        return [];
    }
};

// Get campaigns by status
export const getCampaignsByStatus = (status) => {
    const campaigns = getCampaigns();
    return campaigns.filter(campaign => campaign.status === status);
};

// Add a new campaign
export const addCampaign = (campaignData) => {
    try {
        const campaigns = getCampaigns();
        const newCampaign = {
            ...campaignData,
            id: `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        campaigns.push(newCampaign);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
        return newCampaign;
    } catch (error) {
        console.error('Error adding campaign:', error);
        throw error;
    }
};

// Update campaign status
export const updateCampaignStatus = (campaignId, status) => {
    try {
        const campaigns = getCampaigns();
        const updatedCampaigns = campaigns.map(campaign => 
            campaign.id === campaignId 
                ? { ...campaign, status, updatedAt: new Date().toISOString() }
                : campaign
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCampaigns));
        return true;
    } catch (error) {
        console.error('Error updating campaign status:', error);
        throw error;
    }
};

// Delete a campaign
export const deleteCampaign = (campaignId) => {
    try {
        const campaigns = getCampaigns();
        const filteredCampaigns = campaigns.filter(campaign => campaign.id !== campaignId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCampaigns));
        return true;
    } catch (error) {
        console.error('Error deleting campaign:', error);
        throw error;
    }
};

// Get campaigns by charity
export const getCampaignsByCharity = (charityId) => {
    const campaigns = getCampaigns();
    return campaigns.filter(campaign => campaign.charityId === charityId);
};

// Update campaign donation amount
export const addDonationToCampaign = (campaignId, donationAmount) => {
    try {
        const campaigns = getCampaigns();
        const updatedCampaigns = campaigns.map(campaign => {
            if (campaign.id === campaignId) {
                return {
                    ...campaign,
                    currentAmount: (campaign.currentAmount || 0) + donationAmount,
                    updatedAt: new Date().toISOString()
                };
            }
            return campaign;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCampaigns));
        return true;
    } catch (error) {
        console.error('Error adding donation to campaign:', error);
        throw error;
    }
};

// Clear all campaigns (for testing)
export const clearAllCampaigns = () => {
    localStorage.removeItem(STORAGE_KEY);
};
