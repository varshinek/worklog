const express = require("express");
const { check, validationResult } = require("express-validator");
const Worklog = require("../models/worklog");
const verifyToken = require("../middleware/auth");
const router = express.Router();

// Create a Worklog (Users and Faculty can create worklogs)
router.post(
  "/",
  verifyToken,
  [
      check("name").notEmpty().withMessage("Name is required"),
      check("workType").notEmpty().withMessage("Work Type is required"),
      check("description").isLength({ min: 5 }).withMessage("Description must be at least 5 characters long"),
      check("hoursSpent").isFloat({ min: 0 }).withMessage("Hours spent must be a positive number"),
  ],
  async (req, res) => {
      // Validate request data
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      const { name, workType, description, hoursSpent } = req.body;

      // Check if the user is authorized to create a worklog
      if (req.user.role !== "faculty" && req.user.role !== "user") {
          return res.status(403).json({ message: "You are not authorized to create a worklog." });
      }

      try {
          const worklog = new Worklog({
              name,
              userId: req.user.id, // The userId is taken from the JWT token
              workType,
              description,
              hoursSpent,
          });
          await worklog.save();
          res.status(201).json(worklog);
      } catch (error) {
          console.error("Error creating worklog:", error); // Log the specific error
          return res.status(500).json({ message: "Error creating worklog", error: error.message });
      }
  }
);

// Get Worklogs (Admin sees only approved, Users see only their own, Faculty sees all)
router.get("/", verifyToken, async (req, res) => {
    try {
        let worklogs;

        console.log(req.user); // Log user details

        if (req.user.role === "admin") {
            // Admin sees only approved worklogs
            worklogs = await Worklog.find({ status: "approved" });
            console.log(`Admin Worklogs Count: ${worklogs.length}`); // Log the count
        } else if (req.user.role === "faculty") {
            // Faculty sees all worklogs
            worklogs = await Worklog.find();
        } else {
            // Regular user sees only their own worklogs
            worklogs = await Worklog.find({ userId: req.user.id });
        }

        res.status(200).json(worklogs);
    } catch (error) {
        console.error("Error fetching worklogs:", error);
        res.status(500).json({ message: error.message });
    }
});

// Edit a Worklog (Users can edit only their own, Faculty can evaluate, Admin can update any)
router.put(
    "/:id",
    verifyToken,
    [
        check("name").optional().notEmpty().withMessage("Name is required"),
        check("workType").optional().notEmpty().withMessage("Work Type is required"),
        check("description").optional().isLength({ min: 5 }).withMessage("Description must be at least 5 characters long"),
        check("hoursSpent").optional().isFloat({ min: 0 }).withMessage("Hours spent must be a positive number"),
    ],
    async (req, res) => {
        const { name, workType, description, hoursSpent, status, remarks } = req.body;
    
        // Validate request data
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        try {
            let worklog;
    
            if (req.user.role === "admin") {
                worklog = await Worklog.findByIdAndUpdate(
                    req.params.id,
                    { name, workType, description, hoursSpent, status, remarks, evaluated: true },
                    { new: true }
                );
            } else if (req.user.role === "faculty") {
                worklog = await Worklog.findByIdAndUpdate(
                    req.params.id,
                    { status, remarks, evaluated: true }, // Ensure remarks are updated
                    { new: true }
                );
            } else {
                worklog = await Worklog.findOneAndUpdate(
                    { _id: req.params.id, userId: req.user.id },
                    { name, workType, description, hoursSpent },
                    { new: true }
                );
            }
    
            if (!worklog) {
                return res.status(404).json({ message: "Worklog not found or unauthorized" });
            }
    
            res.status(200).json(worklog);
        } catch (error) {
            console.error("Error updating worklog:", error);
            res.status(500).json({ message: error.message });
        }
    }
);

// Delete a Worklog (Only the owner can delete their worklog)
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const worklog = await Worklog.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

        if (!worklog) {
            return res.status(404).json({ message: "Worklog not found or unauthorized" });
        }

        res.status(204).send(); // No content response
    } catch (error) {
        console.error("Error deleting worklog:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
