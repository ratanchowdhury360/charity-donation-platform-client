import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FaPlus, FaUpload, FaCalendarAlt } from 'react-icons/fa';

const CreateCampaign = () => {
    return (
        <>
            <Helmet>
                <title>Create Campaign - Charity Platform</title>
            </Helmet>

            <div className="min-h-screen bg-base-200 pt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold mb-4">Create New Campaign</h1>
                            <p className="text-xl text-gray-600">
                                Start a fundraising campaign to support your cause
                            </p>
                        </div>

                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="text-center mb-8">
                                    <FaPlus className="text-6xl text-primary mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold mb-2">Campaign Creation Form</h2>
                                    <p className="text-gray-600">
                                        Fill out the details below to create your campaign
                                    </p>
                                </div>

                                <form className="space-y-6">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Campaign Title *</span>
                                        </label>
                                        <input type="text" className="input input-bordered" placeholder="Enter campaign title" required />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Category *</span>
                                        </label>
                                        <select className="select select-bordered" required>
                                            <option value="">Select category</option>
                                            <option value="education">Education</option>
                                            <option value="healthcare">Healthcare</option>
                                            <option value="emergency">Emergency Relief</option>
                                            <option value="women">Women Empowerment</option>
                                            <option value="environment">Environment</option>
                                            <option value="children">Children</option>
                                            <option value="elderly">Elderly Care</option>
                                            <option value="animals">Animal Welfare</option>
                                        </select>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Short Description *</span>
                                        </label>
                                        <textarea className="textarea textarea-bordered h-24" placeholder="Brief description of your campaign" required></textarea>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Detailed Story *</span>
                                        </label>
                                        <textarea className="textarea textarea-bordered h-32" placeholder="Tell your story in detail" required></textarea>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Funding Goal (BDT) *</span>
                                            </label>
                                            <input type="number" className="input input-bordered" placeholder="Enter amount" min="1000" required />
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Campaign Duration (Days) *</span>
                                            </label>
                                            <input type="number" className="input input-bordered" placeholder="30" min="7" max="365" required />
                                        </div>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Campaign Images *</span>
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <FaUpload className="text-4xl text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 mb-2">Upload campaign images</p>
                                            <p className="text-sm text-gray-500 mb-4">Upload at least 3 images (max 5)</p>
                                            <input type="file" className="file-input file-input-bordered w-full max-w-xs" multiple accept="image/*" />
                                        </div>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Urgency Level *</span>
                                        </label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2">
                                                <input type="radio" name="urgency" value="low" className="radio radio-primary" />
                                                <span>Low Priority</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input type="radio" name="urgency" value="medium" className="radio radio-primary" />
                                                <span>Moderate</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input type="radio" name="urgency" value="high" className="radio radio-primary" />
                                                <span>Urgent</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Tags</span>
                                        </label>
                                        <input type="text" className="input input-bordered" placeholder="Enter tags separated by commas" />
                                    </div>

                                    <button type="submit" className="btn btn-primary w-full btn-lg">
                                        <FaPlus className="mr-2" />
                                        Create Campaign
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateCampaign;
