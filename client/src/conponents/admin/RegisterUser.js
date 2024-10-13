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

const RegisterUser = () => {
  const { auth } = useContext(AuthContext);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    userId: "",
    role: "user",
    dateOfBirth: "", // New field for date of birth
    gender: "male", // Default value for gender
    phoneNumber: "", // New field for phone number
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate(); 

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
  
    const endpoint = "http://localhost:3000/users/register"; 
  
    try {
      await axios.post(endpoint, newUser);
  
      setSuccess(true);
      setNewUser({ 
        name: "", 
        email: "", 
        password: "", 
        userId: "", 
        role: "user", 
        dateOfBirth: "", 
        gender: "male", // Reset gender to default
        phoneNumber: "" 
      }); // Reset form
  
      setTimeout(() => {
        navigate("/viewuserdashboard");
      }, 2000); 
  
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error registering new user");
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
            height: "100vh",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Register User
          </Typography>

          <form onSubmit={handleRegister} style={{ width: "100%", maxWidth: "400px" }}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
              margin="normal"
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
              margin="normal"
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
              margin="normal"
            />
            <TextField
              label="User ID"
              variant="outlined"
              fullWidth
              value={newUser.userId}
              onChange={(e) => setNewUser({ ...newUser, userId: e.target.value })}
              required
              margin="normal"
            />
            <TextField
              label="Date of Birth"
              variant="outlined"
              type="date"
              fullWidth
              value={newUser.dateOfBirth}
              onChange={(e) => setNewUser({ ...newUser, dateOfBirth: e.target.value })}
              required
              margin="normal"
              InputLabelProps={{ shrink: true }} // Keeps label shrunk when date is picked
            />
            <TextField
              label="Gender"
              variant="outlined"
              select
              fullWidth
              SelectProps={{ native: true }}
              value={newUser.gender}
              onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}
              margin="normal"
              required // Make gender selection required
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
              value={newUser.phoneNumber}
              onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
              required
              margin="normal"
            />
            
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Register
            </Button>
          </form>

          <Snackbar
            open={success}
            autoHideDuration={6000}
            onClose={() => setSuccess(false)}
            message="User registered successfully!"
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

export default RegisterUser;
