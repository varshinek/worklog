const mongoose = require("mongoose");

const worklogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: String, required: true },
    date: { type: Date, default: Date.now },
    workType: { type: String, required: true },
    description: { type: String, required: true },
    hoursSpent: { type: Number, required: true },
    evaluated: { type: Boolean, default: false }, // To indicate if the worklog has been evaluated
    status: { type: String, enum: ["approved", "rejected", "pending"], default: "pending" }, // Evaluation status
    remarks: { type: String }, // Remarks from faculty
    notifications: [{ message: String, date: { type: Date, default: Date.now } }] // Notifications array
});

module.exports = mongoose.model("Worklog", worklogSchema);
