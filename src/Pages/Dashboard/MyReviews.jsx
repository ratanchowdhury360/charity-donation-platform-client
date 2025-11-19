import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        if (currentUser) {
            loadReviews();
        } else {
            setLoading(false);
        }
    }, [currentUser]);

    const loadReviews = async () => {
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
    };

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
                    <div>
                        <h1 className="text-3xl font-bold">My Reviews</h1>
                        <p className="text-gray-600 mt-1">Manage your reviews and ratings</p>
                    </div>
                    <button onClick={openModal} className="btn btn-primary">
                        <FaPlus className="mr-2" />
                        Add Review
                    </button>
                </div>

                {/* Reviews List */}
                {reviews.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="card-body">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            {/* Rating */}
                                            <div className="mb-3">
                                                {renderStars(review.rating)}
                                            </div>

                                            {/* Comment */}
                                            <p className="text-gray-700 mb-4">{review.comment}</p>

                                            {/* User Info */}
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <FaUser className="text-primary" />
                                                <span className="font-medium">{review.userName}</span>
                                                <span>•</span>
                                                <span>ID: {review.userId.substring(0, 8)}...</span>
                                                <span>•</span>
                                                <span>{new Date(review.createdAt || review.date).toLocaleDateString()}</span>
                                                {review.updatedAt && review.updatedAt !== review.createdAt && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="text-info">Edited</span>
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
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body text-center py-12">
                            <FaStar className="text-6xl text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-medium mb-2">No Reviews Yet</h3>
                            <p className="text-gray-500 mb-6">
                                Share your experience by writing your first review
                            </p>
                            <button onClick={openModal} className="btn btn-primary">
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
                    <div className="modal-box max-w-2xl">
                        <h3 className="font-bold text-2xl mb-4">
                            {editingReview ? 'Edit Review' : 'Write a Review'}
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Rating */}
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold">Rating</span>
                                </label>
                                {renderStars(formData.rating, true)}
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold">Your Review</span>
                                    <span className="label-text-alt">
                                        {wordCount}/50 words
                                    </span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered w-full h-32"
                                    placeholder="Share your experience... (Maximum 50 words)"
                                    value={formData.comment}
                                    onChange={handleCommentChange}
                                    required
                                ></textarea>
                            </div>

                            {/* User Info Display */}
                            <div className="bg-base-200 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 mb-2">Review will be posted as:</p>
                                <div className="flex items-center gap-2">
                                    <FaUser className="text-primary" />
                                    <span className="font-medium">{currentUser.displayName || currentUser.email || 'Anonymous User'}</span>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-sm text-gray-500">ID: {currentUser.uid.substring(0, 8)}...</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="modal-action">
                                <button type="button" onClick={closeModal} className="btn btn-ghost">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
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
