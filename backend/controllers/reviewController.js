const Review = require('../model/reviewSchema');
const Booking = require('../model/bookingSchema');
const Pandit = require('../model/panditSchema');

const createReview = async (req, res) => {
    try {
        const { bookingId, rating, comment } = req.body;

        if (!bookingId || !rating) {
            return res.status(400).json({
                msg: 'Booking ID and rating are required'
            });
        }

        const ratingNum = Number(rating);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            return res.status(400).json({
                msg: 'Rating must be between 1 and 5'
            });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                msg: 'Booking not found'
            });
        }

        if (booking.userId.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                msg: 'You are not authorized to review this booking'
            });
        }

        if (booking.status !== 'completed') {
            return res.status(400).json({
                msg: 'You can only review completed bookings'
            });
        }

        const existingReview = await Review.findOne({ bookingId });
        if (existingReview) {
            return res.status(400).json({
                msg: 'You have already reviewed this booking'
            });
        }

        const review = await Review.create({
            userId: req.user.id,
            panditId: booking.panditId,
            bookingId,
            rating: ratingNum,
            comment: comment || ''
        });

        // Recalculate average rating
        const stats = await Review.aggregate([
            { $match: { panditId: booking.panditId } },
            { $group: { _id: '$panditId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
        ]);

        if (stats.length > 0) {
            await Pandit.findByIdAndUpdate(booking.panditId, {
                averageRating: Math.round(stats[0].avgRating * 10) / 10,
                totalReviews: stats[0].count
            });
        }

        res.status(201).json({
            msg: 'Review submitted successfully',
            review
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};

const getPanditReviews = async (req, res) => {
    try {
        const { panditId } = req.params;

        const reviews = await Review.find({ panditId })
            .populate('userId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            reviews
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};

module.exports = { createReview, getPanditReviews };
