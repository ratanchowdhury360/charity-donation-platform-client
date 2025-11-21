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
                            We're building a bridge between generous donors and verified charity organizations 
                            to create meaningful impact in communities across Bangladesh.
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
                                <p className="text-lg text-gray-600 mb-6">
                                    To create a transparent, secure, and efficient platform that connects donors 
                                    with verified charity organizations, ensuring that every donation makes 
                                    a real difference in the lives of those who need it most.
                                </p>
                                <p className="text-lg text-gray-600">
                                    We believe that technology can be a powerful force for good, and we're 
                                    committed to using it to build stronger, more compassionate communities.
                                </p>
                            </div>
                            <div className="bg-primary/10 rounded-lg p-8">
                                <div className="text-center">
                                    <FaHeart className="text-6xl text-primary mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold mb-2">Making Impact</h3>
                                    <p className="text-gray-600">
                                        Every donation, no matter how small, creates ripples of positive change 
                                        in our communities.
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
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                The principles that guide everything we do
                            </p>
                        </div>

                        <div className="   grid  md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FaShieldAlt className="text-3xl text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">Trust & Transparency</h3>
                                <p className="text-gray-600">
                                    We verify all charities and provide complete transparency in how donations are used.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FaUsers className="text-3xl text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">Community First</h3>
                                <p className="text-gray-600">
                                    Our platform is built for and by the community, prioritizing local needs and impact.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FaHandHoldingHeart className="text-3xl text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">Compassion</h3>
                                <p className="text-gray-600">
                                    We approach every interaction with empathy and understanding for those in need.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-20 h-20 bg-info rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FaHeart className="text-3xl text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">Impact</h3>
                                <p className="text-gray-600">
                                    Every feature and decision is made with the goal of maximizing positive impact.
                                </p>
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
                                            <img src="/api/placeholder/96/96" alt="Team Member" />
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
                                            <img src="/api/placeholder/96/96" alt="Team Member" />
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
                                            <img src="/api/placeholder/96/96" alt="Team Member" />
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
                            <button className="btn btn-secondary btn-lg">
                                Start Donating
                            </button>
                            <button className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary">
                                Register Charity
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default About;
