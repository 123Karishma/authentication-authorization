const mongoose = require('mongoose')

const authUser = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

    resendOp: String,
    expiryOtp: Date
}, { timestamps: true })

const User = mongoose.model("user", authUser)

module.exports = User