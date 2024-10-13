// Navbar.js
import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to login page after logout
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Admin Dashboard
        </Typography>
        <Button color="inherit" onClick={() => navigate("/registeruser")}>
          Register User
        </Button>
        <Button color="inherit" onClick={() => navigate("/registerfaculty")}>
          Register Faculty
        </Button>
        <Button color="inherit" onClick={() => navigate("/viewuserdashboard")}>
          View Users
        </Button>
        <Button color="inherit" onClick={() => navigate("/viewfacultydashboard")}>
          View Faculty
        </Button>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
