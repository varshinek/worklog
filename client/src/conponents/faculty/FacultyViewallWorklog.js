import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TablePagination,
  Dialog,
  DialogContent,
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import FacultyEditWorklog from "./FacultyEditWorklog"; // Import the edit component
import Navbar from "./Navbar";

const FacultyViewAllWorklog = () => {
  const { user } = useContext(AuthContext);
  const [worklogs, setWorklogs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState("");
  const [selectedWorklog, setSelectedWorklog] = useState(null); // For the selected worklog to edit
  const [open, setOpen] = useState(false); // Manage dialog state

  const fetchAllWorklogs = async () => {
    try {
      const response = await axios.get("http://localhost:3000/worklog", {
        headers: {
          Authorization: `Bearer ${user?.token}`, // Ensure token is sent with requests
        },
      });
      setWorklogs(response.data);
    } catch (error) {
      setError("Error fetching all worklogs.");
    }
  };

  useEffect(() => {
    fetchAllWorklogs();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewClick = (worklog) => {
    setSelectedWorklog(worklog); // Set the selected worklog
    setOpen(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedWorklog(null); // Clear selected worklog when dialog closes
  };

  return (
    <div>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h5" gutterBottom>
            All Users' Worklogs
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User Name</TableCell>
                  <TableCell>Work Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Hours Spent</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Remark</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {worklogs.length > 0 ? (
                  worklogs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((worklog) => (
                      <TableRow key={worklog._id}>
                        <TableCell>{worklog.name}</TableCell>
                        <TableCell>{worklog.workType}</TableCell>
                        <TableCell>{worklog.description}</TableCell>
                        <TableCell>{worklog.hoursSpent}</TableCell>
                        <TableCell>{worklog.status}</TableCell>
                        <TableCell>{worklog.remarks}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleViewClick(worklog)}
                            aria-label={`View worklog for ${worklog.name}`} // Add an accessible label for screen readers
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No worklogs available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={worklogs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Dialog for Editing Worklog */}
        <Dialog
          open={open}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          aria-labelledby="edit-worklog-dialog" // Associate with accessible label
        >
          <DialogContent>
            {selectedWorklog && (
              <FacultyEditWorklog
                worklog={selectedWorklog}
                onClose={handleCloseDialog}
                fetchAllWorklogs={fetchAllWorklogs} // Fetch all worklogs after update
              />
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </div>
  );
};

export default FacultyViewAllWorklog;
