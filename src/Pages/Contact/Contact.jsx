import React from 'react';
import { Helmet } from 'react-helmet';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Contact = () => {
    return (
        <>
            <Helmet>
                <title>Contact Us - Charity Donation Platform</title>
                <meta name="description" content="Get in touch with our team. We're here to help with any questions about donations, charity registration, or platform features." />
            </Helmet>

            <div className="min-h-screen bg-base-200 pt-20">
                <div className="container mx-auto px-4 py-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            We're here to help! Reach out to us with any questions or concerns.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title mb-6">Send us a message</h2>
                                <form className="space-y-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Name</span>
                                        </label>
                                        <input type="text" className="input input-bordered" placeholder="Your name" />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Email</span>
                                        </label>
                                        <input type="email" className="input input-bordered" placeholder="your@email.com" />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Subject</span>
                                        </label>
                                        <select className="select select-bordered">
                                            <option>General Inquiry</option>
                                            <option>Donation Support</option>
                                            <option>Charity Registration</option>
                                            <option>Technical Issue</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Message</span>
                                        </label>
                                        <textarea className="textarea textarea-bordered h-32" placeholder="Your message"></textarea>
                                    </div>
                                    <button className="btn btn-primary w-full">Send Message</button>
                                </form>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-8">
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title mb-6">Get in touch</h2>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                                                <FaPhone className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold">Phone</h3>
                                                <p className="text-gray-600">+880-2-1234567</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                                                <FaEnvelope className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold">Email</h3>
                                                <p className="text-gray-600">support@charityplatform.com</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                                                <FaMapMarkerAlt className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold">Address</h3>
                                                <p className="text-gray-600">
                                                    123 Charity Street<br />
                                                    Dhaka 1000, Bangladesh
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                                                <FaClock className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold">Business Hours</h3>
                                                <p className="text-gray-600">
                                                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                                                    Saturday: 10:00 AM - 4:00 PM
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title mb-4">Frequently Asked Questions</h2>
                                    <div className="space-y-4">
                                        <div className="collapse collapse-arrow bg-base-200">
                                            <input type="radio" name="faq" />
                                            <div className="collapse-title font-medium">
                                                How do I verify a charity organization?
                                            </div>
                                            <div className="collapse-content">
                                                <p>All charities on our platform go through a rigorous verification process including document review and background checks.</p>
                                            </div>
                                        </div>
                                        <div className="collapse collapse-arrow bg-base-200">
                                            <input type="radio" name="faq" />
                                            <div className="collapse-title font-medium">
                                                What payment methods do you accept?
                                            </div>
                                            <div className="collapse-content">
                                                <p>We accept bKash, PayPal, Visa, Mastercard, and other major payment methods.</p>
                                            </div>
                                        </div>
                                        <div className="collapse collapse-arrow bg-base-200">
                                            <input type="radio" name="faq" />
                                            <div className="collapse-title font-medium">
                                                How can I track my donation impact?
                                            </div>
                                            <div className="collapse-content">
                                                <p>You can track your donations and their impact through your donor dashboard.</p>
                                            </div>
                                        </div>
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

export default Contact;
