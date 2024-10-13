// models/user.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'faculty', 'admin'],
        required: true,
    },
    dateOfBirth: { // New field for date of birth
        type: Date,
        required: true,
    },
    gender: { // New field for gender
        type: String,
        enum: ['male', 'female', 'other'],
        required: true,
    },
    phoneNumber: { // New field for phone number
        type: String,
        required: true,
        unique: true, // Optional: Make this unique if required
    },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
