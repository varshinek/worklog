// models/faculty.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const facultySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    facultyId: { type: String, required: true },
    role: {
        type: String,
        enum: ['user', 'faculty', 'admin'],
        required: true,
    },
    dateOfBirth: { type: Date, required: true }, // New field for date of birth
    gender: { type: String, enum: ['male', 'female', 'other'], required: true }, // New field for gender
    phoneNumber: { type: String, required: true }, // New field for phone number
});

// Hash the password before saving
facultySchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model("Faculty", facultySchema);
