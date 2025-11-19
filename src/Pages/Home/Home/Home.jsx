import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Banner from "../Banner/Banner";
import { getCampaigns, getCampaignsByStatus } from '../../../utils/campaignStorage';
import { getAllCampaignDonorCounts } from '../../../utils/donationStorage';
import { getAllReviews } from '../../../utils/reviewStorage';
import { db } from '../../../firebase/firebase.config';
import { collection, getCountFromServer } from 'firebase/firestore';
import { FaHeart, FaUsers, FaHandHoldingHeart, FaChartLine, FaArrowRight, FaStar, FaBuilding, FaUser } from 'react-icons/fa';

const Home = () => {
    const [stats, setStats] = useState({
        totalRaised: 0,
        activeCampaigns: 0,
        totalDonors: 0,
        totalCharities: 0,
        successRate: 0
    });
    const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
    const [donorCounts, setDonorCounts] = useState({});
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get all campaigns
                const [allCampaigns, approvedCampaigns] = await Promise.all([
                    getCampaigns(),
                    getCampaignsByStatus('approved')
                ]);

                // Get donor counts for all campaigns
                const counts = await getAllCampaignDonorCounts();
                setDonorCounts(counts);

                // Calculate active campaigns (approved and end date not passed)
                const now = new Date();
                now.setHours(0, 0, 0, 0); // Reset time to start of day
                const active = approvedCampaigns.filter(campaign => {
                    const endDate = new Date(campaign.endDate);
                    endDate.setHours(23, 59, 59, 999); // Set to end of day
                    return endDate >= now;
                });

                // Calculate total raised
                const totalRaised = allCampaigns.reduce((sum, c) => sum + (c.currentAmount || 0), 0);

                // Count unique charities
                const uniqueCharities = new Set(allCampaigns.map(c => c.charityId));

                // Get total users/donors from Firestore
                let totalDonors = 0;
                try {
                    const usersRef = collection(db, 'users');
                    const snapshot = await getCountFromServer(usersRef);
                    totalDonors = snapshot.data().count || 0;
                } catch (error) {
                    console.error('Error fetching user count:', error);
                }

                // Calculate success rate (campaigns that reached 100% or more)
                const successfulCampaigns = allCampaigns.filter(c =>
                    c.currentAmount >= c.goalAmount
                );
                const successRate = allCampaigns.length > 0
                    ? Math.round((successfulCampaigns.length / allCampaigns.length) * 100)
                    : 0;

                // Get featured campaigns (top 3 by raised amount from approved)
                const featured = approvedCampaigns
                    .sort((a, b) => (b.currentAmount || 0) - (a.currentAmount || 0))
                    .slice(0, 3);

                // Get all reviews and sort by most recent
                const allReviews = await getAllReviews();
                const sortedReviews = allReviews
                    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
                    .slice(0, 6); // Show top 6 most recent reviews

                setStats({
                    totalRaised,
                    activeCampaigns: active.length,
                    totalDonors,
                    totalCharities: uniqueCharities.size,
                    successRate
                });
                setFeaturedCampaigns(featured);
                setReviews(sortedReviews);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching home data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <Helmet>
                <title>Charity Donation Platform - Make a Difference Today</title>
                <meta name="description" content="Join thousands of donors making a positive impact through verified charity campaigns. Support education, healthcare, emergency relief, and more." />
            </Helmet>

            {/* Hero Section with Parallax */}


            {/* Stats Section */}
            <section className="py-20 bg-base-200">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        <div className="text-center p-6 bg-base-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                            <FaHeart className="text-4xl text-primary mx-auto mb-3" />
                            <div className="text-3xl font-bold text-primary mb-2">৳{stats.totalRaised.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Total Raised</div>
                        </div>
                        <div className="text-center p-6 bg-base-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                            <FaChartLine className="text-4xl text-secondary mx-auto mb-3" />
                            <div className="text-3xl font-bold text-secondary mb-2">{stats.activeCampaigns}</div>
                            <div className="text-sm text-gray-600">Active Campaigns</div>
                        </div>
                        <div className="text-center p-6 bg-base-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                            <FaUsers className="text-4xl text-accent mx-auto mb-3" />
                            <div className="text-3xl font-bold text-accent mb-2">{stats.totalDonors}</div>
                            <div className="text-sm text-gray-600">Donors</div>
                        </div>
                        <div className="text-center p-6 bg-base-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                            <FaBuilding className="text-4xl text-info mx-auto mb-3" />
                            <div className="text-3xl font-bold text-info mb-2">{stats.totalCharities}</div>
                            <div className="text-sm text-gray-600">Charities</div>
                        </div>
                        <div className="text-center p-6 bg-base-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                            <FaStar className="text-4xl text-warning mx-auto mb-3" />
                            <div className="text-3xl font-bold text-warning mb-2">{stats.successRate}%</div>
                            <div className="text-sm text-gray-600">Success Rate</div>
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
                            Top campaigns making the biggest impact right now
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                        </div>
                    ) : featuredCampaigns.length === 0 ? (
                        <div className="text-center py-12">
                            <h3 className="text-2xl font-bold mb-4">No Featured Campaigns Yet</h3>
                            <p className="text-gray-600 mb-6">Check back soon for new campaigns!</p>
                            <Link to="/campaigns" className="btn btn-primary">
                                View All Campaigns
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredCampaigns.map((campaign) => (
                                <div key={campaign.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                                    <figure>
                                        <img
                                            src={campaign.image}
                                            alt={campaign.title}
                                            className="h-48 w-full object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/400x200';
                                            }}
                                        />
                                    </figure>
                                    <div className="card-body">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="badge badge-primary capitalize">{campaign.category}</span>
                                            <span className="badge badge-success">Approved</span>
                                        </div>
                                        <h3 className="card-title text-lg">{campaign.title}</h3>
                                        <p className="text-sm text-gray-600 mb-1">By: {campaign.charityName}</p>
                                        <p className="text-gray-600 line-clamp-2">{campaign.description}</p>

                                        <div className="mt-4">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span>Raised: ৳{(campaign.currentAmount || 0).toLocaleString()}</span>
                                                <span>Goal: ৳{campaign.goalAmount.toLocaleString()}</span>
                                            </div>
                                            <progress
                                                className="progress progress-primary w-full"
                                                value={campaign.currentAmount || 0}
                                                max={campaign.goalAmount}
                                            ></progress>
                                            <div className="flex justify-between text-sm mt-2">
                                                <span>{Math.round(((campaign.currentAmount || 0) / campaign.goalAmount) * 100)}% funded</span>
                                                <span className="flex items-center gap-1">
                                                    <FaUsers className="text-xs" />
                                                    {donorCounts[campaign.id] || 0} donors
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1 text-right">
                                                Ends: {new Date(campaign.endDate).toLocaleDateString()}
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
                    )}

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

            {/* User Reviews */}
            <section className="py-20 bg-base-200">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">What People Say</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Real reviews from our community of donors and charities
                        </p>
                    </div>

                    {reviews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {reviews.map((review) => (
                                <div key={review.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                                    <div className="card-body">
                                        {/* Star Rating */}
                                        <div className="flex justify-center mb-4">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FaStar
                                                    key={star}
                                                    className={`text-xl ${star <= review.rating ? 'text-warning' : 'text-gray-300'}`}
                                                />
                                            ))}
                                        </div>

                                        {/* Review Comment */}
                                        <p className="text-gray-600 text-center mb-6 italic">
                                            "{review.comment}"
                                        </p>

                                        {/* User Info */}
                                        <div className="flex items-center justify-center gap-3 pt-4 border-t">
                                            <div className="avatar placeholder">
                                                <div className="bg-primary text-primary-content rounded-full w-12">
                                                    <FaUser className="text-xl" />
                                                </div>
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-sm">{review.userName}</div>
                                                <div className="text-xs text-gray-500">
                                                    ID: {review.userId.substring(0, 8)}...
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {new Date(review.createdAt || review.date).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FaStar className="text-6xl text-gray-300 mx-auto mb-4" />
                            <h3 className="text-2xl font-medium mb-2">No Reviews Yet</h3>
                            <p className="text-gray-500 mb-6">
                                Be the first to share your experience with our platform!
                            </p>
                            <Link to="/signup" className="btn btn-primary">
                                Join Now
                            </Link>
                        </div>
                    )}
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
                        {/* 
                         <Link to="/signup" className="btn btn-secondary btn-lg">
                            <FaUsers className="mr-2" />
                            Join as Donor
                        </Link>
                        <Link to="/charities/register" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary">
                            Register Charity
                        </Link>
                         */}

                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;