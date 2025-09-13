import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { mockCampaigns, mockCategories } from '../../data/mockData';
import { FaSearch, FaFilter, FaHeart, FaClock, FaUsers } from 'react-icons/fa';

const Campaigns = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [filteredCampaigns, setFilteredCampaigns] = useState(mockCampaigns);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        filterCampaigns(term, selectedCategory, sortBy);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        filterCampaigns(searchTerm, category, sortBy);
    };

    const handleSortChange = (sort) => {
        setSortBy(sort);
        filterCampaigns(searchTerm, selectedCategory, sort);
    };

    const filterCampaigns = (search, category, sort) => {
        let filtered = mockCampaigns.filter(campaign => {
            const matchesSearch = campaign.title.toLowerCase().includes(search) ||
                                campaign.description.toLowerCase().includes(search) ||
                                campaign.category.toLowerCase().includes(search);
            const matchesCategory = !category || campaign.category === category;
            return matchesSearch && matchesCategory;
        });

        // Sort campaigns
        switch (sort) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                break;
            case 'most_funded':
                filtered.sort((a, b) => (b.raised / b.goal) - (a.raised / a.goal));
                break;
            case 'least_funded':
                filtered.sort((a, b) => (a.raised / a.goal) - (b.raised / b.goal));
                break;
            case 'most_donors':
                filtered.sort((a, b) => b.donors - a.donors);
                break;
            case 'urgent':
                filtered.sort((a, b) => {
                    const urgencyOrder = { high: 3, medium: 2, low: 1 };
                    return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
                });
                break;
        }

        setFilteredCampaigns(filtered);
    };

    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'high': return 'badge-error';
            case 'medium': return 'badge-warning';
            case 'low': return 'badge-success';
            default: return 'badge-neutral';
        }
    };

    const getUrgencyText = (urgency) => {
        switch (urgency) {
            case 'high': return 'Urgent';
            case 'medium': return 'Moderate';
            case 'low': return 'Low Priority';
            default: return 'Normal';
        }
    };

    return (
        <>
            <Helmet>
                <title>Charity Campaigns - Browse All Causes</title>
                <meta name="description" content="Browse all verified charity campaigns. Support education, healthcare, emergency relief, and more causes across Bangladesh." />
            </Helmet>

            <div className="min-h-screen bg-base-200 pt-20">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">Charity Campaigns</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Discover and support verified charity campaigns making a real difference in communities across Bangladesh
                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-base-100 rounded-lg shadow-lg p-6 mb-8">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search campaigns..."
                                        className="input input-bordered w-full pl-10"
                                        value={searchTerm}
                                        onChange={handleSearch}
                                    />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="lg:w-64">
                                <select
                                    className="select select-bordered w-full"
                                    value={selectedCategory}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {mockCategories.map(category => (
                                        <option key={category.id} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort */}
                            <div className="lg:w-48">
                                <select
                                    className="select select-bordered w-full"
                                    value={sortBy}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="most_funded">Most Funded</option>
                                    <option value="least_funded">Least Funded</option>
                                    <option value="most_donors">Most Donors</option>
                                    <option value="urgent">Most Urgent</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Campaigns Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCampaigns.map((campaign) => (
                            <div key={campaign.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                                <figure className="relative">
                                    <img 
                                        src={campaign.image} 
                                        alt={campaign.title} 
                                        className="h-48 w-full object-cover"
                                    />
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className="badge badge-primary">{campaign.category}</span>
                                        <span className={`badge ${getUrgencyColor(campaign.urgency)}`}>
                                            {getUrgencyText(campaign.urgency)}
                                        </span>
                                    </div>
                                    {campaign.verified && (
                                        <div className="absolute top-4 right-4">
                                            <span className="badge badge-success">Verified</span>
                                        </div>
                                    )}
                                </figure>

                                <div className="card-body">
                                    <h3 className="card-title text-lg line-clamp-2">{campaign.title}</h3>
                                    <p className="text-gray-600 line-clamp-2">{campaign.description}</p>
                                    
                                    <div className="mt-4">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-semibold">
                                                {campaign.raised.toLocaleString()} BDT
                                            </span>
                                            <span className="text-gray-500">
                                                of {campaign.goal.toLocaleString()} BDT
                                            </span>
                                        </div>
                                        <progress 
                                            className="progress progress-primary w-full" 
                                            value={campaign.raised} 
                                            max={campaign.goal}
                                        ></progress>
                                        <div className="flex justify-between text-sm mt-2">
                                            <span className="font-semibold">
                                                {Math.round((campaign.raised / campaign.goal) * 100)}% funded
                                            </span>
                                            <span className="text-gray-500 flex items-center gap-1">
                                                <FaUsers className="text-xs" />
                                                {campaign.donors} donors
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
                                        <Link 
                                            to={`/campaigns/${campaign.id}/donate`} 
                                            className="btn btn-outline btn-sm flex-1"
                                        >
                                            <FaHeart className="mr-1" />
                                            Donate
                                        </Link>
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
                                    setFilteredCampaigns(mockCampaigns);
                                }}
                                className="btn btn-primary"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                    {/* Results Count */}
                    <div className="text-center mt-8">
                        <p className="text-gray-600">
                            Showing {filteredCampaigns.length} of {mockCampaigns.length} campaigns
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Campaigns;
