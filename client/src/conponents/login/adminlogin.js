import React, { useState, useContext } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error
    try {
      const response = await axios.post("http://localhost:3000/admin/login", {
        email,
        password,
      });

      const { token } = response.data;
      console.log(response.data);
      console.log("admin logged in");
      // Store the token and trigger login
      login(token);

      // Redirect to the dashboard
      navigate("/registeruser");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "50px",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Admin Login
        </Typography>

        <form onSubmit={handleLogin} style={{ width: "100%" }}>
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

          {error && (
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
          )}

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
          <Button variant="contained" color="primary" fullWidth onClick={() => navigate("/")} style={{ marginTop: "10px" }}>Back</Button>
        </form>
      </Box>
    </Container>
  );
};

export default AdminLoginForm;
