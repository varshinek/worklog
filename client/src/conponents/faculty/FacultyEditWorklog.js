import axios from 'axios';
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; // For user token authentication
import { Button, TextField, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const FacultyEditWorklog = ({ worklog, onClose, fetchAllWorklogs }) => {
  const { user } = useContext(AuthContext); // Getting user token from context
  const validStatuses = ['Approved', 'Rejected', 'Pending']; // Define valid statuses
  const [status, setStatus] = useState(validStatuses.includes(worklog.status) ? worklog.status : ''); // Manage worklog status state
  const [remark, setRemark] = useState(worklog.remarks || ''); // Manage worklog remark state
  const [error, setError] = useState('');

  // Handle form submit for updating worklog
  const handleFormSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const updatedWorklog = {
      ...worklog,
      status,
      remarks: remark, // Ensure we are updating the remark in the DB
    };

    try {
      const response = await axios.put(
        `http://localhost:3000/worklog/${worklog._id}`, // Use correct worklog ID
        updatedWorklog,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`, // Pass token for authentication
          },
        }
      );
      console.log('Worklog updated successfully:', response.data);

      fetchAllWorklogs(); // Fetch all updated worklogs after edit
      onClose(); // Close the form/modal after successful update
    } catch (error) {
      setError('Error updating worklog.');
      console.error('Error updating worklog:', error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleFormSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}
    >
      <Typography variant="h6">Edit Worklog</Typography>

      {/* Display Worklog Fields (non-editable) */}
      <TextField
        label="User Name"
        value={worklog.name}
        InputProps={{ readOnly: true }}
        fullWidth
      />
      <TextField
        label="Work Type"
        value={worklog.workType}
        InputProps={{ readOnly: true }}
        fullWidth
      />
      <TextField
        label="Description"
        value={worklog.description}
        InputProps={{ readOnly: true }}
        multiline
        fullWidth
      />
      <TextField
        label="Hours Spent"
        value={worklog.hoursSpent}
        InputProps={{ readOnly: true }}
        fullWidth
      />

      {/* Editable Fields */}
      <FormControl fullWidth>
        <InputLabel>Status</InputLabel>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {validStatuses.map((validStatus) => (
            <MenuItem key={validStatus} value={validStatus}>
              {validStatus}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Remark"
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
        multiline
        fullWidth
      />

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="contained" color="primary" type="submit">
          Save Changes
        </Button>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default FacultyEditWorklog;
