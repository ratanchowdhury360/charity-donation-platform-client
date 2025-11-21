import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { mockCharities } from '../../data/mockData';
import { FaStar, FaUsers, FaHeart, FaBuilding, FaCalendarAlt, FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const CharityDetails = () => {
    const { id } = useParams();
    const charity = mockCharities.find(c => c.id === parseInt(id));

    if (!charity) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200 pt-20">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Charity Not Found</h1>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{charity.name} - Charity Profile</title>
                <meta name="description" content={charity.description} />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5 pt-20">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="card bg-gradient-to-br from-white via-primary/10 to-secondary/10 shadow-xl border-2 border-primary/20 mb-8">
                        <div className="card-body">
                            <div className="flex flex-col md:flex-row gap-6">
                                <img src={charity.logo} alt={charity.name} className="w-24 h-24 rounded-full mx-auto md:mx-0 border-4 border-primary/30 shadow-lg" />
                                <div className="flex-1 text-center md:text-left">
                                    <h1 className="text-3xl font-bold mb-2 text-gray-900">{charity.name}</h1>
                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                                        <FaStar className="text-yellow-400" />
                                        <span className="font-semibold text-gray-800">{charity.rating}</span>
                                        <span className="badge badge-success">Verified</span>
                                    </div>
                                    <p className="text-gray-700 mb-4 font-medium">{charity.description}</p>
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        {charity.categories.map((category, index) => (
                                            <span key={index} className="badge badge-primary">{category}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* About */}
                            <div className="card bg-gradient-to-br from-white via-primary/10 to-secondary/10 shadow-xl border-2 border-primary/20">
                                <div className="card-body">
                                    <h2 className="card-title mb-4 text-gray-900">About {charity.name}</h2>
                                    <p className="text-gray-700 leading-relaxed font-medium">
                                        {charity.description} Founded in {charity.establishedYear}, we have been working 
                                        tirelessly to make a positive impact in our communities. Our mission is to 
                                        create lasting change through verified campaigns and transparent operations.
                                    </p>
                                </div>
                            </div>

                            {/* Team Members */}
                            <div className="card bg-gradient-to-br from-white via-primary/10 to-secondary/10 shadow-xl border-2 border-primary/20">
                                <div className="card-body">
                                    <h2 className="card-title mb-4 text-gray-900">Our Team</h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {charity.teamMembers.map((member, index) => (
                                            <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-lg border border-primary/20">
                                                <img src={member.image} alt={member.name} className="w-12 h-12 rounded-full border-2 border-primary/30" />
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{member.name}</h4>
                                                    <p className="text-sm text-gray-700 font-medium">{member.role}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Stats */}
                            <div className="card bg-gradient-to-br from-white via-primary/10 to-secondary/10 shadow-xl border-2 border-primary/20">
                                <div className="card-body">
                                    <h3 className="card-title mb-4 text-gray-900">Statistics</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center bg-gradient-to-r from-primary/10 to-primary/5 p-2 rounded-lg border border-primary/20">
                                            <span className="text-gray-700 font-medium">Total Campaigns</span>
                                            <span className="font-bold text-primary">{charity.totalCampaigns}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-gradient-to-r from-secondary/10 to-secondary/5 p-2 rounded-lg border border-secondary/20">
                                            <span className="text-gray-700 font-medium">Total Raised</span>
                                            <span className="font-bold text-secondary">{charity.totalRaised.toLocaleString()} BDT</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-gradient-to-r from-accent/10 to-accent/5 p-2 rounded-lg border border-accent/20">
                                            <span className="text-gray-700 font-medium">Rating</span>
                                            <span className="font-bold text-accent">{charity.rating}/5</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-gradient-to-r from-info/10 to-info/5 p-2 rounded-lg border border-info/20">
                                            <span className="text-gray-700 font-medium">Established</span>
                                            <span className="font-bold text-info">{charity.establishedYear}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="card bg-gradient-to-br from-white via-primary/10 to-secondary/10 shadow-xl border-2 border-primary/20">
                                <div className="card-body">
                                    <h3 className="card-title mb-4 text-gray-900">Contact Information</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 bg-gradient-to-r from-primary/10 to-primary/5 p-2 rounded-lg border border-primary/20">
                                            <FaMapMarkerAlt className="text-primary text-lg" />
                                            <span className="text-sm text-gray-700 font-medium">{charity.location}</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-gradient-to-r from-secondary/10 to-secondary/5 p-2 rounded-lg border border-secondary/20">
                                            <FaEnvelope className="text-secondary text-lg" />
                                            <span className="text-sm text-gray-700 font-medium">{charity.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-gradient-to-r from-accent/10 to-accent/5 p-2 rounded-lg border border-accent/20">
                                            <FaPhone className="text-accent text-lg" />
                                            <span className="text-sm text-gray-700 font-medium">{charity.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-gradient-to-r from-info/10 to-info/5 p-2 rounded-lg border border-info/20">
                                            <FaGlobe className="text-info text-lg" />
                                            <a href={charity.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline font-medium">
                                                Visit Website
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="card bg-gradient-to-br from-white via-primary/10 to-secondary/10 shadow-xl border-2 border-primary/20">
                                <div className="card-body">
                                    <h3 className="card-title mb-4 text-gray-900">Support This Charity</h3>
                                    <div className="space-y-3">
                                        <button className="btn btn-primary w-full">
                                            <FaHeart className="mr-2" />
                                            View Campaigns
                                        </button>
                                        <button className="btn btn-outline btn-primary w-full">
                                            <FaUsers className="mr-2" />
                                            Follow Charity
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CharityDetails;
