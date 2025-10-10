import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-base-300 text-base-content">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <FaHeart className="text-2xl text-primary" />
                            <h3 className="text-xl font-bold">Charity Donation Platform</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Connecting generous donors with verified charity organizations to create meaningful impact across Bangladesh.
                        </p>
                        <div className="flex gap-3">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-sm btn-ghost hover:btn-primary">
                                <FaFacebook className="text-lg" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-sm btn-ghost hover:btn-primary">
                                <FaTwitter className="text-lg" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-sm btn-ghost hover:btn-primary">
                                <FaLinkedin className="text-lg" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-sm btn-ghost hover:btn-primary">
                                <FaInstagram className="text-lg" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/" className="link link-hover text-sm">Home</Link></li>
                            <li><Link to="/campaigns" className="link link-hover text-sm">Browse Campaigns</Link></li>
                            <li><Link to="/charities" className="link link-hover text-sm">Charities</Link></li>
                            <li><Link to="/about" className="link link-hover text-sm">About Us</Link></li>
                            <li><Link to="/contact" className="link link-hover text-sm">Contact</Link></li>
                        </ul>
                    </div>

                    {/* For Users */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">For Users</h4>
                        <ul className="space-y-2">
                            <li><Link to="/signup" className="link link-hover text-sm">Create Account</Link></li>
                            <li><Link to="/login" className="link link-hover text-sm">Login</Link></li>
                            <li><Link to="/charities/register" className="link link-hover text-sm">Register Charity</Link></li>
                            <li><Link to="/dashboard" className="link link-hover text-sm">Dashboard</Link></li>
                            <li><a href="#" className="link link-hover text-sm">Help & Support</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-sm">
                                <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" />
                                <span>Gulshan-1, Dhaka 1212<br />Bangladesh</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                                <FaPhone className="text-primary flex-shrink-0" />
                                <span>+880 1700-000000</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                                <FaEnvelope className="text-primary flex-shrink-0" />
                                <span>support@charitydonation.bd</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="divider"></div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-600">
                        © {new Date().getFullYear()} Charity Donation Platform. All rights reserved.
                    </p>
                    <div className="flex gap-4 text-sm">
                        <a href="#" className="link link-hover">Privacy Policy</a>
                        <a href="#" className="link link-hover">Terms of Service</a>
                        <a href="#" className="link link-hover">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;