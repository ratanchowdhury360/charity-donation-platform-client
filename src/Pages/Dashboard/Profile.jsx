import React, { useState, useEffect } from 'react';
import { useAuth } from '../../provider/authProvider';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaEdit, FaSave, FaTimes, FaUserTag, FaIdCard, FaClock, FaShieldAlt } from 'react-icons/fa';

export default function Profile() {
    const { currentUser, updateUserProfile, userRole } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        phone: '',
        location: '',
        bio: ''
    });

    // Initialize form data when currentUser changes
    useEffect(() => {
        if (currentUser) {
            setFormData({
                displayName: currentUser.displayName || '',
                email: currentUser.email || '',
                phone: currentUser.phoneNumber || '',
                location: currentUser.location || 'Not specified',
                bio: currentUser.bio || 'No bio added yet.'
            });
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUserProfile(formData);
            setIsEditing(false);
            // Show success message
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    if (!currentUser) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">My Profile</h1>
                {!isEditing ? (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="btn btn-primary btn-sm"
                    >
                        <FaEdit className="mr-1" /> Edit Profile
                    </button>
                ) : (
                    <div className="space-x-2">
                        <button 
                            onClick={() => setIsEditing(false)}
                            className="btn btn-ghost btn-sm"
                        >
                            <FaTimes className="mr-1" /> Cancel
                        </button>
                        <button 
                            type="submit" 
                            form="profileForm"
                            className="btn btn-primary btn-sm"
                        >
                            <FaSave className="mr-1" /> Save Changes
                        </button>
                    </div>
                )}
            </div>

            {/* User Login Info Card */}
            <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 shadow-lg border-2 border-primary/20">
                <div className="card-body">
                    <h2 className="card-title text-xl mb-4 flex items-center gap-2">
                        <FaShieldAlt className="text-primary" />
                        Account Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-base-100 p-4 rounded-lg shadow">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <FaUserTag className="text-primary" />
                                <span className="text-sm font-medium">Account Type</span>
                            </div>
                            <p className="text-lg font-bold capitalize">{userRole || 'User'}</p>
                        </div>
                        <div className="bg-base-100 p-4 rounded-lg shadow">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <FaIdCard className="text-secondary" />
                                <span className="text-sm font-medium">User ID</span>
                            </div>
                            <p className="text-sm font-mono break-all">{currentUser.uid}</p>
                        </div>
                        <div className="bg-base-100 p-4 rounded-lg shadow">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <FaCalendarAlt className="text-success" />
                                <span className="text-sm font-medium">Joined</span>
                            </div>
                            <p className="text-sm">
                                {new Date(currentUser.metadata?.creationTime || new Date()).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                        <div className="bg-base-100 p-4 rounded-lg shadow">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <FaClock className="text-info" />
                                <span className="text-sm font-medium">Last Login</span>
                            </div>
                            <p className="text-sm">
                                {new Date(currentUser.metadata?.lastSignInTime || new Date()).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 p-3 bg-base-100 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <FaEnvelope className="text-accent" />
                            <span className="text-sm font-medium">Email Address</span>
                        </div>
                        <p className="text-base font-semibold">{currentUser.email}</p>
                        <div className="mt-2">
                            {currentUser.emailVerified ? (
                                <span className="badge badge-success gap-1">
                                    <FaShieldAlt /> Verified
                                </span>
                            ) : (
                                <span className="badge badge-warning gap-1">
                                    <FaClock /> Not Verified
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Details Card */}
            <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                    <h2 className="card-title text-xl mb-4">Profile Details</h2>
                    <form id="profileForm" onSubmit={handleSubmit}>
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Profile Picture */}
                            <div className="flex-shrink-0">
                                <div className="avatar">
                                    <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                        <img 
                                            src={currentUser.photoURL || '/api/placeholder/150/150'} 
                                            alt="Profile"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/150';
                                            }}
                                        />
                                    </div>
                                </div>
                                {isEditing && (
                                    <div className="mt-4">
                                        <label className="btn btn-sm btn-outline w-full">
                                            Change Photo
                                            <input type="file" className="hidden" />
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Profile Details */}
                            <div className="flex-1 space-y-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Full Name</span>
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="displayName"
                                            value={formData.displayName}
                                            onChange={handleChange}
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <FaUser className="text-gray-400" />
                                            <span>{formData.displayName || 'Not specified'}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Email</span>
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <FaEnvelope className="text-gray-400" />
                                            <span>{currentUser.email}</span>
                                        </div>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Phone</span>
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="input input-bordered w-full"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <FaPhone className="text-gray-400" />
                                                <span>{formData.phone || 'Not specified'}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Location</span>
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                className="input input-bordered w-full"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-gray-400" />
                                                <span>{formData.location || 'Not specified'}</span>
                                            </div>
                                        )}
                                    </div>

                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Bio</span>
                                    </label>
                                    {isEditing ? (
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            className="textarea textarea-bordered h-24"
                                            placeholder="Tell us about yourself..."
                                        ></textarea>
                                    ) : (
                                        <p className="text-gray-600 whitespace-pre-line">
                                            {formData.bio || 'No bio added yet.'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Account Settings */}
            <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                    <h2 className="card-title text-lg mb-4">Account Settings</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-base-200 rounded-lg">
                            <div>
                                <h3 className="font-medium">Change Password</h3>
                                <p className="text-sm text-gray-500">Update your account password</p>
                            </div>
                            <button className="btn btn-ghost btn-sm">Change</button>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-base-200 rounded-lg">
                            <div>
                                <h3 className="font-medium">Notification Settings</h3>
                                <p className="text-sm text-gray-500">Manage your notification preferences</p>
                            </div>
                            <button className="btn btn-ghost btn-sm">Manage</button>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-base-200 rounded-lg">
                            <div>
                                <h3 className="font-medium">Delete Account</h3>
                                <p className="text-sm text-gray-500">Permanently delete your account</p>
                            </div>
                            <button className="btn btn-error btn-sm">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
