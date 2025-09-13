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

            <div className="min-h-screen bg-base-200 pt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold mb-4">Register Your Charity</h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Join our platform to start fundraising campaigns and connect with donors who want to make a difference
                            </p>
                        </div>

                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="text-center mb-8">
                                    <FaBuilding className="text-6xl text-primary mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold mb-2">Charity Registration Form</h2>
                                    <p className="text-gray-600">
                                        Complete the form below to register your charity organization
                                    </p>
                                </div>

                                <form className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Organization Name *</span>
                                            </label>
                                            <input type="text" className="input input-bordered" placeholder="Enter organization name" required />
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Registration Number *</span>
                                            </label>
                                            <input type="text" className="input input-bordered" placeholder="Government registration number" required />
                                        </div>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Organization Description *</span>
                                        </label>
                                        <textarea className="textarea textarea-bordered h-32" placeholder="Describe your organization's mission and work" required></textarea>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Contact Email *</span>
                                            </label>
                                            <input type="email" className="input input-bordered" placeholder="contact@organization.org" required />
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Phone Number *</span>
                                            </label>
                                            <input type="tel" className="input input-bordered" placeholder="+880-XXX-XXXXXXX" required />
                                        </div>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Website</span>
                                        </label>
                                        <input type="url" className="input input-bordered" placeholder="https://www.organization.org" />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Address *</span>
                                        </label>
                                        <textarea className="textarea textarea-bordered h-24" placeholder="Enter complete address" required></textarea>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Focus Areas *</span>
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            {['Education', 'Healthcare', 'Emergency Relief', 'Women Empowerment', 'Environment', 'Children', 'Elderly Care', 'Animal Welfare'].map((area) => (
                                                <label key={area} className="flex items-center gap-2">
                                                    <input type="checkbox" className="checkbox checkbox-primary" />
                                                    <span className="text-sm">{area}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Upload Documents *</span>
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <FaUpload className="text-4xl text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 mb-2">Upload required documents</p>
                                            <p className="text-sm text-gray-500 mb-4">
                                                Registration Certificate, Tax Exemption Certificate, Bank Account Details
                                            </p>
                                            <input type="file" className="file-input file-input-bordered w-full max-w-xs" multiple />
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

                                <div className="mt-8 p-4 bg-info/10 rounded-lg">
                                    <h3 className="font-bold mb-2">What happens next?</h3>
                                    <ul className="text-sm text-gray-600 space-y-1">
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
