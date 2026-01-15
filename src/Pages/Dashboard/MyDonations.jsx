import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../provider/authProvider';
import { getDonationsByUser } from '../../utils/donationStorage';
import { getCampaigns } from '../../utils/campaignStorage';
import { 
    FaHeart, 
    FaCalendarAlt, 
    FaMoneyBillWave, 
    FaEye,
    FaChartLine,
    FaHandHoldingHeart,
    FaCreditCard,
    FaChevronDown,
    FaChevronUp
} from 'react-icons/fa';

const MyDonations = () => {
    const { currentUser } = useAuth();
    const [donations, setDonations] = useState([]);
    const [campaigns, setCampaigns] = useState({});
    const [loading, setLoading] = useState(true);
    const [filterRange, setFilterRange] = useState('all');
    const [expandedCampaigns, setExpandedCampaigns] = useState({});
    const [stats, setStats] = useState({
        totalDonated: 0,
        totalDonations: 0,
        campaignsSupported: 0
    });

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const fetchDonations = async () => {
            try {
                const userDonations = await getDonationsByUser(currentUser.uid);
                const sortedDonations = userDonations.sort(
                    (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
                );

                const allCampaigns = await getCampaigns();
                const campaignsMap = {};
                allCampaigns.forEach(campaign => {
                    campaignsMap[campaign.id] = campaign;
                });

                const totalDonated = userDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
                const uniqueCampaigns = new Set(userDonations.map(d => d.campaignId));

                setDonations(sortedDonations);
                setCampaigns(campaignsMap);
                setStats({
                    totalDonated,
                    totalDonations: userDonations.length,
                    campaignsSupported: uniqueCampaigns.size
                });
            } catch (error) {
                console.error('Error fetching donations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDonations();
    }, [currentUser]);

    const periodRanges = useMemo(() => ({
        all: { label: 'All time', start: null, end: null },
        thisMonth: { label: 'This month', start: (() => {
            const d = new Date();
            return new Date(d.getFullYear(), d.getMonth(), 1);
        })(), end: new Date() },
        lastMonth: { label: 'Last month', start: (() => {
            const d = new Date();
            const start = new Date(d.getFullYear(), d.getMonth() - 1, 1);
            return start;
        })(), end: (() => {
            const d = new Date();
            return new Date(d.getFullYear(), d.getMonth(), 0, 23, 59, 59, 999);
        })() },
        lastYear: { label: 'Last 12 months', start: (() => {
            const d = new Date();
            return new Date(d.getFullYear() - 1, d.getMonth(), d.getDate());
        })(), end: new Date() }
    }), []);

    const filteredDonations = useMemo(() => {
        const range = periodRanges[filterRange];
        if (!range || (!range.start && !range.end)) return donations;

        return donations.filter((donation) => {
            const dateValue = donation.createdAt || donation.date;
            if (!dateValue) return false;
            const donationDate = new Date(dateValue);
            if (Number.isNaN(donationDate.getTime())) return false;

            if (range.start && donationDate < range.start) return false;
            if (range.end && donationDate > range.end) return false;
            return true;
        });
    }, [donations, filterRange, periodRanges]);

    // Group donations by campaign
    const groupedDonations = useMemo(() => {
        const grouped = {};
        
        filteredDonations.forEach((donation) => {
            const campaignId = donation.campaignId;
            if (!campaignId) return;
            
            if (!grouped[campaignId]) {
                grouped[campaignId] = {
                    campaignId,
                    campaignTitle: donation.campaignTitle || 'Unknown Campaign',
                    charityName: donation.charityName || 'Unknown Charity',
                    totalAmount: 0,
                    donationCount: 0,
                    donations: [],
                    firstDonationDate: null,
                    lastDonationDate: null
                };
            }
            
            grouped[campaignId].totalAmount += donation.amount || 0;
            grouped[campaignId].donationCount += 1;
            grouped[campaignId].donations.push(donation);
            
            const donationDate = new Date(donation.createdAt || donation.date);
            if (!isNaN(donationDate.getTime())) {
                if (!grouped[campaignId].firstDonationDate || donationDate < grouped[campaignId].firstDonationDate) {
                    grouped[campaignId].firstDonationDate = donationDate;
                }
                if (!grouped[campaignId].lastDonationDate || donationDate > grouped[campaignId].lastDonationDate) {
                    grouped[campaignId].lastDonationDate = donationDate;
                }
            }
        });
        
        // Sort donations within each group by date (newest first)
        Object.values(grouped).forEach(group => {
            group.donations.sort((a, b) => {
                const dateA = new Date(a.createdAt || a.date);
                const dateB = new Date(b.createdAt || b.date);
                return dateB - dateA;
            });
        });
        
        return grouped;
    }, [filteredDonations]);

    const toggleCampaignExpansion = (campaignId) => {
        setExpandedCampaigns(prev => ({
            ...prev,
            [campaignId]: !prev[campaignId]
        }));
    };

    const handleDownloadSlip = () => {
        const list = filteredDonations;
        if (!list.length) {
            alert('No donations found for the selected period.');
            return;
        }

        const header = ['Donation Date', 'Campaign', 'Charity', 'Amount (BDT)', 'Payment Method', 'Transaction ID', 'Status'];
        const rows = list.map((donation) => {
            const dateValue = new Date(donation.createdAt || donation.date).toLocaleString();
            return [
                `"${dateValue}"`,
                `"${donation.campaignTitle || 'Unknown Campaign'}"`,
                `"${donation.charityName || 'Unknown Charity'}"`,
                donation.amount || 0,
                `"${donation.paymentMethod || 'N/A'}"`,
                `"${donation.transactionId || 'N/A'}"`,
                `"${donation.status || 'completed'}"`
            ].join(',');
        });

        const csvContent = [header.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `donations-${filterRange}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>My Donations - Donor Dashboard</title>
            </Helmet>

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-6 shadow-xl">
                    <h1 className="text-3xl font-bold mb-2">My Donations</h1>
                    <p className="text-lg opacity-90">Track your contributions and impact</p>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card bg-gradient-to-br from-primary to-primary/80 text-white shadow-xl">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Total Donated</p>
                                    <p className="text-3xl font-bold">৳{stats.totalDonated.toLocaleString()}</p>
                                </div>
                                <FaMoneyBillWave className="text-5xl opacity-30" />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-secondary to-secondary/80 text-white shadow-xl">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Total Donations</p>
                                    <p className="text-3xl font-bold">{stats.totalDonations}</p>
                                </div>
                                <FaHeart className="text-5xl opacity-30" />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-accent to-accent/80 text-white shadow-xl">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Campaigns Supported</p>
                                    <p className="text-3xl font-bold">{stats.campaignsSupported}</p>
                                </div>
                                <FaChartLine className="text-5xl opacity-30" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Donations List */}
                <div className="card bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5 shadow-xl border border-primary/20">
                    <div className="card-body">
                        <div className="flex flex-col gap-4 mb-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                <div>
                                    <h2 className="card-title text-2xl mb-1">Donation History</h2>
                                    <p className="text-sm text-gray-600">
                                        Showing {Object.keys(groupedDonations).length} campaign{Object.keys(groupedDonations).length !== 1 ? 's' : ''} ({filteredDonations.length} donation{filteredDonations.length !== 1 ? 's' : ''})
                                    </p>
                                </div>
                                <div className="w-full md:w-auto">
                                    <div className="bg-white/70 backdrop-blur border border-primary/20 rounded-lg p-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center shadow-sm">
                                        <div className="form-control w-full sm:w-auto">
                                            <label className="label text-xs uppercase tracking-wide font-semibold text-gray-600 mb-1 px-3">Slip period</label>
                                            <select
                                                className="select select-bordered text-black select-sm w-full sm:w-48"
                                                value={filterRange}
                                                onChange={(e) => setFilterRange(e.target.value)}
                                            >
                                                {Object.entries(periodRanges).map(([key, range]) => (
                                                    <option key={key} value={key}>{range.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button 
                                            onClick={handleDownloadSlip} 
                                            className="btn btn-secondary btn-sm w-full sm:w-auto shadow-md"
                                        >
                                            Download Slip (CSV)
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="h-1 w-full bg-gradient-to-r from-primary/40 via-secondary/40 to-accent/40 rounded-full"></div>
                        </div>
                        
                        {Object.keys(groupedDonations).length === 0 ? (
                            <div className="text-center py-12">
                                <FaHandHoldingHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">No Donations Yet</h3>
                                <p className="text-gray-600 mb-6">
                                    {donations.length === 0
                                        ? 'Start making a difference by supporting a campaign!'
                                        : 'No donations match the selected period.'}
                                </p>
                                {donations.length === 0 && (
                                    <Link to="/campaigns" className="btn btn-primary">
                                        <FaHeart className="mr-2" />
                                        Browse Campaigns
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {Object.values(groupedDonations).map((group) => {
                                    const campaign = campaigns[group.campaignId];
                                    const isExpanded = expandedCampaigns[group.campaignId];
                                    const hasMultipleDonations = group.donationCount > 1;
                                    
                                    return (
                                        <div key={group.campaignId} className="card bg-gradient-to-br from-base-100 via-primary/10 to-secondary/5 shadow-lg border border-primary/20 hover:shadow-xl hover:border-primary/30 transition-all">
                                            <div className="card-body">
                                                <div className="flex flex-col lg:flex-row gap-4">
                                                    {/* Campaign Image */}
                                                    {campaign && (
                                                        <figure className="lg:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 border-2 border-primary/20 shadow-md">
                                                            <img 
                                                                src={campaign.image} 
                                                                alt={campaign.title}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.src = 'https://via.placeholder.com/300x200';
                                                                }}
                                                            />
                                                        </figure>
                                                    )}
                                                    
                                                    {/* Donation Details */}
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start mb-3 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
                                                            <div className="flex-1">
                                                                <h3 className="text-xl font-bold text-base-content">{group.campaignTitle}</h3>
                                                                <p className="text-sm text-black text-base-content/70 font-medium">By: {group.charityName}</p>
                                                                {hasMultipleDonations && (
                                                                    <p className="text-xs text-base-content/60 mt-1">
                                                                        {group.donationCount} donation{group.donationCount > 1 ? 's' : ''} made
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-2xl font-black text-primary">৳{group.totalAmount.toLocaleString()}</p>
                                                                <span className="badge badge-sm font-semibold badge-success">
                                                                    Total Donated
                                                                </span>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                                                            <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg border border-primary/20">
                                                                <FaCalendarAlt className="text-primary text-lg" />
                                                                <div>
                                                                    <p className="text-xs text-base-content/60 font-medium">Date Range</p>
                                                                    <p className="text-sm font-bold text-base-content">
                                                                        {formatDate(group.firstDonationDate)}
                                                                    </p>
                                                                    {hasMultipleDonations && group.firstDonationDate !== group.lastDonationDate && (
                                                                        <p className="text-xs text-base-content/50">
                                                                            to {formatDate(group.lastDonationDate)}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-2 p-2 bg-secondary/10 rounded-lg border border-secondary/20">
                                                                <FaMoneyBillWave className="text-secondary text-lg" />
                                                                <div>
                                                                    <p className="text-xs text-base-content/60 font-medium">Donations</p>
                                                                    <p className="text-sm font-bold text-base-content">{group.donationCount}</p>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-2 p-2 bg-accent/10 rounded-lg border border-accent/20">
                                                                <FaHeart className="text-accent text-lg" />
                                                                <div>
                                                                    <p className="text-xs text-base-content/60 font-medium">Total Amount</p>
                                                                    <p className="text-sm font-bold text-base-content">
                                                                        ৳{group.totalAmount.toLocaleString()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            
                                                            {campaign && (
                                                                <div className="flex items-center gap-2 p-2 bg-info/10 rounded-lg border border-info/20">
                                                                    <FaChartLine className="text-info text-lg" />
                                                                    <div>
                                                                        <p className="text-xs text-base-content/60 font-medium">Campaign Status</p>
                                                                        <p className="text-sm font-bold capitalize text-base-content">{campaign.status}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        {/* Date Dropdown for Multiple Donations */}
                                                        {hasMultipleDonations && (
                                                            <div className="mt-4">
                                                                <button
                                                                    onClick={() => toggleCampaignExpansion(group.campaignId)}
                                                                    className="btn btn-outline btn-sm w-full justify-between"
                                                                >
                                                                    <span className="flex items-center gap-2">
                                                                        <FaCalendarAlt />
                                                                        View Individual Donation Dates ({group.donationCount})
                                                                    </span>
                                                                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                                                </button>
                                                                
                                                                {isExpanded && (
                                                                    <div className="mt-3 p-4 bg-base-200 rounded-lg border border-primary/20">
                                                                        <h4 className="font-bold text-base-content mb-3">Donation History</h4>
                                                                        <div className="space-y-2">
                                                                            {group.donations.map((donation, idx) => (
                                                                                <div key={donation.id || idx} className="flex justify-between items-center p-3 bg-base-100 rounded-lg border border-base-300">
                                                                                    <div className="flex items-center gap-3">
                                                                                        <FaCalendarAlt className="text-primary" />
                                                                                        <div>
                                                                                            <p className="font-semibold text-base-content">
                                                                                                {formatDate(donation.createdAt || donation.date)}
                                                            </p>
                                                                                            <p className="text-xs text-base-content/60">
                                                                                                {new Date(donation.createdAt || donation.date).toLocaleTimeString()}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="text-right">
                                                                                        <p className="font-bold text-primary">৳{(donation.amount || 0).toLocaleString()}</p>
                                                                                        <p className="text-xs text-base-content/60 capitalize">{donation.paymentMethod}</p>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                        
                                                        {/* Campaign Progress */}
                                                        {campaign && (
                                                            <div className="mt-4 p-3 bg-gradient-to-r from-success/20 via-primary/10 to-success/20 rounded-lg border border-success/30">
                                                                <div className="flex justify-between text-sm mb-2">
                                                                    <span className="font-semibold text-base-content">Campaign Progress</span>
                                                                    <span className="font-bold text-success">
                                                                        {Math.round(((campaign.currentAmount || 0) / campaign.goalAmount) * 100)}% funded
                                                                    </span>
                                                                </div>
                                                                <progress 
                                                                    className="progress progress-success w-full h-3" 
                                                                    value={campaign.currentAmount || 0} 
                                                                    max={campaign.goalAmount}
                                                                ></progress>
                                                                <div className="flex  justify-between text-xs font-medium text-base-content/70 mt-2">
                                                                    <span className='text-black'>Raised: ৳{(campaign.currentAmount || 0).toLocaleString()}</span>
                                                                    <span>Goal: ৳{campaign.goalAmount.toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Action Button */}
                                                        <div className="card-actions justify-end mt-4">
                                                            {campaign ? (
                                                                <Link 
                                                                    to={`/campaigns/${campaign.id}`} 
                                                                    className="btn btn-primary btn-sm"
                                                                >
                                                                    <FaEye className="mr-2" />
                                                                    View Campaign
                                                                </Link>
                                                            ) : group.campaignId ? (
                                                                <Link 
                                                                    to={`/campaigns/${group.campaignId}`} 
                                                                    className="btn btn-primary btn-sm"
                                                                >
                                                                    <FaEye className="mr-2" />
                                                                    View Campaign
                                                                </Link>
                                                            ) : (
                                                                <span className="text-sm text-gray-500 italic">Campaign no longer available</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyDonations;
