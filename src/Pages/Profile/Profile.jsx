import React from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../provider/authProvider';
import { FaUser, FaEnvelope, FaCalendarAlt, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';

const Profile = () => {
    const { currentUser, userRole } = useAuth();

    return (
        <>
            <Helmet>
                <title>Profile - Charity Platform</title>
            </Helmet>

            <div className="min-h-screen bg-base-200 pt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex items-center justify-between mb-8">
                                    <h1 className="text-3xl font-bold">Profile</h1>
                                    <button className="btn btn-outline">
                                        <FaEdit className="mr-2" />
                                        Edit Profile
                                    </button>
                                </div>

                                <div className="grid lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-1">
                                        <div className="text-center">
                                            <div className="avatar mb-4">
                                                <div className="w-32 rounded-full">
                                                    <img src={currentUser?.photoURL || "/api/placeholder/128/128"} alt="Profile" />
                                                </div>
                                            </div>
                                            <h2 className="text-2xl font-bold">{currentUser?.displayName || 'User'}</h2>
                                            <p className="text-gray-600 capitalize">{userRole}</p>
                                            <div className="badge badge-success mt-2">Verified</div>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-2">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <FaEnvelope className="text-primary text-xl" />
                                                <div>
                                                    <h3 className="font-semibold">Email</h3>
                                                    <p className="text-gray-600">{currentUser?.email}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <FaCalendarAlt className="text-primary text-xl" />
                                                <div>
                                                    <h3 className="font-semibold">Member Since</h3>
                                                    <p className="text-gray-600">January 2024</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <FaMapMarkerAlt className="text-primary text-xl" />
                                                <div>
                                                    <h3 className="font-semibold">Location</h3>
                                                    <p className="text-gray-600">Dhaka, Bangladesh</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <FaUser className="text-primary text-xl" />
                                                <div>
                                                    <h3 className="font-semibold">Account Type</h3>
                                                    <p className="text-gray-600 capitalize">{userRole}</p>
                                                </div>
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

export default Profile;
