// routes/user.js
const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
const router = express.Router();

// User Registration
// routes/user.js
router.post("/register", async (req, res) => {
    const { name, email, password, userId, role, dateOfBirth, gender, phoneNumber } = req.body; // Include new fields
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({ name, email, password: hashedPassword, userId, role, dateOfBirth, gender, phoneNumber });
        await user.save();

        const token = jwt.sign({ id: user._id, name: user.name ,userId : user.userId , role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// User Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email); // Log email attempt

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare the entered password with the hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", passwordMatch);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate a JWT token for the user
        const token = jwt.sign({ id: user._id, name: user.name ,userId : user.userId , role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Return the token to the user
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// View All Users
router.get("/", async (req, res) => { 
    try {
        const userList = await User.find();
        res.status(200).json(userList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete User by ID
router.delete("/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const deletedUser = await User.findOneAndDelete({ _id: userId }); // Use _id to delete user
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
