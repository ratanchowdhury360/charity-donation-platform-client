import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../provider/authProvider';
import { getReviewsByUser, saveReview, updateReview, deleteReview } from '../../utils/reviewStorage';
import { FaStar, FaRegStar, FaEdit, FaTrash, FaPlus, FaUser } from 'react-icons/fa';

const MyReviews = () => {
    const { currentUser } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [formData, setFormData] = useState({
        rating: 5,
        comment: ''
    });
    const [wordCount, setWordCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const loadReviews = useCallback(async () => {
        try {
            setLoading(true);
            const userReviews = await getReviewsByUser(currentUser.uid);
            setReviews(userReviews);
        } catch (error) {
            console.error('Error loading reviews:', error);
            alert('Failed to load reviews. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            loadReviews();
        } else {
            setLoading(false);
        }
    }, [currentUser, loadReviews]);

    const handleRatingClick = (rating) => {
        setFormData({ ...formData, rating });
    };

    const handleCommentChange = (e) => {
        const text = e.target.value;
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        
        if (words.length <= 50) {
            setFormData({ ...formData, comment: text });
            setWordCount(words.length);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.comment.trim()) {
            alert('Please write a review comment');
            return;
        }

        try {
            if (editingReview) {
                // Update existing review
                await updateReview(editingReview.id, {
                    rating: formData.rating,
                    comment: formData.comment
                });
                alert('Review updated successfully!');
            } else {
                // Create new review
                await saveReview({
                    userId: currentUser.uid,
                    userName: currentUser.displayName || currentUser.email || 'Anonymous User',
                    userEmail: currentUser.email,
                    rating: formData.rating,
                    comment: formData.comment
                });
                alert('Review submitted successfully!');
            }

            await loadReviews();
            closeModal();
        } catch (error) {
            console.error('Error saving review:', error);
            const errorMessage = error.message || 'Failed to save review. Please try again.';
            if (errorMessage.includes('already has a review')) {
                alert('You already have a review. Please update your existing review instead.');
            } else {
                alert(errorMessage);
            }
        }
    };

    const handleEdit = (review) => {
        setEditingReview(review);
        setFormData({
            rating: review.rating,
            comment: review.comment
        });
        const words = review.comment.trim().split(/\s+/).filter(word => word.length > 0);
        setWordCount(words.length);
        setIsModalOpen(true);
    };

    const handleDelete = async (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                await deleteReview(reviewId);
                alert('Review deleted successfully!');
                await loadReviews();
            } catch (error) {
                console.error('Error deleting review:', error);
                alert('Failed to delete review. Please try again.');
            }
        }
    };

    const openModal = () => {
        setEditingReview(null);
        setFormData({ rating: 5, comment: '' });
        setWordCount(0);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingReview(null);
        setFormData({ rating: 5, comment: '' });
        setWordCount(0);
    };

    const renderStars = (rating, interactive = false) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => interactive && handleRatingClick(star)}
                        className={`text-2xl ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
                        disabled={!interactive}
                    >
                        {star <= rating ? (
                            <FaStar className="text-warning" />
                        ) : (
                            <FaRegStar className="text-gray-300" />
                        )}
                    </button>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>My Reviews - Dashboard</title>
            </Helmet>

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-600 text-white rounded-lg p-6 shadow-xl border-2 border-teal-400/30">
                        <h1 className="text-3xl font-bold">My Reviews</h1>
                        <p className="text-lg opacity-95 mt-1">Manage your reviews and ratings</p>
                    </div>
                    <button onClick={openModal} className="btn bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 hover:from-pink-600 hover:to-purple-700 shadow-lg">
                        <FaPlus className="mr-2" />
                        Add Review
                    </button>
                </div>

                {/* Reviews List */}
                {reviews.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="card bg-gradient-to-br from-teal-100 via-cyan-100 to-teal-100 shadow-lg border-2 border-teal-300 hover:shadow-xl hover:border-teal-400 transition-all">
                                <div className="card-body">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            {/* Rating */}
                                            <div className="mb-3">
                                                {renderStars(review.rating)}
                                            </div>

                                            {/* Comment */}
                                            <p className="text-teal-900 mb-4 font-medium">{review.comment}</p>

                                            {/* User Info */}
                                            <div className="flex items-center gap-2 text-sm text-teal-800 font-medium">
                                                <FaUser className="text-teal-700" />
                                                <span className="font-bold">{review.userName}</span>
                                                <span>•</span>
                                                <span>ID: {review.userId.substring(0, 8)}...</span>
                                                <span>•</span>
                                                <span>{new Date(review.createdAt || review.date).toLocaleDateString()}</span>
                                                {review.updatedAt && review.updatedAt !== review.createdAt && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="text-blue-700 font-bold">Edited</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(review)}
                                                className="btn btn-ghost btn-sm btn-circle"
                                                title="Edit"
                                            >
                                                <FaEdit className="text-info" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(review.id)}
                                                className="btn btn-ghost btn-sm btn-circle"
                                                title="Delete"
                                            >
                                                <FaTrash className="text-error" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card bg-gradient-to-br from-teal-100 via-cyan-100 to-teal-100 shadow-lg border-2 border-teal-300">
                        <div className="card-body text-center py-12">
                            <FaStar className="text-6xl text-teal-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2 text-teal-900">No Reviews Yet</h3>
                            <p className="text-teal-700 mb-6 font-medium">
                                Share your experience by writing your first review
                            </p>
                            <button onClick={openModal} className="btn bg-gradient-to-r from-teal-500 to-cyan-600 text-white border-0 hover:from-teal-600 hover:to-cyan-700 shadow-lg">
                                <FaPlus className="mr-2" />
                                Write a Review
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-50 border-2 border-teal-300 shadow-2xl">
                        <h3 className="font-bold text-2xl mb-4 text-teal-900">
                            {editingReview ? 'Edit Review' : 'Write a Review'}
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Rating */}
                            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border-2 border-teal-200">
                                <label className="label">
                                    <span className="label-text font-bold text-teal-900">Rating</span>
                                </label>
                                <div className="mt-2">
                                    {renderStars(formData.rating, true)}
                                </div>
                            </div>

                            {/* Comment */}
                            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-lg border-2 border-teal-200 shadow-md">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="label p-0">
                                        <span className="text-lg font-bold text-teal-900">Your Review</span>
                                    </label>
                                    <div className={`px-3 py-1 rounded-full font-bold text-sm ${
                                        wordCount >= 50 
                                            ? 'bg-red-100 text-red-700 border-2 border-red-400' 
                                            : wordCount >= 40 
                                            ? 'bg-amber-100 text-amber-700 border-2 border-amber-400'
                                            : 'bg-teal-100 text-teal-700 border-2 border-teal-400'
                                    }`}>
                                        {wordCount}/50 words
                                    </div>
                                </div>
                                <textarea
                                    className="textarea w-full h-32  textarea-bordered border-2 border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 text-gray-900 text-base"
                                    placeholder="Share your experience... (Maximum 50 words)"
                                    value={formData.comment}
                                    onChange={handleCommentChange}
                                    required
                                ></textarea>
                                <p className="text-xs text-teal-600 mt-2 font-medium">
                                    💡 Write a detailed review about your experience with the platform
                                </p>
                            </div>

                            {/* User Info Display */}
                            <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 p-4 rounded-lg border-2 border-purple-300">
                                <p className="text-sm text-purple-900 font-bold mb-2">Review will be posted as:</p>
                                <div className="flex items-center gap-2">
                                    <FaUser className="text-purple-700" />
                                    <span className="font-bold text-purple-900">{currentUser.displayName || currentUser.email || 'Anonymous User'}</span>
                                    <span className="text-purple-700">•</span>
                                    <span className="text-sm text-purple-800 font-medium">ID: {currentUser.uid.substring(0, 8)}...</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="modal-action">
                                <button type="button" onClick={closeModal} className="btn btn-outline border-teal-400 text-teal-700 hover:bg-teal-100">
                                    Cancel
                                </button>
                                <button type="submit" className="btn bg-gradient-to-r from-teal-500 to-cyan-600 text-white border-0 hover:from-teal-600 hover:to-cyan-700 shadow-lg">
                                    {editingReview ? 'Update Review' : 'Submit Review'}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-backdrop" onClick={closeModal}></div>
                </div>
            )}
        </>
    );
};

export default MyReviews;
