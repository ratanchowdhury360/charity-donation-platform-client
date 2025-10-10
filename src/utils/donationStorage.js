// Donation storage utility for tracking user donations
// This uses localStorage to persist donation data

const STORAGE_KEY = 'user_donations';

// Get all donations
export const getAllDonations = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading donations:', error);
        return [];
    }
};

// Get donations by user
export const getDonationsByUser = (userId) => {
    const donations = getAllDonations();
    return donations.filter(donation => donation.userId === userId);
};

// Add a new donation
export const addDonation = (donationData) => {
    try {
        const donations = getAllDonations();
        const newDonation = {
            ...donationData,
            id: `donation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            status: 'completed'
        };
        donations.push(newDonation);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(donations));
        return newDonation;
    } catch (error) {
        console.error('Error adding donation:', error);
        throw error;
    }
};

// Get user donation statistics
export const getUserDonationStats = (userId) => {
    const userDonations = getDonationsByUser(userId);
    
    // Calculate total donated
    const totalDonated = userDonations.reduce((sum, d) => sum + d.amount, 0);
    
    // Count unique campaigns supported
    const uniqueCampaigns = new Set(userDonations.map(d => d.campaignId));
    const campaignsSupported = uniqueCampaigns.size;
    
    // Calculate impact (1 person per 1000 BDT)
    const impact = Math.floor(totalDonated / 1000);
    
    // Calculate this month's donations
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const thisMonthDonations = userDonations.reduce((sum, donation) => {
        const donationDate = new Date(donation.createdAt);
        if (donationDate.getMonth() === currentMonth && donationDate.getFullYear() === currentYear) {
            return sum + donation.amount;
        }
        return sum;
    }, 0);
    
    return {
        totalDonated,
        campaignsSupported,
        impact,
        thisMonth: thisMonthDonations,
        donationCount: userDonations.length
    };
};

// Get donations by campaign
export const getDonationsByCampaign = (campaignId) => {
    const donations = getAllDonations();
    return donations.filter(donation => donation.campaignId === campaignId);
};

// Get unique donor count for a campaign
export const getUniqueDonorCount = (campaignId) => {
    const campaignDonations = getDonationsByCampaign(campaignId);
    const uniqueDonors = new Set(campaignDonations.map(d => d.userId));
    return uniqueDonors.size;
};

// Get all unique donor counts for all campaigns
export const getAllCampaignDonorCounts = () => {
    const donations = getAllDonations();
    const donorCounts = {};
    
    donations.forEach(donation => {
        if (!donorCounts[donation.campaignId]) {
            donorCounts[donation.campaignId] = new Set();
        }
        donorCounts[donation.campaignId].add(donation.userId);
    });
    
    // Convert Sets to counts
    const counts = {};
    Object.keys(donorCounts).forEach(campaignId => {
        counts[campaignId] = donorCounts[campaignId].size;
    });
    
    return counts;
};

// Clear all donations (for testing)
export const clearAllDonations = () => {
    localStorage.removeItem(STORAGE_KEY);
};
