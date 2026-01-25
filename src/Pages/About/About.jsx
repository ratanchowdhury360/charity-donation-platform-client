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
                <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-20">
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
                            <div className="rounded-lg p-8 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-indigo-500/20 border border-purple-400/30">
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

                            <div className="rounded-lg p-8 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-indigo-500/20 border border-purple-400/30">
    <div className="text-center">
        <FaHeart className="text-6xl text-pink-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-3">Making Impact</h3>

        <p className="text-white/80 mb-3">
            Every donation, no matter how small, creates ripples of positive change. We make it easy to
            discover causes, track progress, and contribute meaningfully.
        </p>

        <p className="text-white/80 mb-3">
            By connecting compassionate donors with verified charities, we ensure that help reaches
            the right people at the right time.
        </p>

        <p className="text-white/70 text-sm">
            Together, we turn kindness into action and transform generosity into lasting social impact.
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

                            <div className="card bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 shadow-xl border border-indigo-400/30">
                                <div className="card-body">
                                    <h2 className="text-3xl font-bold mb-3">Our Vision</h2>
                                    <p className="text-white/80 leading-relaxed">
                                        Our vision is to build a trustworthy digital ecosystem that encourages social responsibility and
                                        maximizes the positive impact of charitable contributions. We aspire to become a leading platform
                                        where technology and compassion work together to drive sustainable social change.
                                    </p>
                                </div>
                            </div>

                            <div className="card bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-indigo-500/20 shadow-xl border border-pink-400/30">
                                <div className="card-body">
                                    <h2 className="text-3xl font-bold mb-3">Objectives of the Platform</h2>
                                    <ul className="space-y-3 text-white/80 font-medium">
                                        <li className="flex gap-3"><span className="mt-1 w-2 h-2 rounded-full bg-pink-400"></span>Provide a secure and user-friendly donation system</li>
                                        <li className="flex gap-3"><span className="mt-1 w-2 h-2 rounded-full bg-indigo-400"></span>Ensure transparency through real-time fund tracking</li>
                                        <li className="flex gap-3"><span className="mt-1 w-2 h-2 rounded-full bg-purple-400"></span>Verify charities and campaigns before public listing</li>
                                        <li className="flex gap-3"><span className="mt-1 w-2 h-2 rounded-full bg-pink-400"></span>Facilitate fast and flexible donation methods</li>
                                        <li className="flex gap-3"><span className="mt-1 w-2 h-2 rounded-full bg-indigo-400"></span>Support long-term engagement between donors and charities</li>
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
                            <h2 className="text-4xl font-bold mb-4">How the Platform Works</h2>
                            <p className="text-lg text-white/80 max-w-3xl mx-auto">
                                A simple flow that keeps both donors and charities informed, while admins maintain platform trust.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                'Secure Authentication',
                                'Verified Campaigns',
                                'Donate & Track',
                                'Notifications & Updates',
                                'Admin Moderation',
                                'Long-Term Engagement'
                            ].map((title, i) => (
                                <div
                                    key={i}
                                    className="card bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 shadow-xl border border-purple-400/30"
                                >
                                    <div className="card-body">
                                        <h3 className="text-xl font-bold">{i + 1}. {title}</h3>
                                        <p className="text-white/80">
                                            Built to ensure trust, transparency, and accountability across the platform.
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="py-20 border border-purple-400/20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
                            <p className="text-xl text-white/80 max-w-2xl mx-auto">
                                The principles that guide everything we do
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                            {[FaShieldAlt, FaUsers, FaHandHoldingHeart, FaHeart].map((Icon, i) => (
                                <div key={i}>
                                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Icon className="text-3xl text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">
                                        {['Trust & Transparency', 'Community First', 'Compassion', 'Impact'][i]}
                                    </h3>
                                    <p className="text-white/80">
                                        {[
                                            'We verify all charities and provide complete transparency.',
                                            'Built for the community and driven by real needs.',
                                            'Empathy and understanding guide every interaction.',
                                            'Every decision is made to maximize positive impact.'
                                        ][i]}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4">Our Team</h2>
                            <p className="text-xl text-white max-w-2xl mx-auto">
                                Passionate individuals working together to make a difference
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                ['Md. Ratan Chowdhury', 'Founder & CEO'],
                                ['Nayeem Khan', 'CTO'],
                                ['Golam Rabbi', 'Head of Operations']
                            ].map(([name, role], i) => (
                                <div
                                    key={i}
                                    className="card bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 shadow-xl border border-purple-400/30"
                                >
                                    <div className="card-body text-center">
                                        <h3 className="card-title justify-center">{name}</h3>
                                        <p className="text-pink-400 font-semibold">{role}</p>
                                        <p className="text-white/80">
                                            Passionate about using technology for social good.
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
                        <p className="text-xl max-w-2xl mx-auto">
                            Whether you're a donor or a charity, together we can make a difference.
                        </p>
                    </div>
                </section>

            </div>
        </>
    );
};

export default About;
