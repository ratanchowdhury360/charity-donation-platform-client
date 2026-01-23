import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FaHeart, FaShieldAlt, FaUsers, FaHandHoldingHeart } from 'react-icons/fa';

const About = () => {
    return (
        <>
            <Helmet>
                <title>About Us - Charity Donation Platform</title>
                <meta name="description" content="Learn about our mission to connect donors with verified charity organizations and make a positive impact in communities across Bangladesh." />
            </Helmet>

            <div className="min-h-screen bg-base-200 pt-20">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-5xl font-bold mb-6">About Our Platform</h1>
                        <p className="text-xl max-w-3xl mx-auto">
                            Our Charity Donation Platform is a web-based system designed to bridge the gap between donors
                            and verified charitable organizations. We focus on transparency, security, and accountability so
                            people can donate with confidence and create real social impact.
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
                                <p className="text-lg text-white/80 mb-6">
                                    Our mission is to simplify the donation process while ensuring transparency and trust.
                                    We empower donors with clear insights into how funds are collected, managed, and utilized,
                                    and support charitable organizations with efficient digital tools for campaign management.
                                </p>
                                <p className="text-lg text-white/80">
                                    We believe technology can be a powerful force for good, helping build stronger and more compassionate
                                    communities through reliable, accountable digital giving.
                                </p>
                            </div>
                            <div className="bg-primary/10 rounded-lg p-8">
                                <div className="text-center">
                                    <FaHeart className="text-6xl text-primary mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold mb-2">Making Impact</h3>
                                    <p className="text-white/80">
                                        Every donation, no matter how small, creates ripples of positive change. We make it easy to
                                        discover causes, track progress, and contribute meaningfully.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Vision + Objectives */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-10">
                            <div className="card bg-gradient-to-br from-white via-primary/10 to-secondary/10 shadow-xl border-2 border-primary/20">
                                <div className="card-body">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Vision</h2>
                                    <p className="text-gray-700 leading-relaxed">
                                        Our vision is to build a trustworthy digital ecosystem that encourages social responsibility and
                                        maximizes the positive impact of charitable contributions. We aspire to become a leading platform
                                        where technology and compassion work together to drive sustainable social change.
                                    </p>
                                </div>
                            </div>

                            <div className="card bg-gradient-to-br from-white via-secondary/10 to-accent/10 shadow-xl border-2 border-secondary/20">
                                <div className="card-body">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Objectives of the Platform</h2>
                                    <ul className="space-y-3 text-gray-800 font-medium">
                                        <li className="flex gap-3">
                                            <span className="mt-1 w-2 h-2 rounded-full bg-primary"></span>
                                            <span>Provide a secure and user-friendly donation system</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="mt-1 w-2 h-2 rounded-full bg-success"></span>
                                            <span>Ensure transparency through real-time fund tracking</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="mt-1 w-2 h-2 rounded-full bg-secondary"></span>
                                            <span>Verify charities and campaigns before public listing</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="mt-1 w-2 h-2 rounded-full bg-accent"></span>
                                            <span>Facilitate fast and flexible donation methods</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="mt-1 w-2 h-2 rounded-full bg-info"></span>
                                            <span>Support long-term engagement between donors and charities</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold mb-4 text-white">How the Platform Works</h2>
                            <p className="text-lg text-white/80 max-w-3xl mx-auto">
                                A simple flow that keeps both donors and charities informed, while admins maintain platform trust.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="card bg-gradient-to-br from-white via-primary/10 to-base-100 shadow-xl border-2 border-primary/20">
                                <div className="card-body">
                                    <h3 className="text-xl font-bold text-gray-900">1. Secure Authentication</h3>
                                    <p className="text-gray-700">
                                        Donors register or log in securely using email/password or Google authentication.
                                    </p>
                                </div>
                            </div>
                            <div className="card bg-gradient-to-br from-white via-secondary/10 to-base-100 shadow-xl border-2 border-secondary/20">
                                <div className="card-body">
                                    <h3 className="text-xl font-bold text-gray-900">2. Verified Campaigns</h3>
                                    <p className="text-gray-700">
                                        Charitable organizations create campaigns after verification and admin approval.
                                    </p>
                                </div>
                            </div>
                            <div className="card bg-gradient-to-br from-white via-accent/10 to-base-100 shadow-xl border-2 border-accent/20">
                                <div className="card-body">
                                    <h3 className="text-xl font-bold text-gray-900">3. Donate & Track</h3>
                                    <p className="text-gray-700">
                                        Donors browse campaigns, view progress, and make secure donations with real-time updates.
                                    </p>
                                </div>
                            </div>
                            <div className="card bg-gradient-to-br from-white via-info/10 to-base-100 shadow-xl border-2 border-info/20">
                                <div className="card-body">
                                    <h3 className="text-xl font-bold text-gray-900">4. Notifications & Updates</h3>
                                    <p className="text-gray-700">
                                        Real-time updates and notifications keep users informed about campaign progress and replies.
                                    </p>
                                </div>
                            </div>
                            <div className="card bg-gradient-to-br from-white via-success/10 to-base-100 shadow-xl border-2 border-success/20">
                                <div className="card-body">
                                    <h3 className="text-xl font-bold text-gray-900">5. Admin Moderation</h3>
                                    <p className="text-gray-700">
                                        Admins monitor platform activity to ensure compliance, trust, and transparency.
                                    </p>
                                </div>
                            </div>
                            <div className="card bg-gradient-to-br from-white via-warning/10 to-base-100 shadow-xl border-2 border-warning/20">
                                <div className="card-body">
                                    <h3 className="text-xl font-bold text-gray-900">6. Long-Term Engagement</h3>
                                    <p className="text-gray-700">
                                        Donors and charities stay connected through dashboards, progress history, and future updates.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-20 border">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
                            <p className="text-xl text-white/80 max-w-2xl mx-auto">
                                The principles that guide everything we do
                            </p>
                        </div>

                        <div className="   grid  md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FaShieldAlt className="text-3xl text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">Trust & Transparency</h3>
                                <p className="text-white/80">
                                    We verify all charities and provide complete transparency in how donations are used.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FaUsers className="text-3xl text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">Community First</h3>
                                <p className="text-white/80">
                                    Our platform is built for and by the community, prioritizing local needs and impact.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FaHandHoldingHeart className="text-3xl text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">Compassion</h3>
                                <p className="text-white/80">
                                    We approach every interaction with empathy and understanding for those in need.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-20 h-20 bg-info rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FaHeart className="text-3xl text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">Impact</h3>
                                <p className="text-white/80">
                                    Every feature and decision is made with the goal of maximizing positive impact.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Features + Security + Tech */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-10">
                            <div className="card bg-gradient-to-br from-white via-primary/10 to-secondary/10 shadow-xl border-2 border-primary/20">
                                <div className="card-body">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Key Features</h2>
                                    <ul className="space-y-3 text-gray-800 font-medium">
                                        <li className="flex gap-3"><span className="mt-1 w-2 h-2 rounded-full bg-primary"></span><span>Role-based dashboards for donors, charities, and administrators</span></li>
                                        <li className="flex gap-3"><span className="mt-1 w-2 h-2 rounded-full bg-secondary"></span><span>Secure authentication and access control</span></li>
                                        <li className="flex gap-3"><span className="mt-1 w-2 h-2 rounded-full bg-success"></span><span>Real-time donation progress visualization</span></li>
                                        <li className="flex gap-3"><span className="mt-1 w-2 h-2 rounded-full bg-info"></span><span>Campaign updates, notifications, and impact reporting</span></li>
                                        <li className="flex gap-3"><span className="mt-1 w-2 h-2 rounded-full bg-accent"></span><span>Review and rating system to promote accountability</span></li>
                                    </ul>
                                </div>
                            </div>

                            <div className="card bg-gradient-to-br from-white via-success/10 to-secondary/10 shadow-xl border-2 border-success/20">
                                <div className="card-body">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Security & Transparency</h2>
                                    <p className="text-gray-700 leading-relaxed">
                                        The platform follows industry-standard security practices, including encrypted authentication,
                                        role-based access control, and secure transaction handling. Charity verification workflows and
                                        admin moderation further ensure transparency and fraud prevention.
                                    </p>
                                </div>
                            </div>

                            <div className="card bg-gradient-to-br from-white via-accent/10 to-info/10 shadow-xl border-2 border-accent/20 lg:col-span-2">
                                <div className="card-body">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Technology-Driven Impact</h2>
                                    <p className="text-gray-700 leading-relaxed">
                                        Built using modern web technologies such as React, Node.js, MongoDB, and Firebase, the platform
                                        delivers a responsive user experience, scalable performance, and secure data handling. These
                                        technologies enable real-time interactions and reliable system performance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Commitment + Future */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-10">
                            <div className="card bg-gradient-to-br from-white via-primary/10 to-base-100 shadow-xl border-2 border-primary/20">
                                <div className="card-body">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Commitment</h2>
                                    <p className="text-gray-700 leading-relaxed">
                                        We are committed to continuous improvement, ethical data handling, and user trust. Feedback from
                                        donors and charities plays a vital role in refining the platform and expanding its capabilities.
                                    </p>
                                </div>
                            </div>
                            <div className="card bg-gradient-to-br from-white via-warning/10 to-secondary/10 shadow-xl border-2 border-warning/20">
                                <div className="card-body">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Future Direction</h2>
                                    <p className="text-gray-700 leading-relaxed">
                                        Next, we aim to introduce advanced analytics, AI-based fraud detection, mobile application
                                        support, and international payment expansions to further enhance user experience and social impact.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl  font-bold mb-4">Our Team</h2>
                            <p className="text-xl text-white max-w-2xl mx-auto">
                                Passionate individuals working together to make a difference
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="card bg-blue-300 shadow-xl">
                                <div className="card-body text-center">
                                    <div className="avatar mb-4">
                                        <div className="w-24 rounded-full mx-auto">
                                         {/*    <img src="/api/placeholder/96/96" alt="Team Member" /> */}
                                        </div>
                                    </div>
                                    <h3 className="card-title text-black justify-center">Md. Ratan Chowdhury</h3>
                                    <p className="text-primary font-semibold">Founder & CEO</p>
                                    <p className="text-gray-600">
                                        Passionate about using technology to solve social problems and create positive change.
                                    </p>
                                </div>
                            </div>

                            <div className="card bg-blue-300 shadow-xl">
                                <div className="card-body text-center">
                                    <div className="avatar mb-4">
                                        <div className="w-24 rounded-full mx-auto">
                                            {/* <img src="/api/placeholder/96/96" alt="Team Member" /> */}
                                        </div>
                                    </div>
                                    <h3 className="card-title text-black justify-center">Nayeem Khan</h3>
                                    <p className="text-primary font-semibold">CTO</p>
                                    <p className="text-gray-600">
                                        Technology enthusiast focused on building secure and scalable solutions for social impact.
                                    </p>
                                </div>
                            </div>

                            <div className="card bg-blue-300 shadow-xl">
                                <div className="card-body text-center">
                                    <div className="avatar mb-4">
                                        <div className="w-24 rounded-full mx-auto">
                                            {/* <img src="/api/placeholder/96/96" alt="Team Member" /> */}
                                        </div>
                                    </div>
                                    <h3 className="card-title text-black justify-center">Golam Rabbi</h3>
                                    <p className="text-primary font-semibold">Head of Operations</p>
                                    <p className="text-gray-600">
                                        Dedicated to ensuring smooth operations and maintaining the highest standards of service.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-primary text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            Whether you're a donor looking to make an impact or a charity seeking support, 
                            we're here to help you make a difference.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {/* Future CTA buttons can be added here */}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default About;
