import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getCampaigns, addDonationToCampaign } from '../../utils/campaignStorage';
import { addDonation } from '../../utils/donationStorage';
import { useAuth } from '../../provider/authProvider';
import { FaHeart, FaCreditCard, FaMobile, FaPaypal, FaCheckCircle } from 'react-icons/fa';

const showAlert = (icon, title, text) => {
    const swal = typeof window !== 'undefined' ? window.Swal : null;
    if (swal) {
        return swal.fire({
            icon,
            title,
            text,
            timer: icon === 'success' ? 3000 : undefined,
            showConfirmButton: icon !== 'success',
            confirmButtonColor: icon === 'success' ? '#10b981' : '#ef4444'
        });
    } else if (typeof window !== 'undefined' && window.alert) {
        window.alert(`${title}${text ? `\n${text}` : ''}`);
        return Promise.resolve();
    }
    return Promise.resolve();
};

const Donate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('bkash');
    const [anonymous, setAnonymous] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const loadCampaign = async () => {
            try {
                const allCampaigns = await getCampaigns();
                const foundCampaign = allCampaigns.find(c => c.id === id);
                setCampaign(foundCampaign);
            } catch (error) {
                console.error('Failed to load campaign for donation', error);
            } finally {
                setLoading(false);
            }
        };

        loadCampaign();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200 pt-20">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200 pt-20">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Campaign Not Found</h1>
                </div>
            </div>
        );
    }

    const handleDonate = async (e) => {
        e.preventDefault();
        
        if (!currentUser) {
            await showAlert('warning', 'Login Required', 'Please login to make a donation');
            navigate('/login');
            return;
        }
        
        if (!amount || parseInt(amount) < 100) {
            await showAlert('warning', 'Invalid Amount', 'Minimum donation amount is 100 BDT');
            return;
        }

        setProcessing(true);
        
        let donationAdded = false;
        let campaignUpdated = false;
        
        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const donationAmount = parseInt(amount);
            
            // Generate transaction ID
            const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            
            // Record user's donation first
            const donationData = {
                donorId: currentUser.uid,
                donorEmail: currentUser.email,
                donorName: currentUser.displayName || 'Anonymous',
                campaignId: campaign.id,
                campaignTitle: campaign.title,
                charityId: campaign.charityId,
                charityName: campaign.charityName,
                amount: donationAmount,
                currency: 'BDT',
                paymentMethod: paymentMethod,
                transactionId: transactionId,
                anonymous: anonymous,
                status: 'completed'
            };
            
            try {
                await addDonation(donationData);
                donationAdded = true;
            } catch (donationError) {
                console.error('Error adding donation:', donationError);
                throw new Error('Failed to record donation. Please try again.');
            }
            
            // Add donation to campaign (update campaign's currentAmount)
            try {
                const updatedCampaign = await addDonationToCampaign(campaign.id, donationAmount);
                setCampaign(updatedCampaign);
                campaignUpdated = true;
            } catch (campaignError) {
                console.error('Error updating campaign:', campaignError);
                // If donation was added but campaign update failed, still show success
                // but log the error
                if (donationAdded) {
                    console.warn('Donation was recorded but campaign update failed');
                } else {
                    throw new Error('Failed to update campaign. Please try again.');
                }
            }
            
            // Show success message only if donation was successfully added
            if (donationAdded) {
                await showAlert(
                    'success', 
                    'Donation Successful!', 
                    `Thank you for your donation of ৳${donationAmount.toLocaleString()}!\n\nYour contribution will make a real difference.`
                );
                
                // Redirect to campaign details
                navigate(`/campaigns/${campaign.id}`);
            } else {
                throw new Error('Donation processing failed');
            }
        } catch (error) {
            console.error('Donation error:', error);
            await showAlert(
                'error', 
                'Donation Failed', 
                error.message || 'Failed to process donation. Please try again.'
            );
            setProcessing(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Donate to {campaign.title}</title>
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 via-accent/5 to-primary/10 pt-20 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="container mx-auto px-4 py-8 relative z-10">
                    <div className="max-w-2xl mx-auto">
                        {/* Header Section */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Make a Donation
                            </h1>
                            <p className="text-base-content/70 text-lg">Your generosity makes a real difference</p>
                        </div>

                        <div className="card bg-gradient-to-br from-white via-primary/5 to-white shadow-2xl border-2 border-primary/20 backdrop-blur-sm">
                            <div className="card-body p-6 md:p-8">
                                {/* Campaign Summary */}
                                <div className="bg-gradient-to-r from-primary via-secondary to-primary text-white rounded-xl p-6 mb-8 shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-3">
                                            <FaHeart className="text-2xl text-white/90" />
                                            <h3 className="font-bold text-xl text-white">{campaign.title}</h3>
                                        </div>
                                        <p className="text-sm text-white/90 mb-4">By: {campaign.charityName}</p>
                                        <div className="flex justify-between text-sm mb-3 font-semibold text-white">
                                            <span className="bg-white/20 px-3 py-1 rounded-lg">Raised: ৳{(campaign.currentAmount || 0).toLocaleString()}</span>
                                            <span className="bg-white/20 px-3 py-1 rounded-lg">Goal: ৳{campaign.goalAmount.toLocaleString()}</span>
                                        </div>
                                        <progress 
                                            className="progress progress-white w-full h-3 mb-2" 
                                            value={campaign.currentAmount || 0} 
                                            max={campaign.goalAmount}
                                        ></progress>
                                        <div className="text-center text-base font-bold text-white mt-2">
                                            {Math.round(((campaign.currentAmount || 0) / campaign.goalAmount) * 100)}% funded
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleDonate} className="space-y-6">
                                    {/* Amount Selection */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-bold text-lg text-base-content">Donation Amount (BDT)</span>
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                            {[1000, 2500, 5000, 10000].map((presetAmount) => (
                                                <button
                                                    key={presetAmount}
                                                    type="button"
                                                    onClick={() => setAmount(presetAmount.toString())}
                                                    className={`btn  transition-all font-semibold ${
                                                        amount === presetAmount.toString() 
                                                            ? 'btn-primary text-white shadow-lg scale-105' 
                                                            : 'btn-outline btn-primary hover:bg-primary/10'
                                                    }`}
                                                >
                                                    ৳{presetAmount.toLocaleString()}
                                                </button>
                                            ))}
                                        </div>
                                        <input
                                            type="number"
                                            placeholder="Enter custom amount (min: ৳100)"
                                            className="input text-blue-500 input-bordered w-full focus:input-primary focus:outline-none border-2 text-lg font-medium"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            min="100"
                                            required
                                        />
                                        <label className="label">
                                            <span className="label-text-alt text-base-content/60">Minimum donation: ৳100</span>
                                        </label>
                                    </div>

                                    {/* Payment Method */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-bold text-lg text-base-content">Payment Method</span>
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <label className={`flex flex-col items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:scale-105 ${
                                                paymentMethod === 'bkash' 
                                                    ? 'bg-gradient-to-br from-primary/30 to-primary/10 border-primary shadow-lg' 
                                                    : 'hover:bg-primary/5 border-base-300'
                                            }`}>
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="bkash"
                                                    checked={paymentMethod === 'bkash'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="radio radio-primary"
                                                />
                                                <FaMobile className={`text-3xl ${paymentMethod === 'bkash' ? 'text-primary' : 'text-base-content/60'}`} />
                                                <span className="font-semibold text-base-content">bKash</span>
                                            </label>
                                            <label className={`flex flex-col items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:scale-105 ${
                                                paymentMethod === 'paypal' 
                                                    ? 'bg-gradient-to-br from-primary/30 to-primary/10 border-primary shadow-lg' 
                                                    : 'hover:bg-primary/5 border-base-300'
                                            }`}>
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="paypal"
                                                    checked={paymentMethod === 'paypal'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="radio radio-primary"
                                                />
                                                <FaPaypal className={`text-3xl ${paymentMethod === 'paypal' ? 'text-primary' : 'text-base-content/60'}`} />
                                                <span className="font-semibold text-base-content">PayPal</span>
                                            </label>
                                            <label className={`flex flex-col items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:scale-105 ${
                                                paymentMethod === 'card' 
                                                    ? 'bg-gradient-to-br from-primary/30 to-primary/10 border-primary shadow-lg' 
                                                    : 'hover:bg-primary/5 border-base-300'
                                            }`}>
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="card"
                                                    checked={paymentMethod === 'card'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="radio radio-primary"
                                                />
                                                <FaCreditCard className={`text-3xl ${paymentMethod === 'card' ? 'text-primary' : 'text-base-content/60'}`} />
                                                <span className="font-semibold text-base-content">Card</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Anonymous Donation */}
                                    <div className="form-control">
                                        <label className="label cursor-pointer justify-start gap-3 p-4 bg-base-200/50 rounded-lg hover:bg-base-200 transition-colors">
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-primary checkbox-lg"
                                                checked={anonymous}
                                                onChange={(e) => setAnonymous(e.target.checked)}
                                            />
                                            <span className="label-text font-medium text-base-content">Make this donation anonymous</span>
                                        </label>
                                    </div>

                                    {/* Donation Summary */}
                                    <div className="bg-gradient-to-br from-success/30 via-success/20 to-success/30 rounded-xl p-6 border-2 border-success/40 shadow-lg">
                                        <div className="flex items-center gap-2 mb-4">
                                            <FaCheckCircle className="text-success text-xl" />
                                            <h3 className="font-bold text-xl text-base-content">Donation Summary</h3>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                                                <span className="font-semibold text-base-content">Amount:</span>
                                                <span className="font-black text-success text-2xl">{amount ? `৳${parseInt(amount).toLocaleString()}` : '৳0'}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                                                <span className="font-semibold text-base-content">Payment Method:</span>
                                                <span className="font-bold capitalize text-primary text-lg">{paymentMethod}</span>
                                            </div>
                                            {anonymous && (
                                                <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                                                    <span className="font-semibold text-base-content">Visibility:</span>
                                                    <span className="font-bold text-info text-lg">Anonymous</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-full btn-lg text-white font-bold text-lg py-3 hover:btn-primary-focus transition-all shadow-xl hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                        disabled={!amount || parseInt(amount) < 100 || processing}
                                    >
                                        {processing ? (
                                            <>
                                                <span className="loading loading-spinner loading-lg"></span>
                                                Processing Your Donation...
                                            </>
                                        ) : (
                                            <>
                                                <FaHeart className="mr-2 text-xl" />
                                                Donate {amount ? `৳${parseInt(amount).toLocaleString()}` : 'Now'}
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-8 p-4 bg-gradient-to-r from-success/20 to-success/10 rounded-lg border border-success/30">
                                    <p className="text-sm text-blue-500 text-base-content/80 flex items-center justify-center gap-2 font-medium">
                                        <FaCheckCircle className="text-success text-blue-500 text-lg" />
                                        Your donation is secure and will be processed immediately
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Donate;
