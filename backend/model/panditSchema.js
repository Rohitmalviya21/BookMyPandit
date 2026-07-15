const mongoose = require('mongoose')

const panditSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specialization: {
        type: String,
        required: true
    },

    experience: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    fees: {
        type: Number,
        required: true
    },
    bio: {
        type: String
    },

    image: {
        type: String
    },
    averageRating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    }


},{timestamps:true})

// PERFORMANCE OPTIMIZATION:
// MongoDB index added on userId.
// Why it is used: Allows direct indexing for user-to-pandit lookups.
// What problem it solves: Prevents collection scan when checking if a user has a pandit profile or when updating it.
// What output improvement we get: Faster check profile and get profile API responses.
// Why modern companies use it: Ensures rapid lookups on related tables by indexing relational foreign keys.
panditSchema.index({ userId: 1 })

panditSchema.index({

    specialization:'text',

    location:'text'
})

module.exports = mongoose.model('Pandit',panditSchema)