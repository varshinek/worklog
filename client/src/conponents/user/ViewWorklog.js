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
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const UserViewWorklog = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [worklogs, setWorklogs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedWorklogId, setSelectedWorklogId] = useState(null);
  const [remarks, setRemarks] = useState({}); // State for remarks

  const fetchWorklogs = async () => {
    try {
      const response = await axios.get("http://localhost:3000/worklog", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setWorklogs(response.data);
      // Initialize remarks state
      const initialRemarks = response.data.reduce((acc, worklog) => {
        acc[worklog._id] = worklog.remark || ""; // Initialize remarks if they exist
        return acc;
      }, {});
      setRemarks(initialRemarks);
    } catch (error) {
      setError("Error fetching worklogs.");
    }
  };

  useEffect(() => {
    fetchWorklogs();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteWorklog = async () => {
    try {
      await axios.delete(`http://localhost:3000/worklog/${selectedWorklogId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setWorklogs(worklogs.filter((worklog) => worklog._id !== selectedWorklogId));
      handleCloseDialog();
    } catch (error) {
      setError("Error deleting worklog.");
    }
  };

  const handleOpenDialog = (worklogId) => {
    setSelectedWorklogId(worklogId);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedWorklogId(null);
  };

  const handleRemarkChange = (worklogId, newRemark) => {
    setRemarks((prevRemarks) => ({
      ...prevRemarks,
      [worklogId]: newRemark,
    }));
  };

  const handleSaveRemark = async (worklogId) => {
    try {
      await axios.put(`http://localhost:3000/worklog/${worklogId}`, {
        remark: remarks[worklogId],
      }, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      // Optionally fetch updated worklogs or update state here
    } catch (error) {
      setError("Error saving remark.");
    }
  };

  return (
    <div>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h5" gutterBottom>
            Your Submitted Worklogs
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Work Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Hours Spent</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Remarks</TableCell> {/* Added Remarks Column */}
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
                            color="secondary"
                            onClick={() => handleOpenDialog(worklog._id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
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
      </Container>

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this worklog?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteWorklog} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserViewWorklog;
