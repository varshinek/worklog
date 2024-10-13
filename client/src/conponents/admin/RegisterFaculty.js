import React, { useState, useContext } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Snackbar,
  Box,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "./navbar";

const RegisterFaculty = () => {
  const { auth } = useContext(AuthContext);
  const [newFaculty, setNewFaculty] = useState({
    name: "",
    email: "",
    password: "",
    facultyId: "",
    role: "faculty",
    dateOfBirth: "", // New field
    gender: "", // New field
    phoneNumber: "", // New field
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error

    // Define the API endpoint for faculty registration
    const endpoint = "http://localhost:3000/faculty/register"; // Faculty registration endpoint

    try {
      // Send POST request to register faculty
      await axios.post(endpoint, newFaculty);
      
      setSuccess(true);
      setNewFaculty({ 
        name: "", 
        email: "", 
        password: "", 
        facultyId: "", 
        role: "faculty", 
        dateOfBirth: "", 
        gender: "", 
        phoneNumber: "" 
      }); // Reset form

      // Redirect to faculty dashboard after successful registration
      setTimeout(() => {
        navigate("/viewfacultydashboard");
      }, 2000); // Wait 2 seconds before redirecting

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error registering new faculty"); // Set error message for user
    }
  };

  return (
    <div>
      <Navbar />
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh", // Full height to center vertically
          }}
        >
          <Typography variant="h4" gutterBottom>
            Register Faculty
          </Typography>

          <form onSubmit={handleRegister} style={{ width: "100%", maxWidth: "400px" }}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={newFaculty.name}
              onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
              required
              margin="normal"
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={newFaculty.email}
              onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
              required
              margin="normal"
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              value={newFaculty.password}
              onChange={(e) => setNewFaculty({ ...newFaculty, password: e.target.value })}
              required
              margin="normal"
            />
            <TextField
              label="Faculty ID"
              variant="outlined"
              fullWidth
              value={newFaculty.facultyId}
              onChange={(e) => setNewFaculty({ ...newFaculty, facultyId: e.target.value })}
              required
              margin="normal"
            />
            <TextField
              label="Date of Birth"
              variant="outlined"
              type="date"
              fullWidth
              value={newFaculty.dateOfBirth}
              onChange={(e) => setNewFaculty({ ...newFaculty, dateOfBirth: e.target.value })}
              required
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Gender"
              variant="outlined"
              fullWidth
              select
              SelectProps={{ native: true }}
              value={newFaculty.gender}
              onChange={(e) => setNewFaculty({ ...newFaculty, gender: e.target.value })}
              required
              margin="normal"
            >
              <option value="" disabled></option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </TextField>
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              value={newFaculty.phoneNumber}
              onChange={(e) => setNewFaculty({ ...newFaculty, phoneNumber: e.target.value })}
              required
              margin="normal"
            />

            {/* The role is automatically set to "faculty" */}
            <input type="hidden" value={newFaculty.role} />

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Register
            </Button>
          </form>

          {/* Snackbar for success and error messages */}
          <Snackbar
            open={success}
            autoHideDuration={6000}
            onClose={() => setSuccess(false)}
            message="Faculty registered successfully!"
          />
          <Snackbar
            open={Boolean(error)}
            autoHideDuration={6000}
            onClose={() => setError("")}
            message={error}
          />
        </Box>
      </Container>
    </div>
  );
};

export default RegisterFaculty;
