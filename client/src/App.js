import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./conponents/login/Login"
import AdminLogin from "./conponents/login/adminlogin"
import UserViewWorklog from "./conponents/user/ViewWorklog";
import RegisterUser from "./conponents/admin/RegisterUser"
import RegisterFaculty from "./conponents/admin/RegisterFaculty";
import ViewUserDashboard from "./conponents/admin/ViewUser";
import ViewFacultyDashboard from "./conponents/admin/ViewFaculty";
import { AuthProvider } from "./context/AuthContext";
import CreateWorklog from "./conponents/user/CreateWorklog";
import FacultyViewAllWorklog from "./conponents/faculty/FacultyViewallWorklog";
import FacultyEditWorklog from "./conponents/faculty/FacultyEditWorklog";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login /> } />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/registeruser" element={<RegisterUser />} />
          <Route path="/registerfaculty" element={<RegisterFaculty />} />
          <Route path="/viewuserdashboard" element={<ViewUserDashboard />} />
          <Route path="/viewfacultydashboard" element={<ViewFacultyDashboard />} />
          <Route path="/createworklog" element={<CreateWorklog />} />
          <Route path="/viewworklog" element={<UserViewWorklog />} />
          <Route path="/worklog" element={<FacultyViewAllWorklog />} />
          <Route path="/facutyworklog" element={<FacultyViewAllWorklog />} />
        </Routes>
      </Router>
    </AuthProvider>
    
  )
}

export default App;