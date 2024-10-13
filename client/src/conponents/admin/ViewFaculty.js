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
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";

const FacultyDashboard = () => {
  const { user: auth } = useContext(AuthContext); // Get authentication context
  const [error, setError] = useState(""); // State for error messages
  const [success, setSuccess] = useState(""); // State for success messages
  const [facultyList, setFacultyList] = useState([]); // State for the list of faculty members
  const navigate = useNavigate(); // Hook for navigation

  // Log the auth object to check if it's correctly populated
  console.log("Auth object: ", auth);

  // Fetch faculty list when component mounts
  useEffect(() => {
    const fetchFacultyList = async () => {
      if (!auth?.token) {
        setError("No token found. Please log in again.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/faculty", {
          headers: { Authorization: `Bearer ${auth?.token}` },
        });
        console.log(response.data); // Check the response data
        setFacultyList(response.data); // Assuming response contains an array of faculty members
      } catch (error) {
        console.error("Error Details:", error.response ? error.response.data : error.message);
        setError("Failed to fetch faculty list"); // Set error message for user
      }
    };

    fetchFacultyList();
  }, [auth]);

  // Delete faculty function
  const handleDelete = async (facultyId) => {
    try {
      await axios.delete(`http://localhost:3000/faculty/${facultyId}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      setSuccess("Faculty deleted successfully!"); // Set success message
      setFacultyList(facultyList.filter((faculty) => faculty._id !== facultyId)); // Remove deleted faculty from state
    } catch (error) {
      console.error("Failed to delete faculty:", error);
      setError("Failed to delete faculty"); // Set error message if deletion fails
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
          Faculty Dashboard
        </Typography>

        {/* Snackbar for success messages */}
        <Snackbar
          open={Boolean(success)}
          autoHideDuration={6000}
          onClose={() => setSuccess("")}
          message={success}
        />

        {/* Snackbar for error messages */}
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={() => setError("")}
          message={error}
        />

        <Typography variant="h6" gutterBottom style={{ marginTop: "40px" }}>
          Registered Faculty:
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Faculty ID</TableCell>
                <TableCell>Actions</TableCell> {/* Actions Column */}
              </TableRow>
            </TableHead>
            <TableBody>
              {facultyList.map((faculty) => (
                <TableRow key={faculty._id}>
                  <TableCell>{faculty.name}</TableCell>
                  <TableCell>{faculty.email}</TableCell>
                  <TableCell>{faculty.facultyId}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDelete(faculty._id)} // Call handleDelete on button click
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
};

export default FacultyDashboard;
