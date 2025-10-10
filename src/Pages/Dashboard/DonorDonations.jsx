import React from 'react';
import { useAuth } from '../../provider/authProvider';
import { mockDonations, mockCampaigns } from '../../data/mockData';
import { FaDonate, FaCalendarAlt, FaReceipt } from 'react-icons/fa';

export default function DonorDonations() {
    const { currentUser } = useAuth();
    
    // Get donations for the current user
    const userDonations = mockDonations.filter(
        donation => donation.donorId === currentUser?.id
    );

    // Calculate total donations
    const totalDonated = userDonations.reduce(
        (sum, donation) => sum + donation.amount, 0
    );

    // Get campaign details for each donation
    const donationsWithCampaigns = userDonations.map(donation => ({
        ...donation,
        campaign: mockCampaigns.find(c => c.id === donation.campaignId)
    }));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">My Donations</h1>
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <FaDonate className="text-2xl" />
                        </div>
                        <div className="stat-title">Total Donated</div>
                        <div className="stat-value text-primary">
                            {totalDonated.toLocaleString()} BDT
                        </div>
                        <div className="stat-desc">
                            {userDonations.length} {userDonations.length === 1 ? 'donation' : 'donations'}
                        </div>
                    </div>
                </div>
            </div>

            {donationsWithCampaigns.length > 0 ? (
                <div className="space-y-4">
                    {donationsWithCampaigns.map((donation) => (
                        <div key={donation.id} className="card bg-base-100 shadow-lg">
                            <div className="card-body">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="card-title">
                                            {donation.campaign?.title || 'Campaign'}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                            <FaCalendarAlt />
                                            <span>Donated on {new Date(donation.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="mt-2">
                                            <span className="badge badge-primary">
                                                {donation.campaign?.category || 'General'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-primary">
                                            {donation.amount.toLocaleString()} BDT
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            via {donation.paymentMethod}
                                        </div>
                                        <div className="badge badge-success gap-2 mt-2">
                                            {donation.status}
                                        </div>
                                    </div>
                                </div>
                                {donation.transactionId && (
                                    <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm text-gray-500">
                                        <FaReceipt />
                                        <span>Transaction ID: {donation.transactionId}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body text-center py-12">
                        <div className="flex justify-center mb-4">
                            <FaDonate className="text-6xl text-gray-300" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">No Donations Yet</h3>
                        <p className="text-gray-500 mb-6">
                            You haven't made any donations yet. Explore campaigns to make your first donation!
                        </p>
                        <button className="btn btn-primary">
                            Explore Campaigns
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
