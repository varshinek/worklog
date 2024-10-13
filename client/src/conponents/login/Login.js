import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import logoImage from '../../asserts/logo.jpg'; // Adjusted the path for your logo image

const AdminUserFacultyLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // Initially empty
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error
  
    let endpoint;
    if (role === "user") {
      endpoint = "http://localhost:3000/users/login";
    } else if (role === "faculty") {
      endpoint = "http://localhost:3000/faculty/login";
    } else {
      setError("Please select a role.");
      return;
    }
  
    try {
      const response = await axios.post(endpoint, {
        email,
        password,
      });
  
      const { token, user: userInfo } = response.data; // Ensure user info is retrieved
  
      // Store the token and user info in context
      login(token, userInfo); // Correctly pass both token and userInfo
  
      // Navigate based on the role
      if (role === "user") {
        navigate("/viewworklog");
      } else {
        navigate("/facutyworklog");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Invalid email or password");
      } else if (err.request) {
        setError("Server is not responding. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };
  

  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={12} sm={6}>
        <Box
          sx={{
            backgroundImage: `url(${logoImage})`, 
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%",
          }}
        />
      </Grid>

      <Button 
              variant="outlined" 
              color="primary" 
              size="small" 
              style={{ position: 'absolute', top: '10px', right: '10px' }} 
              onClick={() => navigate("/adminlogin")} // Adjust the path to your admin login page
            >
              Admin Login
            </Button>
            
      <Grid item xs={12} sm={6} display="flex" justifyContent="center" alignItems="center">
        <Container maxWidth="sm">
          <Paper elevation={10} style={{ padding: "30px", textAlign: "center", position: 'relative' }}>
            

            <Typography variant="h4" gutterBottom>
              Login
            </Typography>

            <form onSubmit={handleLogin} style={{ width: "100%" }}>
              <Box sx={{ marginBottom: "20px" }}>
                <FormControl fullWidth required>
                  <InputLabel id="role-label">Select Role</InputLabel>
                  <Select
                    labelId="role-label"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <MenuItem value="" disabled>Select your role</MenuItem>
                    <MenuItem value="faculty">Faculty</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ marginBottom: "20px" }}>
                <TextField 
                  id="outlined-email" 
                  label="Email" 
                  variant="outlined" 
                  fullWidth 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </Box>

              <Box sx={{ marginBottom: "20px" }}>
                <TextField 
                  id="outlined-password" 
                  label="Password" 
                  variant="outlined" 
                  type="password" 
                  fullWidth 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </Box>

              {error && <Typography color="error" gutterBottom>{error}</Typography>}

              <Button type="submit" variant="contained" color="primary" fullWidth>
                Login
              </Button>
            </form>
          </Paper>
        </Container>
      </Grid>
    </Grid>
  );
};

export default AdminUserFacultyLoginForm;
