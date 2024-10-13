import React, { useContext, useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"; // Menu icon for opening the sidebar
import WorkIcon from "@mui/icons-material/Work"; // Worklog-related icons
import AddIcon from "@mui/icons-material/Add";
import ExitToAppIcon from "@mui/icons-material/ExitToApp"; // Logout icon
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Adjust path if needed

const UserNavbar = () => {
  const { logout } = useContext(AuthContext); // Access logout function from AuthContext
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State to control drawer

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to login page after logout
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsDrawerOpen(open);
  };

  return (
    <>
      {/* Top Toolbar with menu button */}
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)} // Open the drawer
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap style={{ flexGrow: 1 }}>
          User Dashboard
        </Typography>
      </Toolbar>

      {/* Drawer for the sidebar */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="100vh"
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
          style={{ width: 250 }}
        >
          {/* Top List Items */}
          <List>
            <ListItem button onClick={() => navigate("/createworklog")}>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Create Worklog" />
            </ListItem>

            <ListItem button onClick={() => navigate("/viewworklog")}>
              <ListItemIcon>
                <WorkIcon />
              </ListItemIcon>
              <ListItemText primary="View Worklog" />
            </ListItem>
          </List>

          {/* Bottom Logout Button */}
          <List>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default UserNavbar;
