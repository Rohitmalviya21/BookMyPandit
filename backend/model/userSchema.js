const mongoose = require('mongoose')

const userschema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        default:''
    },

    contact: {
        type: String,
        default:''
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["user", "pandit", "admin"],
        default: "user"
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date,
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

const User = mongoose.model("User", userschema)

module.exports = User