const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({

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

    poojaType: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    status: {
        type: String,

        enum: [
            'pending',
            'accepted',
            'completed',
            'cancelled'
        ],

        default: 'pending'
    }

}, { timestamps: true })

// PERFORMANCE OPTIMIZATION:
// MongoDB indexes added on userId and panditId.
// Why it is used: Speeds up lookup queries filtering by user or pandit.
// What problem it solves: Prevents full collections scans when fetching user bookings or pandit requests.
// What output improvement we get: Drastically reduced query execution times.
// Why modern companies use it: Essential for database scalability to handle large volumes of records without latency spikes.
bookingSchema.index({ userId: 1 })
bookingSchema.index({ panditId: 1 })

const Booking = mongoose.model(
    'Booking',
    bookingSchema
)

module.exports = Booking