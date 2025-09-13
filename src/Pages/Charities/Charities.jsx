import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { mockCharities } from '../../data/mockData';
import { FaStar, FaUsers, FaHeart, FaBuilding } from 'react-icons/fa';

const Charities = () => {
    return (
        <>
            <Helmet>
                <title>Verified Charities - Charity Platform</title>
                <meta name="description" content="Browse verified charity organizations making a positive impact in Bangladesh. Support trusted causes." />
            </Helmet>

            <div className="min-h-screen bg-base-200 pt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">Verified Charities</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Discover trusted charity organizations making a real difference in communities across Bangladesh
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mockCharities.map((charity) => (
                            <div key={charity.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                                <figure>
                                    <img src={charity.coverImage} alt={charity.name} className="h-48 w-full object-cover" />
                                </figure>
                                <div className="card-body">
                                    <div className="flex items-center gap-3 mb-4">
                                        <img src={charity.logo} alt={charity.name} className="w-12 h-12 rounded-full" />
                                        <div>
                                            <h3 className="card-title text-lg">{charity.name}</h3>
                                            <div className="flex items-center gap-1">
                                                <FaStar className="text-yellow-400 text-sm" />
                                                <span className="text-sm text-gray-600">{charity.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-600 line-clamp-3 mb-4">{charity.description}</p>
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-primary">{charity.totalCampaigns}</div>
                                            <div className="text-xs text-gray-600">Campaigns</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-secondary">{charity.totalRaised.toLocaleString()}</div>
                                            <div className="text-xs text-gray-600">Raised (BDT)</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {charity.categories.slice(0, 3).map((category, index) => (
                                            <span key={index} className="badge badge-outline badge-sm">{category}</span>
                                        ))}
                                    </div>

                                    <div className="card-actions justify-between">
                                        <Link to={`/charities/${charity.id}`} className="btn btn-primary btn-sm flex-1">
                                            View Profile
                                        </Link>
                                        <Link to={`/charities/${charity.id}/campaigns`} className="btn btn-outline btn-sm flex-1">
                                            <FaHeart className="mr-1" />
                                            Campaigns
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link to="/charities/register" className="btn btn-primary btn-lg">
                            <FaBuilding className="mr-2" />
                            Register Your Charity
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Charities;
