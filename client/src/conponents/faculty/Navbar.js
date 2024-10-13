import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const FacultyNavbar = () => {
  const { user, logout } = useContext(AuthContext); // Assuming logout is part of AuthContext
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear authentication and logout (if you have a logout function)
    navigate("/"); // Redirect to login page
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Left-aligned content */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Faculty
        </Typography>

        {/* Right-aligned logout button */}
        <Box>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default FacultyNavbar;
