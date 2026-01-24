import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Banner from "../Banner/Banner";
import { getCampaigns, getCampaignsByStatus, isCampaignActive } from '../../../utils/campaignStorage';
import { getAllCampaignDonorCounts, getAllDonations } from '../../../utils/donationStorage';
import { getAllReviews } from '../../../utils/reviewStorage';
import { db } from '../../../firebase/firebase.config';
import { collection, getCountFromServer } from 'firebase/firestore';
import {
    FaHeart,
    FaUsers,
    FaHandHoldingHeart,
    FaChartLine,
    FaArrowRight,
    FaStar,
    FaBuilding,
    FaUser,
    FaCheckCircle,
    FaHourglassEnd,
    FaLock
} from 'react-icons/fa';

const fundViewOrder = ['thisMonth', 'lastMonth', 'lastThreeMonths', 'lastYear'];

const formatDateRange = (start, end) => {
    return `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
};

const buildDonationTimeline = (donations = []) => {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    const startOfThreeMonths = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const startOfYear = new Date(now);
    startOfYear.setFullYear(startOfYear.getFullYear() - 1);

    const template = {
        thisMonth: { label: 'This Month', amount: 0, count: 0, rangeText: formatDateRange(startOfCurrentMonth, now) },
        lastMonth: { label: 'Last Month', amount: 0, count: 0, rangeText: formatDateRange(startOfLastMonth, endOfLastMonth) },
        lastThreeMonths: { label: 'Last 3 Months', amount: 0, count: 0, rangeText: formatDateRange(startOfThreeMonths, now) },
        lastYear: { label: 'Last 12 Months', amount: 0, count: 0, rangeText: formatDateRange(startOfYear, now) },
    };

    donations.forEach((donation) => {
        if (!donation?.createdAt) return;
        const donationDate = new Date(donation.createdAt);
        if (Number.isNaN(donationDate.getTime())) return;
        const amount = Number(donation.amount) || 0;

        if (donationDate >= startOfCurrentMonth) {
            template.thisMonth.amount += amount;
            template.thisMonth.count += 1;
        }
        if (donationDate >= startOfLastMonth && donationDate <= endOfLastMonth) {
            template.lastMonth.amount += amount;
            template.lastMonth.count += 1;
        }
        if (donationDate >= startOfThreeMonths) {
            template.lastThreeMonths.amount += amount;
            template.lastThreeMonths.count += 1;
        }
        if (donationDate >= startOfYear) {
            template.lastYear.amount += amount;
            template.lastYear.count += 1;
        }
    });

    return template;
};

const Home = () => {
    const [stats, setStats] = useState({
        totalRaised: 0,
        activeCampaigns: 0,
        totalDonors: 0,
        totalCharities: 0,
        successRate: 0,
        completedCampaigns: 0,
        archivedCampaigns: 0
    });
    const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
    const [donorCounts, setDonorCounts] = useState({});
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [donationTrends, setDonationTrends] = useState(buildDonationTimeline());
    const [fundView, setFundView] = useState('thisMonth');
    const activeFundRange = donationTrends[fundView] || donationTrends.thisMonth;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get all campaigns
                const [allCampaigns, approvedCampaigns, donations] = await Promise.all([
                    getCampaigns(),
                    getCampaignsByStatus('approved'),
                    getAllDonations()
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
                const archivedCampaigns = allCampaigns.filter(c => new Date(c.endDate) < now);
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
                    successRate,
                    completedCampaigns: successfulCampaigns.length,
                    archivedCampaigns: archivedCampaigns.length
                });
                setFeaturedCampaigns(featured);
                setReviews(sortedReviews);
                setDonationTrends(buildDonationTimeline(donations));
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


            {/* Fund Pulse */}
            <section className="pt-6 pb-10 mt-6 ">
                <div className="container mt-10 mx-auto px-4">
                    <div className="card mt-5 shadow-2xl bg-gradient-to-r from-primary to-secondary text-white">
                        <div className="card-body mt-5 flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                            <div className="flex-1">
                                <p className="uppercase text-sm tracking-widest text-white/70">Fundraising pulse</p>
                                <h2 className="text-4xl md:text-5xl font-black mt-2">
                                    ৳{(activeFundRange?.amount || 0).toLocaleString()}
                                </h2>
                                <p className="text-sm text-white/80 mt-1">{activeFundRange?.rangeText}</p>
                                <p className="mt-4 text-sm">
                                    <span className="font-semibold">{activeFundRange?.count || 0}</span> donations recorded in this window
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {fundViewOrder.map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => setFundView(key)}
                                        className={`btn btn-sm border-0 ${fundView === key ? 'btn-secondary text-white' : 'btn-ghost text-white/80 bg-white/10'
                                            }`}
                                    >
                                        {donationTrends[key]?.label}
                                    </button>
                                ))}
                            </div>
                            <Link to="/dashboard" className="btn btn-outline btn-sm text-white border-white hover:bg-white hover:text-primary">
                                View Insights
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 ">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">

      <div className="text-center p-6 rounded-xl shadow-md bg-gradient-to-br from-primary to-primary-focus text-white hover:scale-105 transition-transform">
        <FaHeart className="text-4xl mx-auto mb-3 text-white" />
        <div className="text-3xl font-bold mb-1">
          ৳{stats.totalRaised.toLocaleString()}
        </div>
        <div className="text-sm text-white/80">Total Raised</div>
      </div>

      <div className="text-center p-6 rounded-xl shadow-md bg-gradient-to-br from-secondary to-secondary-focus text-white hover:scale-105 transition-transform">
        <FaChartLine className="text-4xl mx-auto mb-3 text-white" />
        <div className="text-3xl font-bold mb-1">
          {stats.activeCampaigns}
        </div>
        <div className="text-sm text-white/80">Active Campaigns</div>
      </div>

      <div className="text-center p-6 rounded-xl shadow-md bg-gradient-to-br from-accent to-accent-focus text-white hover:scale-105 transition-transform">
        <FaUsers className="text-4xl mx-auto mb-3 text-white" />
        <div className="text-3xl font-bold mb-1">
          {stats.totalDonors}
        </div>
        <div className="text-sm text-white/80">Donors</div>
      </div>

      <div className="text-center p-6 rounded-xl shadow-md bg-gradient-to-br from-info to-info-focus text-white hover:scale-105 transition-transform">
        <FaBuilding className="text-4xl mx-auto mb-3 text-white" />
        <div className="text-3xl font-bold mb-1">
          {stats.totalCharities}
        </div>
        <div className="text-sm text-white/80">Charities</div>
      </div>

      <div className="text-center p-6 rounded-xl shadow-md bg-gradient-to-br from-success to-success-focus text-white hover:scale-105 transition-transform">
        <FaStar className="text-4xl mx-auto mb-3 text-white" />
        <div className="text-3xl font-bold mb-1">
          {stats.successRate}%
        </div>
        <div className="text-sm text-white/80">Success Rate</div>
      </div>

    </div>
  </div>
</section>



            {/* Campaign highlights */}
            <section className="py-12 ">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link
                            to="/campaigns?view=completed"
                            className="card bg-gradient-to-br from-success to-success/80 text-white shadow-xl hover:shadow-2xl transition-shadow"
                        >
                            <div className="card-body">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="uppercase text-xs tracking-wide text-white/80">Completed targets</p>
                                        <h3 className="text-4xl font-black mt-2">{stats.completedCampaigns}</h3>
                                        <p className="text-sm text-white/80">Campaigns that hit 100% of their goals</p>
                                    </div>
                                    <FaCheckCircle className="text-5xl opacity-70" />
                                </div>
                                <p className="mt-4 text-sm">Tap to explore every successful campaign story</p>
                            </div>
                        </Link>

                        <Link
                            to="/campaigns?view=archived"
                            className="card bg-gradient-to-br from-warning to-warning/80 text-white shadow-xl hover:shadow-2xl transition-shadow"
                        >
                            <div className="card-body">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="uppercase text-xs tracking-wide text-white/80">Time-ended campaigns</p>
                                        <h3 className="text-4xl font-black mt-2">{stats.archivedCampaigns}</h3>
                                        <p className="text-sm text-white/80">Ready for admin review & extensions</p>
                                    </div>
                                    <FaHourglassEnd className="text-5xl opacity-70" />
                                </div>
                                <p className="mt-4 text-sm">Click to see which campaigns need a time extension</p>
                            </div>
                        </Link>
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
                                <div key={campaign.id} className="card border  shadow-xl hover:shadow-2xl transition-shadow">
                                    <figure >
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
                                        <p className="text-sm text-white mb-1">By: {campaign.charityName}</p>
                                        <p className="text-white line-clamp-2">{campaign.description}</p>

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
                                            {isCampaignActive(campaign) ? (
                                                <Link to={`/campaigns/${campaign.id}/donate`} className="btn btn-outline btn-sm">
                                                    Donate Now
                                                </Link>
                                            ) : (
                                                <button
                                                    className="btn btn-disabled btn-sm"
                                                    disabled
                                                    title={
                                                        campaign.status !== 'approved' ? 'Campaign Pending Approval' :
                                                            (campaign.currentAmount || 0) >= campaign.goalAmount ? 'Campaign Goal Reached' :
                                                                'Campaign Ended'
                                                    }
                                                >
                                                    <FaLock className="mr-1" /> Donate
                                                </button>
                                            )}
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
            <section className="py-20 border ">
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
            <section className="py-20 border ">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">What People Say (Reviews)</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Real reviews from our community of donors and charities
                        </p>
                    </div>

                    {reviews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {reviews.map((review) => (
                                <div key={review.id} className="card bg-red-500 shadow-xl hover:shadow-2xl transition-shadow">
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
                                        <p className="text-white text-center mb-6 italic">
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
                                                <div className="text-xs text-white">
                                                    ID: {review.userId.substring(0, 8)}...
                                                </div>
                                                <div className="text-xs text-white">
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