// routes/faculty.js
const express = require("express");
const Faculty = require("../models/faculty");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Import bcrypt
const verifyToken = require("../middleware/auth");
const router = express.Router();

// Faculty Registration
router.post("/register", async (req, res) => {
    const { name, email, password, facultyId, role, dateOfBirth, gender, phoneNumber } = req.body; // Include new fields
    try {
        const existingFaculty = await Faculty.findOne({ email });
        if (existingFaculty) {
            return res.status(400).json({ message: "Faculty member already exists." });
        }

        const faculty = new Faculty({ name, email, password, facultyId, role, dateOfBirth, gender, phoneNumber }); // Save new fields
        await faculty.save();

        // Generate a token for the new faculty member
        const token = jwt.sign({ id: faculty._id, role: faculty.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Faculty Login
// Faculty Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const faculty = await Faculty.findOne({ email });
        if (!faculty) {
            console.log("Faculty not found");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Debugging: Log entered password and hashed password
        console.log("Entered Password:", password);
        console.log("Stored Hashed Password:", faculty.password);

        // Compare passwords
        if (!(await bcrypt.compare(password, faculty.password))) {
            console.log("Password does not match");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate a token for the faculty member
        const token = jwt.sign({ id: faculty._id, role: faculty.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// View Faculty Members
router.get("/", verifyToken, async (req, res) => { 
    try {
        const facultyList = await Faculty.find(); // Retrieves all faculty members
        res.status(200).json(facultyList); // Send the retrieved faculty list
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Faculty by ID
router.delete("/:facultyId", verifyToken, async (req, res) => {
    const { facultyId } = req.params; // Get facultyId from the URL
    try {
        const deletedFaculty = await Faculty.findOneAndDelete({ _id: facultyId }); // Delete faculty by _id
        if (!deletedFaculty) {
            return res.status(404).json({ message: "Faculty not found" }); // If not found, send 404
        }
        res.status(200).json({ message: "Faculty deleted successfully" }); // Confirm deletion
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
