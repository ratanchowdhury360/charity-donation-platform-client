import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FaBuilding, FaUpload, FaCheck } from 'react-icons/fa';

const RegisterCharity = () => {
    return (
        <>
            <Helmet>
                <title>Register Your Charity - Charity Platform</title>
                <meta name="description" content="Register your charity organization to start fundraising campaigns and connect with donors." />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5 pt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">Register Your Charity</h1>
                            <p className="text-xl text-gray-800 max-w-2xl mx-auto font-medium">
                                Join our platform to start fundraising campaigns and connect with donors who want to make a difference
                            </p>
                        </div>

                        <div className="card bg-gradient-to-br from-white via-primary/10 to-secondary/10 shadow-xl border-2 border-primary/20">
                            <div className="card-body">
                                <div className="text-center mb-8">
                                    <FaBuilding className="text-6xl text-primary mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold mb-2 text-gray-900">Charity Registration Form</h2>
                                    <p className="text-gray-700 font-medium">
                                        Complete the form below to register your charity organization
                                    </p>
                                </div>

                                <form className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold text-gray-900">Organization Name *</span>
                                        </label>
                                        <input type="text" className="input input-bordered bg-white border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary text-gray-900" placeholder="Enter organization name" required />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold text-gray-900">Registration Number *</span>
                                        </label>
                                        <input type="text" className="input input-bordered bg-white border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary text-gray-900" placeholder="Government registration number" required />
                                    </div>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold text-gray-900">Organization Description *</span>
                                        </label>
                                        <textarea className="textarea textarea-bordered bg-white border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary text-gray-900 h-32" placeholder="Describe your organization's mission and work" required></textarea>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold text-gray-900">Contact Email *</span>
                                            </label>
                                            <input type="email" className="input input-bordered bg-white border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary text-gray-900" placeholder="contact@organization.org" required />
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold text-gray-900">Phone Number *</span>
                                            </label>
                                            <input type="tel" className="input input-bordered bg-white border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary text-gray-900" placeholder="+880-XXX-XXXXXXX" required />
                                        </div>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold text-gray-900">Website</span>
                                        </label>
                                        <input type="url" className="input input-bordered bg-white border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary text-gray-900" placeholder="https://www.organization.org" />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold text-gray-900">Address *</span>
                                        </label>
                                        <textarea className="textarea textarea-bordered bg-white border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary text-gray-900 h-24" placeholder="Enter complete address" required></textarea>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold text-gray-900">Focus Areas *</span>
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            {['Education', 'Healthcare', 'Emergency Relief', 'Women Empowerment', 'Environment', 'Children', 'Elderly Care', 'Animal Welfare'].map((area) => (
                                                <label key={area} className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/5 p-2 rounded-lg border border-primary/20">
                                                    <input type="checkbox" className="checkbox checkbox-primary" />
                                                    <span className="text-sm text-gray-800 font-medium">{area}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold text-gray-900">Upload Documents *</span>
                                        </label>
                                        <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center bg-gradient-to-br from-primary/5 to-secondary/5">
                                            <FaUpload className="text-4xl text-primary mx-auto mb-4" />
                                            <p className="text-gray-800 mb-2 font-medium">Upload required documents</p>
                                            <p className="text-sm text-gray-700 mb-4 font-medium">
                                                Registration Certificate, Tax Exemption Certificate, Bank Account Details
                                            </p>
                                            <input type="file" className="file-input file-input-bordered w-full max-w-xs bg-white border-primary/30" multiple />
                                        </div>
                                    </div>

                                    <div className="form-control">
                                        <label className="label cursor-pointer">
                                            <input type="checkbox" className="checkbox checkbox-primary" required />
                                            <span className="label-text">
                                                I agree to the terms and conditions and confirm that all information provided is accurate *
                                            </span>
                                        </label>
                                    </div>

                                    <button type="submit" className="btn btn-primary w-full btn-lg">
                                        <FaCheck className="mr-2" />
                                        Submit Registration
                                    </button>
                                </form>

                                <div className="mt-8 p-4 bg-gradient-to-br from-info/20 via-primary/10 to-info/20 rounded-lg border-2 border-info/30">
                                    <h3 className="font-bold mb-2 text-gray-900">What happens next?</h3>
                                    <ul className="text-sm text-gray-800 space-y-1 font-medium">
                                        <li>• We'll review your application within 2-3 business days</li>
                                        <li>• You'll receive an email notification about the status</li>
                                        <li>• Once approved, you can start creating campaigns</li>
                                        <li>• Our team will provide onboarding support</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterCharity;
