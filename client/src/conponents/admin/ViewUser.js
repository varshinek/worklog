import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Typography,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";

const UserDashboard = () => {
  const { user: auth } = useContext(AuthContext); // Get authentication context
  const [error, setError] = useState(""); // State for error messages
  const [success, setSuccess] = useState(""); // State for success messages
  const [userList, setUserList] = useState([]); // State for the list of users
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchUserList = async () => {
      if (!auth?.token) {
        setError("Authentication token is missing.");
        return;
      }
      try {
        const response = await axios.get("http://localhost:3000/users", {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        console.log("API Response: ", response.data); // Log API response
        setUserList(response.data); // Assuming response contains an array of users
      } catch (error) {
        console.error("Failed to fetch user list:", error.response?.data || error.message);
        setError("Failed to fetch user list"); // Set error message for user
      }
    };

    fetchUserList();
  }, [auth]);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/users/${userId}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setSuccess("User deleted successfully!"); // Set success message
      setUserList(userList.filter((user) => user._id !== userId)); // Remove deleted user from state
    } catch (error) {
      console.error("Failed to delete user:", error.response?.data || error.message);
      setError("Failed to delete user"); // Set error message if deletion fails
    }
  };

  return (
    <div>
      <Navbar />
      <Container>
        <Typography
          style={{
            display: "flex",
            marginTop: "50px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          variant="h4"
          gutterBottom
        >
          User Dashboard
        </Typography>

        <Snackbar
          open={Boolean(success)}
          autoHideDuration={6000}
          onClose={() => setSuccess("")}
          message={success}
        />

        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={() => setError("")}
          message={error}
        />

        <Typography variant="h6" gutterBottom style={{ marginTop: "40px" }}>
          Registered Users:
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Actions</TableCell> {/* Actions Column */}
              </TableRow>
            </TableHead>
            {userList.length === 0 ? (
              <Typography>No users found</Typography>
            ) : (
              <TableBody>
                {userList.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.userId}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDelete(user._id)} // Call handleDelete on button click
                        startIcon={<DeleteIcon />}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
};

export default UserDashboard;
