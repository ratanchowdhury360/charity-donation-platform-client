import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { mockCharities } from '../../data/mockData';
import { FaStar, FaUsers, FaHeart, FaBuilding, FaCalendarAlt, FaGlobe, FaEnvelope, FaPhone } from 'react-icons/fa';

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

            <div className="min-h-screen bg-base-200 pt-20">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="card bg-base-100 shadow-xl mb-8">
                        <div className="card-body">
                            <div className="flex flex-col md:flex-row gap-6">
                                <img src={charity.logo} alt={charity.name} className="w-24 h-24 rounded-full mx-auto md:mx-0" />
                                <div className="flex-1 text-center md:text-left">
                                    <h1 className="text-3xl font-bold mb-2">{charity.name}</h1>
                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                                        <FaStar className="text-yellow-400" />
                                        <span className="font-semibold">{charity.rating}</span>
                                        <span className="badge badge-success">Verified</span>
                                    </div>
                                    <p className="text-gray-600 mb-4">{charity.description}</p>
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
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title mb-4">About {charity.name}</h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        {charity.description} Founded in {charity.establishedYear}, we have been working 
                                        tirelessly to make a positive impact in our communities. Our mission is to 
                                        create lasting change through verified campaigns and transparent operations.
                                    </p>
                                </div>
                            </div>

                            {/* Team Members */}
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title mb-4">Our Team</h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {charity.teamMembers.map((member, index) => (
                                            <div key={index} className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                                                <img src={member.image} alt={member.name} className="w-12 h-12 rounded-full" />
                                                <div>
                                                    <h4 className="font-semibold">{member.name}</h4>
                                                    <p className="text-sm text-gray-600">{member.role}</p>
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
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h3 className="card-title mb-4">Statistics</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span>Total Campaigns</span>
                                            <span className="font-bold text-primary">{charity.totalCampaigns}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total Raised</span>
                                            <span className="font-bold text-secondary">{charity.totalRaised.toLocaleString()} BDT</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Rating</span>
                                            <span className="font-bold text-accent">{charity.rating}/5</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Established</span>
                                            <span className="font-bold">{charity.establishedYear}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h3 className="card-title mb-4">Contact Information</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <FaMapMarkerAlt className="text-primary" />
                                            <span className="text-sm">{charity.location}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaEnvelope className="text-primary" />
                                            <span className="text-sm">{charity.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaPhone className="text-primary" />
                                            <span className="text-sm">{charity.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaGlobe className="text-primary" />
                                            <a href={charity.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                                Visit Website
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h3 className="card-title mb-4">Support This Charity</h3>
                                    <div className="space-y-3">
                                        <button className="btn btn-primary w-full">
                                            <FaHeart className="mr-2" />
                                            View Campaigns
                                        </button>
                                        <button className="btn btn-outline w-full">
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
