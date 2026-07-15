const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    panditId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pandit',
        required: true
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
        unique: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        default: ''
    }
}, { timestamps: true });

// PERFORMANCE OPTIMIZATION:
// Index added on bookingId and panditId.
// Speeds up user duplicate review queries and lookups by pandit profile.
reviewSchema.index({ panditId: 1 });

module.exports = mongoose.model('Review', reviewSchema);
