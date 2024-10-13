import React, { useState, useContext, useEffect } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { jwtDecode } from "jwt-decode"; // Correct import

const CreateWorklog = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [worklogData, setWorklogData] = useState({
    workType: "",
    description: "",
    hoursSpent: "",
    name: "",
    userId: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [decodedToken, setDecodedToken] = useState(null); // Store the decoded token

  // Decode the token and set name and userId
  useEffect(() => {
    if (user && user.token) {
      try {
        const decoded = jwtDecode(user.token); // Decode the token
        setDecodedToken(decoded); // Save the decoded token in state

        // Set name and userId from the decoded token
        setWorklogData((prevData) => ({
          ...prevData,
          name: decoded.name || "",
          userId: decoded.userId || decoded._id || "",
        }));
      } catch (error) {
        console.error("Error decoding token:", error);
        setError("Invalid token. Please log in again.");
      }
    }
  }, [user]);

  // Function to handle form changes
  const handleChange = (e) => {
    setWorklogData({ ...worklogData, [e.target.name]: e.target.value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.token) {
        setError("You are not authorized to submit a worklog.");
        return;
    }

    try {
        const response = await axios.post(
            "http://localhost:3000/worklog",
            {
                ...worklogData,
                evaluated: false,
                status: "pending",
            },
            {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
        );

        setSuccessMessage("Worklog created successfully!");
        // Reset worklogData after submission
        setWorklogData({
            workType: "",
            description: "",
            hoursSpent: "",
            name: decodedToken.name,
            userId: decodedToken.userId,
        });

        navigate("/viewworklog");
    } catch (error) {
        console.error("Error creating worklog:", error);
        if (error.response) {
            console.error("Server Response:", error.response.data);
            if (Array.isArray(error.response.data.errors)) {
                setError(`Error: ${error.response.data.errors.map(err => err.message).join(', ')}`);
            } else {
                setError(`Error: ${error.response.data.message || "Bad Request"}`);
            }
        } else if (error.request) {
            setError("No response received from the server. Please try again.");
        } else {
            setError("An unexpected error occurred. Please try again.");
        }
    }
};

if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            You must be logged in to create a worklog.
          </Typography>
          <Button onClick={() => navigate("/login")} variant="contained">
            Go to Login
          </Button>
        </Paper>
      </Container>
    );
}

return (
  <div>
    <Navbar />
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Create Worklog
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {successMessage && (
          <Typography color="success" sx={{ mb: 2 }}>
            {successMessage}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Name"
              name="name"
              value={worklogData.name || ""}
              fullWidth
              disabled
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              label="User ID"
              name="userId"
              value={worklogData.userId || ""}
              fullWidth
              disabled
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              label="Work Type"
              name="workType"
              value={worklogData.workType || ""}
              onChange={handleChange}
              fullWidth
              required
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              label="Description"
              name="description"
              value={worklogData.description || ""}
              onChange={handleChange}
              fullWidth
              required
              multiline
              rows={4}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              label="Hours Spent"
              name="hoursSpent"
              type="number"
              value={worklogData.hoursSpent || ""}
              onChange={handleChange}
              fullWidth
              required
            />
          </Box>

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit Worklog
          </Button>
        </form>
      </Paper>
    </Container>
  </div>
);
};

export default CreateWorklog;
