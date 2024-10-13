const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const connectDB = require("./database/db");

// Correct route imports
const adminRoutes = require("./routes/admin");        // Corrected: Routes for Admin
const userRoutes = require("./routes/user");          // Corrected: Routes for Users
const facultyRoutes = require("./routes/faculty");    // Corrected: Routes for Faculty
const worklogRoutes = require("./routes/worklog");    // Corrected: Routes for Worklogs
const notificationRoutes = require("./routes/notification"); // Corrected: Routes for Notifications

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Connect to the Database
connectDB();

// Use Routes
app.use("/admin", adminRoutes);             // Fixed: Use admin routes
app.use("/users", userRoutes);              // Fixed: Use user routes
app.use("/faculty", facultyRoutes);         // Fixed: Use faculty routes
app.use("/worklog", worklogRoutes);         // Fixed: Use worklog routes
app.use("/notifications", notificationRoutes); // Fixed: Use notification routes

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
