import React, { useState, useEffect } from 'react';
import { useAuth } from '../../provider/authProvider';
import { db } from '../../firebase/firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaEdit, FaSave, FaTimes, FaUserTag, FaIdCard, FaClock, FaShieldAlt, FaSpinner } from 'react-icons/fa';

export default function Profile() {
    const { currentUser, updateUserProfile, userRole } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        phone: '',
        location: '',
        bio: ''
    });

    // Initialize form data when currentUser changes
    useEffect(() => {
        const loadUserProfile = async () => {
            if (currentUser) {
                setIsLoading(true);
                try {
                    // Load additional profile data from Firestore
                    const userRef = doc(db, 'users', currentUser.uid);
                    const userSnap = await getDoc(userRef);
                    const userData = userSnap.exists() ? userSnap.data() : {};

                    setFormData({
                        displayName: currentUser.displayName || userData.displayName || '',
                        email: currentUser.email || '',
                        phone: userData.phoneNumber || '',
                        location: userData.location || '',
                        bio: userData.bio || ''
                    });
                    setPhotoPreview(null);
                    setPhotoFile(null);
                } catch (error) {
                    console.error('Error loading user profile:', error);
                    // Fallback to basic data
                    setFormData({
                        displayName: currentUser.displayName || '',
                        email: currentUser.email || '',
                        phone: '',
                        location: '',
                        bio: ''
                    });
                } finally {
                    setIsLoading(false);
                }
            }
        };

        loadUserProfile();
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                const swal = typeof window !== 'undefined' ? window.Swal : null;
                if (swal) {
                    swal.fire({
                        icon: 'error',
                        title: 'Invalid File',
                        text: 'Please select an image file (jpg, png, etc.)'
                    });
                } else {
                    alert('Please select an image file');
                }
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                const swal = typeof window !== 'undefined' ? window.Swal : null;
                if (swal) {
                    swal.fire({
                        icon: 'error',
                        title: 'File Too Large',
                        text: 'Please select an image smaller than 5MB'
                    });
                } else {
                    alert('Please select an image smaller than 5MB');
                }
                return;
            }

            setPhotoFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        try {
            await updateUserProfile(formData, photoFile);
            setIsEditing(false);
            setPhotoFile(null);
            setPhotoPreview(null);
            
            // Show success message with SweetAlert2
            const swal = typeof window !== 'undefined' ? window.Swal : null;
            if (swal) {
                swal.fire({
                    icon: 'success',
                    title: 'Profile Updated!',
                    text: 'Your profile has been updated successfully.',
                    timer: 3000,
                    showConfirmButton: false
                });
            } else {
                alert('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            const swal = typeof window !== 'undefined' ? window.Swal : null;
            if (swal) {
                swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: error.message || 'Failed to update profile. Please try again.'
                });
            } else {
                alert('Failed to update profile. Please try again.');
            }
        } finally {
            setIsUploading(false);
        }
    };

    if (!currentUser || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <FaSpinner className="animate-spin text-4xl text-primary" />
            </div>
        );
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
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <FaSpinner className="mr-1 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FaSave className="mr-1" /> Save Changes
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* User Login Info Card */}
            <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 shadow-lg border-2 border-primary/20">
                <div className="card-body">
                    <h2 className="card-title text-xl mb-4 flex items-center gap-2 ">
                        <FaShieldAlt className="text-primary " />
                        Account Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 p-4 rounded-lg shadow border border-primary/20">
                            <div className="flex items-center gap-2 mb-1">
                                <FaUserTag className="text-white text-lg" />
                                <span className="text-sm font-bold text-white">Account Type</span>
                            </div>
                            <p className="text-lg font-black capitalize text-white">{userRole || 'User'}</p>
                        </div>
                        <div className="bg-gradient-to-br from-secondary/20 via-secondary/10 to-secondary/5 p-4 rounded-lg shadow border border-secondary/20">
                            <div className="flex items-center gap-2 mb-1">
                                <FaIdCard className="text-white text-lg" />
                                <span className="text-sm font-bold text-white">User ID</span>
                            </div>
                            <p className="text-sm font-mono break-all text-white font-semibold">{currentUser.uid}</p>
                        </div>
                        <div className="bg-gradient-to-br from-success/20 via-success/10 to-success/5 p-4 rounded-lg shadow border border-success/20">
                            <div className="flex items-center gap-2 mb-1">
                                <FaCalendarAlt className="text-white text-lg" />
                                <span className="text-sm font-bold text-white">Joined</span>
                            </div>
                            <p className="text-sm font-bold text-white">
                                {new Date(currentUser.metadata?.creationTime || new Date()).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-info/20 via-info/10 to-info/5 p-4 rounded-lg shadow border border-info/20">
                            <div className="flex items-center gap-2 mb-1">
                                <FaClock className="text-white text-lg" />
                                <span className="text-sm font-bold text-white">Last Login</span>
                            </div>
                            <p className="text-sm font-bold text-white">
                                {new Date(currentUser.metadata?.lastSignInTime || new Date()).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 p-3 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/5 rounded-lg border border-accent/20">
                        <div className="flex items-center gap-2 mb-1">
                            <FaEnvelope className="text-white text-lg" />
                            <span className="text-sm font-bold text-white">Email Address</span>
                        </div>
                        <p className="text-base font-black text-white">{currentUser.email}</p>
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
            <div className="card bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5 shadow-lg border border-primary/20">
                <div className="card-body">
                    <h2 className="card-title text-xl mb-4 text-white font-bold">Profile Details</h2>
                    <form id="profileForm" onSubmit={handleSubmit}>
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Profile Picture */}
                            <div className="flex-shrink-0">
                                <div className="avatar">
                                    <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                        <img 
                                            src={photoPreview || currentUser.photoURL || '/api/placeholder/150/150'} 
                                            alt="Profile"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/150';
                                            }}
                                        />
                                    </div>
                                </div>
                                {isEditing && (
                                    <div className="mt-4">
                                        <label className="btn btn-sm btn-primary btn-outline w-full hover:btn-primary cursor-pointer">
                                            {isUploading ? (
                                                <>
                                                    <FaSpinner className="mr-2 animate-spin" />
                                                    Uploading...
                                                </>
                                            ) : (
                                                'Change Photo'
                                            )}
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                disabled={isUploading}
                                            />
                                        </label>
                                        {photoFile && (
                                            <p className="text-xs text-white/80 mt-2 text-center">
                                                {photoFile.name}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Profile Details */}
                            <div className="flex-1 space-y-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold text-white">Full Name</span>
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="displayName"
                                            value={formData.displayName}
                                            onChange={handleChange}
                                            className="input input-bordered w-full focus:input-primary focus:outline-none border-2 bg-white text-gray-900 font-medium"
                                            required
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 p-3 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                                            <FaUser className="text-white text-lg" />
                                            <span className="text-white font-bold">{formData.displayName || 'Not specified'}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-bold text-white">Email</span>
                                        </label>
                                        <div className="flex items-center gap-2 p-3 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                                            <FaEnvelope className="text-white text-lg" />
                                            <span className="text-white font-bold">{currentUser.email}</span>
                                        </div>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-bold text-white">Phone</span>
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="input input-bordered w-full focus:input-primary focus:outline-none border-2 bg-white text-gray-900 font-medium"
                                                placeholder="Enter your phone number"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2 p-3 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                                                <FaPhone className="text-white text-lg" />
                                                <span className="text-white font-bold">{formData.phone || 'Not specified'}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-bold text-white">Location</span>
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                className="input input-bordered w-full focus:input-primary focus:outline-none border-2 bg-white text-gray-900 font-medium"
                                                placeholder="Enter your location"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2 p-3 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                                                <FaMapMarkerAlt className="text-white text-lg" />
                                                <span className="text-white font-bold">{formData.location || 'Not specified'}</span>
                                            </div>
                                        )}
                                    </div>

                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold text-white">Bio</span>
                                    </label>
                                    {isEditing ? (
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            className="textarea textarea-bordered h-24 focus:textarea-primary focus:outline-none border-2 bg-white text-gray-900 font-medium"
                                            placeholder="Tell us about yourself..."
                                        ></textarea>
                                    ) : (
                                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                                            <p className="text-white whitespace-pre-line font-bold">
                                                {formData.bio || 'No bio added yet.'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Account Settings */}
            <div className="card bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5 shadow-lg border border-primary/20">
                <div className="card-body">
                    <h2 className="card-title text-lg mb-4 text-base-content">Account Settings</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg border border-primary/20 hover:border-primary/30 transition-all">
                            <div>
                                <h3 className="font-bold text-white">Change Password</h3>
                                <p className="text-sm text-white/90 font-medium">Update your account password</p>
                            </div>
                            <button className="btn btn-primary btn-sm text-white">Change</button>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-secondary/10 via-secondary/5 to-secondary/10 rounded-lg border border-secondary/20 hover:border-secondary/30 transition-all">
                            <div>
                                <h3 className="font-bold text-white">Notification Settings</h3>
                                <p className="text-sm text-white/90 font-medium">Manage your notification preferences</p>
                            </div>
                            <button className="btn btn-secondary btn-sm text-white">Manage</button>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-error/10 via-error/5 to-error/10 rounded-lg border border-error/20 hover:border-error/30 transition-all">
                            <div>
                                <h3 className="font-bold text-white">Delete Account</h3>
                                <p className="text-sm text-white/90 font-medium">Permanently delete your account</p>
                            </div>
                            <button className="btn btn-error btn-sm text-white">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
