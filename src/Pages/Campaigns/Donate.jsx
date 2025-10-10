import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getCampaigns, addDonationToCampaign } from '../../utils/campaignStorage';
import { addDonation } from '../../utils/donationStorage';
import { useAuth } from '../../provider/authProvider';
import { FaHeart, FaCreditCard, FaMobile, FaPaypal, FaCheckCircle } from 'react-icons/fa';

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
        const allCampaigns = getCampaigns();
        const foundCampaign = allCampaigns.find(c => c.id === id);
        setCampaign(foundCampaign);
        setLoading(false);
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
            alert('Please login to make a donation');
            navigate('/login');
            return;
        }
        
        if (!amount || parseInt(amount) < 100) {
            alert('Minimum donation amount is 100 BDT');
            return;
        }

        setProcessing(true);
        
        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const donationAmount = parseInt(amount);
            
            // Add donation to campaign (update campaign's currentAmount)
            addDonationToCampaign(campaign.id, donationAmount);
            
            // Record user's donation
            addDonation({
                userId: currentUser.uid,
                userEmail: currentUser.email,
                userName: currentUser.displayName || 'Anonymous',
                campaignId: campaign.id,
                campaignTitle: campaign.title,
                charityName: campaign.charityName,
                amount: donationAmount,
                paymentMethod: paymentMethod,
                anonymous: anonymous
            });
            
            // Show success message
            alert(`Thank you for your donation of ৳${donationAmount.toLocaleString()}!\n\nYour contribution will make a real difference.`);
            
            // Redirect to campaign details
            navigate(`/campaigns/${campaign.id}`);
        } catch (error) {
            console.error('Donation error:', error);
            alert('Failed to process donation. Please try again.');
            setProcessing(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Donate to {campaign.title}</title>
            </Helmet>

            <div className="min-h-screen bg-base-200 pt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h1 className="text-3xl font-bold mb-6 text-center">Make a Donation</h1>
                                
                                {/* Campaign Summary */}
                                <div className="bg-base-200 rounded-lg p-4 mb-6">
                                    <h3 className="font-bold mb-2">{campaign.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">By: {campaign.charityName}</p>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span>Raised: ৳{(campaign.currentAmount || 0).toLocaleString()}</span>
                                        <span>Goal: ৳{campaign.goalAmount.toLocaleString()}</span>
                                    </div>
                                    <progress 
                                        className="progress progress-primary w-full" 
                                        value={campaign.currentAmount || 0} 
                                        max={campaign.goalAmount}
                                    ></progress>
                                    <div className="text-center text-sm text-gray-600 mt-2">
                                        {Math.round(((campaign.currentAmount || 0) / campaign.goalAmount) * 100)}% funded
                                    </div>
                                </div>

                                <form onSubmit={handleDonate} className="space-y-6">
                                    {/* Amount Selection */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Donation Amount (BDT)</span>
                                        </label>
                                        <div className="grid grid-cols-4 gap-2 mb-4">
                                            {[1000, 2500, 5000, 10000].map((presetAmount) => (
                                                <button
                                                    key={presetAmount}
                                                    type="button"
                                                    onClick={() => setAmount(presetAmount.toString())}
                                                    className={`btn btn-outline ${
                                                        amount === presetAmount.toString() ? 'btn-primary' : ''
                                                    }`}
                                                >
                                                    {presetAmount.toLocaleString()}
                                                </button>
                                            ))}
                                        </div>
                                        <input
                                            type="number"
                                            placeholder="Enter custom amount"
                                            className="input input-bordered w-full"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            min="100"
                                            required
                                        />
                                    </div>

                                    {/* Payment Method */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-semibold">Payment Method</span>
                                        </label>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-base-200">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="bkash"
                                                    checked={paymentMethod === 'bkash'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="radio radio-primary"
                                                />
                                                <FaMobile className="text-primary" />
                                                <span>bKash</span>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-base-200">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="paypal"
                                                    checked={paymentMethod === 'paypal'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="radio radio-primary"
                                                />
                                                <FaPaypal className="text-primary" />
                                                <span>PayPal</span>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-base-200">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="card"
                                                    checked={paymentMethod === 'card'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="radio radio-primary"
                                                />
                                                <FaCreditCard className="text-primary" />
                                                <span>Credit/Debit Card</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Anonymous Donation */}
                                    <div className="form-control">
                                        <label className="label cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-primary"
                                                checked={anonymous}
                                                onChange={(e) => setAnonymous(e.target.checked)}
                                            />
                                            <span className="label-text">Make this donation anonymous</span>
                                        </label>
                                    </div>

                                    {/* Donation Summary */}
                                    <div className="bg-primary/10 rounded-lg p-4">
                                        <h3 className="font-bold mb-2">Donation Summary</h3>
                                        <div className="flex justify-between">
                                            <span>Amount:</span>
                                            <span className="font-semibold">{amount ? `${parseInt(amount).toLocaleString()} BDT` : '0 BDT'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Payment Method:</span>
                                            <span className="font-semibold capitalize">{paymentMethod}</span>
                                        </div>
                                        {anonymous && (
                                            <div className="flex justify-between">
                                                <span>Visibility:</span>
                                                <span className="font-semibold">Anonymous</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-full btn-lg"
                                        disabled={!amount || parseInt(amount) < 100 || processing}
                                    >
                                        {processing ? (
                                            <>
                                                <span className="loading loading-spinner"></span>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <FaHeart className="mr-2" />
                                                Donate {amount ? `৳${parseInt(amount).toLocaleString()}` : ''}
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="text-center mt-6">
                                    <p className="text-sm text-gray-600">
                                        Your donation is secure and will be processed immediately.
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
