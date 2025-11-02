import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./components/ui/login/login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";
import ErrorPage from "../src/404/ErrorPage";
import { MainProvider } from "./context/MainContext";

// Admin pages
import AdminDashboard from "./pages/adminPages/Dashboard";
import AdminRegistration from "./pages/adminPages/Registration";
import AdminDiaries from "./pages/adminPages/InternDailyDiaries";
import AdminTask from "./pages/adminPages/Task";
import AdminLerningHub from "./pages/adminPages/LearningHub";
import AdminLeave from "./pages/adminPages/Leave";
import AdminResource from "./pages/adminPages/Resource";
import AdminProfile from "./pages/adminPages/Profile";
import AdminEditProfile from "./pages/adminPages/ProfileEdit";

// Employee pages
import EmployeeDashboard from "./pages/employeePages/Dashboard";
import EmployeeDairySubmit from "./pages/employeePages/DairySubmit";
import EmployeeLeave from "./pages/employeePages/LeaveForm";
import EmployeeTaskManagement from "./pages/employeePages/TaskManagement";
import EmployeeMyTask from "./pages/employeePages/mytask";
import EmployeeTaskDetails from "./pages/employeePages/taskdetails";
import EmployeeLearningHub from "./pages/employeePages/Learninghub";
import EmployeeCourse from "./pages/employeePages/CourseDetails";
import EmployeeProfile from "./pages/employeePages/Profile";
import EmployeeEditProfile from "./pages/employeePages/ProfileEdit"
import ViewMember from "./pages/adminPages/viewMember";
import AttendanceHistroy from "./pages/adminPages/attendanceHistroy";
import CreateNotification from "./pages/adminPages/createNotification";
import NotificationCenter from "./pages/employeePages/NotificationCenter";
import ForgotPassword from "./components/ui/login/ForgotPassword";

function App() {
  return (
    <MainProvider>
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
<Route path="/forgotpassword" element={<ForgotPassword />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="registration" element={<AdminRegistration />} />
            <Route path="diaries" element={<AdminDiaries />} />
            <Route path="task" element={<AdminTask />} />
            <Route path="learn_hubForm" element={<AdminLerningHub />} />
            <Route path="leave" element={<AdminLeave />} />
            <Route path="resource" element={<AdminResource />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="a-profile-edit" element={<AdminEditProfile />} />
            <Route path = "viewmember" element={<ViewMember />} />
            <Route path = "attendanceHistory" element={<AttendanceHistroy />} />
            <Route path = "createNotification" element={<CreateNotification />} />


            
          </Route>
        </Route>

        {/* Employee Routes */}
        <Route path="/employee" element={<ProtectedRoute allowedRoles={['employee']} />}>
          <Route element={<EmployeeLayout />}>
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="leave-form" element={<EmployeeLeave />} />
            <Route path="taskManagement" element={<EmployeeTaskManagement />} />
            <Route path="dairy-submit" element={<EmployeeDairySubmit />} />
            <Route path="my-tasks" element={<EmployeeMyTask />} />
            <Route path="taskdetails" element={<EmployeeTaskDetails />} />
            <Route path="learninghub" element={<EmployeeLearningHub />} />
            <Route path="course" element={<EmployeeCourse />} />
            <Route path="profile" element={<EmployeeProfile />} />
            <Route path="profileEdit" element={<EmployeeEditProfile />} />
            <Route path="course/:id" element={<EmployeeCourse />} />
            <Route path="notification" element={<NotificationCenter />} />

          </Route>
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
    </MainProvider>
  );
}

export default App;
