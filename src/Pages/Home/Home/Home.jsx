import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Banner from "../Banner/Banner";
import { mockCampaigns, mockStats, mockTestimonials } from '../../../data/mockData';
import { FaHeart, FaUsers, FaHandHoldingHeart, FaChartLine, FaArrowRight, FaStar } from 'react-icons/fa';

const Home = () => {
    const featuredCampaigns = mockCampaigns.filter(campaign => campaign.featured).slice(0, 3);

    return (
        <>
            <Helmet>
                <title>Charity Donation Platform - Make a Difference Today</title>
                <meta name="description" content="Join thousands of donors making a positive impact through verified charity campaigns. Support education, healthcare, emergency relief, and more." />
            </Helmet>

            {/* Hero Section with Parallax */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
                <div className="absolute inset-0 bg-black/30"></div>
                
                {/* Parallax Background */}
                <div className="absolute inset-0 bg-cover bg-center bg-fixed" 
                     style={{ backgroundImage: 'url(/api/placeholder/1920/1080)' }}>
                </div>
                
                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
                        Make a <span className="text-primary">Difference</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 opacity-90 animate-slide-up">
                        Join thousands of donors supporting verified charity campaigns across Bangladesh
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/campaigns" className="btn btn-primary btn-lg">
                            <FaHeart className="mr-2" />
                            Donate Now
                        </Link>
                        <Link to="/campaigns/create" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary">
                            Start Campaign
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-base-200">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-primary mb-2">{mockStats.totalDonations.toLocaleString()}</div>
                            <div className="text-lg text-gray-600">Total Raised (BDT)</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-primary mb-2">{mockStats.totalCampaigns}</div>
                            <div className="text-lg text-gray-600">Active Campaigns</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-primary mb-2">{mockStats.totalDonors}</div>
                            <div className="text-lg text-gray-600">Donors</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-primary mb-2">{mockStats.successRate}%</div>
                            <div className="text-lg text-gray-600">Success Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Campaigns */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Featured Campaigns</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Discover urgent causes that need your support right now
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredCampaigns.map((campaign) => (
                            <div key={campaign.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                                <figure>
                                    <img src={campaign.image} alt={campaign.title} className="h-48 w-full object-cover" />
                                </figure>
                                <div className="card-body">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="badge badge-primary">{campaign.category}</span>
                                        {campaign.urgency === 'high' && (
                                            <span className="badge badge-error">Urgent</span>
                                        )}
                                    </div>
                                    <h3 className="card-title text-lg">{campaign.title}</h3>
                                    <p className="text-gray-600 line-clamp-2">{campaign.description}</p>
                                    
                                    <div className="mt-4">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Raised: {campaign.raised.toLocaleString()} BDT</span>
                                            <span>Goal: {campaign.goal.toLocaleString()} BDT</span>
                                        </div>
                                        <progress 
                                            className="progress progress-primary w-full" 
                                            value={campaign.raised} 
                                            max={campaign.goal}
                                        ></progress>
                                        <div className="flex justify-between text-sm mt-2">
                                            <span>{Math.round((campaign.raised / campaign.goal) * 100)}% funded</span>
                                            <span>{campaign.donors} donors</span>
                                        </div>
                                    </div>

                                    <div className="card-actions justify-between mt-4">
                                        <Link to={`/campaigns/${campaign.id}`} className="btn btn-primary btn-sm">
                                            View Details
                                        </Link>
                                        <Link to={`/campaigns/${campaign.id}/donate`} className="btn btn-outline btn-sm">
                                            Donate Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link to="/campaigns" className="btn btn-primary btn-lg">
                            View All Campaigns
                            <FaArrowRight className="ml-2" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-base-200">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Simple steps to make a meaningful impact
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaHandHoldingHeart className="text-3xl text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">1. Browse Campaigns</h3>
                            <p className="text-gray-600">
                                Explore verified charity campaigns across different categories and causes
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaHeart className="text-3xl text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">2. Choose & Donate</h3>
                            <p className="text-gray-600">
                                Select a campaign that resonates with you and make a secure donation
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaChartLine className="text-3xl text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">3. Track Impact</h3>
                            <p className="text-gray-600">
                                Follow the campaign progress and see how your donation makes a difference
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">What People Say</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Stories from our community of donors and beneficiaries
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {mockTestimonials.map((testimonial) => (
                            <div key={testimonial.id} className="card bg-base-100 shadow-xl">
                                <div className="card-body text-center">
                                    <div className="flex justify-center mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <FaStar key={i} className="text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 mb-6">"{testimonial.text}"</p>
                                    <div className="flex items-center justify-center">
                                        <img 
                                            src={testimonial.image} 
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full mr-4"
                                        />
                                        <div>
                                            <div className="font-bold">{testimonial.name}</div>
                                            <div className="text-sm text-gray-500">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Join thousands of donors who are already making a positive impact in their communities
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/signup" className="btn btn-secondary btn-lg">
                            <FaUsers className="mr-2" />
                            Join as Donor
                        </Link>
                        <Link to="/charities/register" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary">
                            Register Charity
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;