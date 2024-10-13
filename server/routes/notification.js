const express = require("express");
const Worklog = require("../models/worklog");
const verifyToken = require("../middleware/auth");
const router = express.Router();

// Send Notification to User about Pending Worklog
router.post("/:id/notify", verifyToken, async (req, res) => {
    const { message } = req.body;
    const { id } = req.params;

    try {
        const worklog = await Worklog.findById(id);
        
        if (!worklog) {
            return res.status(404).json({ message: "Worklog not found" });
        }

        worklog.notifications.push({ message });
        await worklog.save();

        res.status(200).json({ message: "Notification sent successfully", worklog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all Notifications for a User's Worklog
router.get("/:id/notifications", verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const worklog = await Worklog.findById(id);
        
        if (!worklog) {
            return res.status(404).json({ message: "Worklog not found" });
        }

        res.status(200).json({ notifications: worklog.notifications });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
