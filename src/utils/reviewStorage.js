// Review Storage Utility
const STORAGE_KEY = 'charity_reviews';

// Get all reviews
export const getAllReviews = () => {
    try {
        const reviews = localStorage.getItem(STORAGE_KEY);
        return reviews ? JSON.parse(reviews) : [];
    } catch (error) {
        console.error('Error getting reviews:', error);
        return [];
    }
};

// Save review
export const saveReview = (review) => {
    try {
        const reviews = getAllReviews();
        const newReview = {
            id: Date.now().toString(),
            userId: review.userId,
            userName: review.userName,
            userEmail: review.userEmail,
            rating: review.rating,
            comment: review.comment,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        reviews.push(newReview);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
        return newReview;
    } catch (error) {
        console.error('Error saving review:', error);
        return null;
    }
};

// Update review
export const updateReview = (reviewId, updates) => {
    try {
        const reviews = getAllReviews();
        const index = reviews.findIndex(r => r.id === reviewId);
        if (index !== -1) {
            reviews[index] = {
                ...reviews[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
            return reviews[index];
        }
        return null;
    } catch (error) {
        console.error('Error updating review:', error);
        return null;
    }
};

// Delete review
export const deleteReview = (reviewId) => {
    try {
        const reviews = getAllReviews();
        const filteredReviews = reviews.filter(r => r.id !== reviewId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredReviews));
        return true;
    } catch (error) {
        console.error('Error deleting review:', error);
        return false;
    }
};

// Get reviews by user
export const getReviewsByUser = (userId) => {
    try {
        const reviews = getAllReviews();
        return reviews.filter(r => r.userId === userId);
    } catch (error) {
        console.error('Error getting user reviews:', error);
        return [];
    }
};

// Get review by ID
export const getReviewById = (reviewId) => {
    try {
        const reviews = getAllReviews();
        return reviews.find(r => r.id === reviewId);
    } catch (error) {
        console.error('Error getting review:', error);
        return null;
    }
};

// Get average rating
export const getAverageRating = () => {
    try {
        const reviews = getAllReviews();
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        return (sum / reviews.length).toFixed(1);
    } catch (error) {
        console.error('Error calculating average rating:', error);
        return 0;
    }
};
