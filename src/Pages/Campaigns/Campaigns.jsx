import React, { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getCampaignsByStatus, isCampaignActive } from '../../utils/campaignStorage';
import { getAllCampaignDonorCounts } from '../../utils/donationStorage';
import { FaSearch, FaFilter, FaHeart, FaClock, FaUsers, FaCheckCircle, FaLock } from 'react-icons/fa';

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [donorCounts, setDonorCounts] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [filteredCampaigns, setFilteredCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [viewFilter, setViewFilter] = useState(searchParams.get('view') || 'active');

    // Get unique categories from campaigns
    const categories = [...new Set(campaigns.map(c => c.category))];

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const approvedCampaigns = await getCampaignsByStatus('approved');
                setCampaigns(approvedCampaigns);
                setFilteredCampaigns(approvedCampaigns);

                const counts = await getAllCampaignDonorCounts();
                setDonorCounts(counts);
            } catch (error) {
                console.error('Failed to load campaigns', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        filterCampaigns(term, selectedCategory, sortBy, viewFilter);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        filterCampaigns(searchTerm, category, sortBy, viewFilter);
    };

    const handleSortChange = (sort) => {
        setSortBy(sort);
        filterCampaigns(searchTerm, selectedCategory, sort, viewFilter);
    };

    const matchesView = (campaign, view) => {
        const now = new Date();
        const endDate = new Date(campaign.endDate);
        const isArchived = endDate < now;
        const isCompleted = (campaign.currentAmount || 0) >= campaign.goalAmount;

        switch (view) {
            case 'completed':
                return isCompleted;
            case 'archived':
                return isArchived;
            case 'all':
                return true;
            case 'active':
            default:
                return !isArchived;
        }
    };

    const filterCampaigns = useCallback((search, category, sort, view = viewFilter) => {
        let filtered = campaigns.filter(campaign => {
            const matchesSearch = campaign.title.toLowerCase().includes(search) ||
                                campaign.description.toLowerCase().includes(search) ||
                                campaign.category.toLowerCase().includes(search);
            const matchesCategory = !category || campaign.category === category;
            const matchesLifecycle = matchesView(campaign, view);
            return matchesSearch && matchesCategory && matchesLifecycle;
        });

        // Sort campaigns
        switch (sort) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'most_funded':
                filtered.sort((a, b) => (b.currentAmount / b.goalAmount) - (a.currentAmount / a.goalAmount));
                break;
            case 'least_funded':
                filtered.sort((a, b) => (a.currentAmount / a.goalAmount) - (b.currentAmount / b.goalAmount));
                break;
            case 'most_donors':
                filtered.sort((a, b) => b.donors - a.donors);
                break;
            case 'ending_soon':
                filtered.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
                break;
        }

        setFilteredCampaigns(filtered);
    }, [campaigns, viewFilter]);

    const handleViewChange = (view) => {
        setViewFilter(view);
        const params = new URLSearchParams(searchParams);
        if (view === 'active') {
            params.delete('view');
        } else {
            params.set('view', view);
        }
        setSearchParams(params);
        filterCampaigns(searchTerm, selectedCategory, sortBy, view);
    };

    useEffect(() => {
        const paramView = searchParams.get('view') || 'active';
        setViewFilter(paramView);
        filterCampaigns(searchTerm, selectedCategory, sortBy, paramView);
    }, [searchParams, campaigns, searchTerm, selectedCategory, sortBy, filterCampaigns]);

    const getDaysLeft = (endDate) => {
        const end = new Date(endDate);
        const now = new Date();
        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 pt-20 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Charity Campaigns - Browse All Causes</title>
                <meta name="description" content="Browse all verified charity campaigns. Support education, healthcare, emergency relief, and more causes across Bangladesh." />
            </Helmet>

            <div className="min-h-screen  pt-20">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">Charity Campaigns</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Discover and support verified charity campaigns making a real difference in communities across Bangladesh
                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-gradient-to-r from-primary/20 via-secondary/15 to-primary/20 rounded-lg shadow-lg p-6 mb-8 border border-primary/30">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 ">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search campaigns..."
                                        className="input bg-black input-bordered w-full pl-10"
                                        value={searchTerm}
                                        onChange={handleSearch}
                                    />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="lg:w-64">
                                <select
                                    className="select bg-black select-bordered w-full"
                                    value={selectedCategory}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort */}
                            <div className="lg:w-48">
                                <select
                                    className="select bg-black select-bordered w-full"
                                    value={sortBy}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="most_funded">Most Funded</option>
                                    <option value="least_funded">Least Funded</option>
                                    <option value="most_donors">Most Donors</option>
                                    <option value="ending_soon">Ending Soon</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                                <FaFilter />
                                View campaigns by status
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { key: 'active', label: 'Active' },
                                    { key: 'completed', label: 'Completed' },
                                    { key: 'archived', label: 'Ended' },
                                    { key: 'all', label: 'All' },
                                ].map((option) => (
                                    <button
                                        key={option.key}
                                        onClick={() => handleViewChange(option.key)}
                                        className={`btn btn-sm ${
                                            viewFilter === option.key ? 'btn-primary' : 'btn-outline'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Campaigns Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCampaigns.map((campaign) => (
                            <div key={campaign.id} className="card bg-gradient-to-br from-white via-primary/10 to-secondary/10 border-2 border-primary/20 shadow-xl hover:shadow-2xl hover:border-primary/40 hover:scale-[1.02] transition-all duration-300">
                                <figure className="relative">
                                    <img 
                                        src={campaign.image} 
                                        alt={campaign.title} 
                                        className="h-48 w-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x200';
                                        }}
                                    />
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className="badge badge-primary capitalize">{campaign.category}</span>
                                        {getDaysLeft(campaign.endDate) <= 7 && getDaysLeft(campaign.endDate) > 0 && (
                                            <span className="badge badge-error">
                                                <FaClock className="mr-1" /> {getDaysLeft(campaign.endDate)} days left
                                            </span>
                                        )}
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className="badge badge-success gap-1">
                                            <FaCheckCircle /> Approved
                                        </span>
                                    </div>
                                </figure>

                                <div className="card-body">
                                    <h3 className="card-title text-lg line-clamp-2 text-base-content">{campaign.title}</h3>
                                    <p className="text-base-content/70 line-clamp-2">{campaign.description}</p>
                                    
                                    <div className="text-sm text-base-content/80 mb-2">
                                        <p>By: <span className="font-semibold text-primary">{campaign.charityName}</span></p>
                                    </div>

                                    <div className="mt-4 p-3 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 rounded-lg border border-primary/20">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-bold text-success text-lg">
                                                ৳{campaign.currentAmount.toLocaleString()}
                                            </span>
                                            <span className="text-base-content/70 font-medium">
                                                of ৳{campaign.goalAmount.toLocaleString()}
                                            </span>
                                        </div>
                                        <progress 
                                            className="progress progress-success w-full h-2" 
                                            value={campaign.currentAmount} 
                                            max={campaign.goalAmount}
                                        ></progress>
                                        <div className="flex justify-between text-sm mt-2">
                                            <span className="font-bold text-primary">
                                                {Math.round((campaign.currentAmount / campaign.goalAmount) * 100)}% funded
                                            </span>
                                            <span className="text-base-content/70 flex items-center gap-1 font-medium">
                                                <FaUsers className="text-primary" />
                                                {donorCounts[campaign.id] || 0} {(donorCounts[campaign.id] || 0) === 1 ? 'donor' : 'donors'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="card-actions justify-between mt-4">
                                        <Link 
                                            to={`/campaigns/${campaign.id}`} 
                                            className="btn btn-primary btn-sm flex-1"
                                        >
                                            View Details
                                        </Link>
                                        {isCampaignActive(campaign) ? (
                                        <Link 
                                            to={`/campaigns/${campaign.id}/donate`} 
                                            className="btn btn-outline btn-sm flex-1"
                                        >
                                            <FaHeart className="mr-1" />
                                            Donate
                                        </Link>
                                        ) : (
                                            <button 
                                                className="btn btn-disabled btn-sm flex-1" 
                                                disabled
                                                title={
                                                    campaign.status !== 'approved' ? 'Campaign Pending Approval' :
                                                    (campaign.currentAmount || 0) >= campaign.goalAmount ? 'Campaign Goal Reached' :
                                                    'Campaign Ended'
                                                }
                                            >
                                                <FaLock className="mr-1" />
                                                Donate
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* No Results */}
                    {filteredCampaigns.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold mb-2">No campaigns found</h3>
                            <p className="text-gray-600 mb-4">
                                Try adjusting your search terms or filters
                            </p>
                            <button 
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('');
                                    setSortBy('newest');
                                    setFilteredCampaigns(campaigns);
                                }}
                                className="btn btn-primary"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                    {/* Results Count */}
                    {filteredCampaigns.length > 0 && (
                        <div className="text-center mt-8">
                            <p className="text-white">
                                Showing {filteredCampaigns.length} of {campaigns.length} approved campaigns
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Campaigns;
