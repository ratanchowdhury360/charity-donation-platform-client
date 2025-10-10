import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../provider/authProvider';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaSpinner, FaImage, FaCalendarAlt, FaMoneyBillWave, FaUniversity } from 'react-icons/fa';
import { addCampaign } from '../../utils/campaignStorage';

const CreateCampaignForm = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            title: '',
            description: '',
            goalAmount: '',
            category: 'education',
            endDate: '',
            bankAccount: ''
        }
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setError('');

            // In a real app, you would upload the image to a storage service here
            // and get back a URL to store in your database
            const imageUrl = imagePreview || 'https://via.placeholder.com/800x400';

            const campaignData = {
                ...data,
                charityId: currentUser.uid,
                charityName: currentUser.displayName || currentUser.email || 'Unknown Charity',
                status: 'pending', // pending, approved, or rejected
                currentAmount: 0,
                donors: 0,
                image: imageUrl,
                goalAmount: parseFloat(data.goalAmount),
                endDate: new Date(data.endDate).toISOString()
            };

            // Save to localStorage (temporary storage until database is implemented)
            const savedCampaign = addCampaign(campaignData);
            console.log('Campaign submitted successfully:', savedCampaign);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Redirect to dashboard with success message
            navigate('/dashboard/charity', { 
                state: { 
                    message: 'Campaign submitted for approval! Admin will review it soon.',
                    type: 'success'
                } 
            });
            
        } catch (error) {
            console.error('Error creating campaign:', error);
            setError('Failed to create campaign. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-8 mb-8 shadow-xl">
                <h1 className="text-4xl font-bold mb-3">Create New Campaign</h1>
                <p className="text-lg opacity-90">Fill in the details below to launch your fundraising campaign</p>
            </div>

            <div className="bg-base-100 rounded-lg shadow-xl p-8">
            
                {error && (
                    <div className="alert alert-error mb-6 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Campaign Image */}
                    <div className="card bg-gradient-to-br from-primary/5 to-secondary/5 shadow-md">
                        <div className="card-body">
                            <div className="flex items-center gap-2 mb-4">
                                <FaImage className="text-2xl text-primary" />
                                <h3 className="text-xl font-bold">Campaign Image</h3>
                            </div>
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="avatar">
                                    <div className="w-48 h-48 rounded-xl bg-base-200 border-4 border-primary/20 shadow-lg">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Campaign preview" className="w-full h-full object-cover rounded-lg" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                                <FaUpload className="text-5xl mb-2" />
                                                <span className="text-sm">Upload Image</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="file-input file-input-bordered file-input-primary w-full"
                                        required
                                    />
                                    <div className="text-sm text-gray-500 mt-2">
                                        <p>• Recommended size: 800x400px</p>
                                        <p>• Supported formats: JPG, PNG, WebP</p>
                                        <p>• Maximum file size: 5MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Campaign Details */}
                    <div className="card bg-base-100 shadow-md border border-base-300">
                        <div className="card-body">
                            <h3 className="text-xl font-bold mb-4 text-primary">Campaign Details</h3>
                            
                            {/* Campaign Title */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold text-base">Campaign Title *</span>
                                </label>
                                <input
                                    type="text"
                                    {...register('title', { required: 'Title is required' })}
                                    className="input input-bordered input-lg w-full focus:input-primary"
                                    placeholder="E.g., Help Build a School in Rural Area"
                                />
                                {errors.title && (
                                    <label className="label">
                                        <span className="label-text-alt text-error font-medium">{errors.title.message}</span>
                                    </label>
                                )}
                            </div>

                            {/* Description */}
                            <div className="form-control mt-4">
                                <label className="label">
                                    <span className="label-text font-semibold text-base">Campaign Description *</span>
                                </label>
                                <textarea
                                    {...register('description', { 
                                        required: 'Description is required',
                                        minLength: { value: 100, message: 'Description should be at least 100 characters' }
                                    })}
                                    className="textarea textarea-bordered textarea-lg h-40 focus:textarea-primary"
                                    placeholder="Tell the story of your campaign... Why is this cause important? How will the funds be used?"
                                ></textarea>
                                {errors.description && (
                                    <label className="label">
                                        <span className="label-text-alt text-error font-medium">{errors.description.message}</span>
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Financial & Timeline Information */}
                    <div className="card bg-base-100 shadow-md border border-base-300">
                        <div className="card-body">
                            <h3 className="text-xl font-bold mb-4 text-secondary">Financial & Timeline Information</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Goal Amount */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold text-base flex items-center gap-2">
                                            <FaMoneyBillWave className="text-success" />
                                            Goal Amount (BDT) *
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-success">৳</span>
                                        <input
                                            type="number"
                                            {...register('goalAmount', { 
                                                required: 'Goal amount is required',
                                                min: { value: 1000, message: 'Minimum amount is 1000 BDT' }
                                            })}
                                            className="input input-bordered input-lg w-full pl-10 focus:input-success"
                                            placeholder="50000"
                                            min="1000"
                                            step="100"
                                        />
                                    </div>
                                    {errors.goalAmount && (
                                        <label className="label">
                                            <span className="label-text-alt text-error font-medium">{errors.goalAmount.message}</span>
                                        </label>
                                    )}
                                </div>

                                {/* Category */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold text-base">Category *</span>
                                    </label>
                                    <select
                                        {...register('category', { required: 'Category is required' })}
                                        className="select select-bordered select-lg w-full focus:select-primary"
                                    >
                                        <option value="education">📚 Education</option>
                                        <option value="health">🏥 Health</option>
                                        <option value="environment">🌱 Environment</option>
                                        <option value="animals">🐾 Animals</option>
                                        <option value="community">🤝 Community</option>
                                        <option value="other">📋 Other</option>
                                    </select>
                                </div>

                                {/* End Date */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold text-base flex items-center gap-2">
                                            <FaCalendarAlt className="text-info" />
                                            Campaign End Date *
                                        </span>
                                    </label>
                                    <input
                                        type="date"
                                        {...register('endDate', { 
                                            required: 'End date is required',
                                            validate: value => {
                                                const selectedDate = new Date(value);
                                                const today = new Date();
                                                today.setHours(0, 0, 0, 0);
                                                return selectedDate > today || 'End date must be in the future';
                                            }
                                        })}
                                        className="input input-bordered input-lg w-full focus:input-info"
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    {errors.endDate && (
                                        <label className="label">
                                            <span className="label-text-alt text-error font-medium">{errors.endDate.message}</span>
                                        </label>
                                    )}
                                </div>

                                {/* Bank Account */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold text-base flex items-center gap-2">
                                            <FaUniversity className="text-warning" />
                                            Bank Account Number *
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        {...register('bankAccount', { 
                                            required: 'Bank account is required',
                                            pattern: {
                                                value: /^[0-9\-\s]+$/,
                                                message: 'Please enter a valid bank account number'
                                            }
                                        })}
                                        className="input input-bordered input-lg w-full focus:input-warning"
                                        placeholder="e.g., 1234-5678-9012-3456"
                                    />
                                    {errors.bankAccount && (
                                        <label className="label">
                                            <span className="label-text-alt text-error font-medium">{errors.bankAccount.message}</span>
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="card bg-accent/10 border-2 border-accent/30 shadow-md">
                        <div className="card-body">
                            <label className="label cursor-pointer justify-start gap-3">
                                <input 
                                    type="checkbox" 
                                    className="checkbox checkbox-accent checkbox-lg" 
                                    required
                                />
                                <span className="label-text text-base">
                                    I confirm that all information provided is accurate and I agree to the platform's <span className="text-accent font-semibold">terms and conditions</span>.
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
                        <button 
                            type="button" 
                            onClick={() => navigate(-1)}
                            className="btn btn-outline btn-lg"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" />
                                    Submitting Campaign...
                                </>
                            ) : (
                                <>
                                    <FaUpload className="mr-2" />
                                    Submit for Approval
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCampaignForm;
