/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaUser,
  FaRegClock,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { BsCheckCircleFill, BsFillPersonFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import defaultProfileImage from "../../assets/demo.jpg";
import api from "../../utils/api";
const BASE_URL = import.meta.env.VITE_API_URL_;

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalAttendance: 0,
    leaveRequests: 0,
    leave_count: 0,
    late_count: 0,
    task_completion: 0,
    totalMembers: 0,
  });
  const [url] = useState(BASE_URL);
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const tasksPerPage = 5;

  const summary = [
    {
      title: "Total Members",
      value: dashboardData.totalMembers,
      color: "bg-gray-100",
      icon: <BsFillPersonFill className="text-gray-600" />,
    },
    {
      title: "Present Today",
      value: dashboardData.totalAttendance,
      color: "bg-blue-100",
      icon: <BsCheckCircleFill className="text-blue-600" />,
    },
    {
      title: "Leave Request",
      value: dashboardData.leaveRequests,
      color: "bg-yellow-100",
      icon: <FaRegClock className="text-yellow-600" />,
    },
    {
      title: "Tasks Completed",
      value: dashboardData.task_completion,
      color: "bg-green-100",
      icon: <BsCheckCircleFill className="text-green-600" />,
    },
    {
      title: "On Leave",
      value: dashboardData.leave_count,
      color: "bg-orange-100",
      icon: <IoMdTime className="text-orange-600" />,
    },
    {
      title: "Late Arrivals",
      value: dashboardData.late_count,
      color: "bg-red-100",
      icon: <FaRegClock className="text-red-600" />,
    },
  ];

  // Fixed search functionality
  const filteredTasks = attendanceData.filter((attendance) => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase().trim();
    
    // Check multiple possible fields for name
    const firstName = attendance.userId?.firstName || attendance.firstName || "";
    const lastName = attendance.userId?.lastName || attendance.lastName || "";
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    
    // Check multiple possible fields for ID
    const employeeId = attendance.userId?._id || attendance.userId?.employeeId || attendance.employeeId || attendance._id || "";
    
    // Also check email if available
    const email = attendance.userId?.email || attendance.email || "";

    return (
      fullName.includes(searchLower) ||
      employeeId.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower) ||
      firstName.toLowerCase().includes(searchLower) ||
      lastName.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
    switch (status.toLowerCase()) {
      case "attended":
      case "present":
        return "bg-green-100 text-green-800";
      case "late":
        return "bg-yellow-100 text-yellow-800";
      case "absent":
        return "bg-red-100 text-red-800";
      case "leave":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to safely get user data
  const getUserData = (attendance) => {
    // If userId exists and has data, use it, otherwise use attendance directly
    if (attendance.userId && (attendance.userId.firstName || attendance.userId._id)) {
      return {
        firstName: attendance.userId.firstName,
        lastName: attendance.userId.lastName,
        employeeId: attendance.userId._id,
        profileImage: attendance.userId.profileImage,
        email: attendance.userId.email
      };
    } else {
      return {
        firstName: attendance.firstName,
        lastName: attendance.lastName,
        employeeId: attendance.employeeId || attendance._id,
        profileImage: attendance.profileImage,
        email: attendance.email
      };
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = Cookies.get("token");

        if (!token) {
          alert("Unauthorized. Please log in.");
          navigate("/login");
          return;
        }

        const [dashboardRes, attendanceRes] = await Promise.all([
          api.get("/admin/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/admin/attendance_sheet", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setDashboardData(dashboardRes.data);
        setAttendanceData(attendanceRes.data);
        console.log("Dashboard Data:", dashboardRes.data);
        console.log("Attendance Data:", attendanceRes.data);
        console.log("URL:", url);
        setLoading(false);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        alert("Failed to load dashboard data. Please try again.");
        if (err.response?.status === 401) {
          navigate("/login");
        }
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, url]);

  const formatTimeDisplay = (timeString) => {
    if (!timeString) return "N/A";

    // If it's already in "08:43 AM" format, just return it
    if (
      typeof timeString === "string" &&
      /^\d{1,2}:\d{2} [AP]M$/i.test(timeString)
    ) {
      return timeString;
    }

    // If it's a full ISO date string, extract time
    if (typeof timeString === "string" && timeString.includes('T')) {
      try {
        const date = new Date(timeString);
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
      } catch (e) {
        return "Invalid Time";
      }
    }

    return "N/A";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center flex-col gap-5 min-h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-8 border-dotted border-t-red-500 border-r-blue-500 border-b-red-500 border-l-green-500"></div>
        <p className="text-2xl text-blue-900">Loading .... </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-16 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Employee Dashboard
        </h1>
        <div className="w-full flex justify-end">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, ID, or email..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
        
        {/* Search results info */}
        {searchTerm && (
          <div className="mt-2 text-sm text-gray-600">
            Found {filteredTasks.length} results for "{searchTerm}"
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mb-8">
        {summary.map((s, i) => (
          <div
            key={i}
            className={`${s.color} p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center`}
          >
            <div className="p-3 rounded-full bg-white mr-4">{s.icon}</div>
            <div>
              <div className="text-lg font-bold text-gray-800">{s.value}</div>
              <div className="text-sm text-gray-600">{s.title}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Today's Attendance
          </h2>
        </div>

        <div className="hidden md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-in Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTasks.length > 0 ? (
                currentTasks.map((attendance, i) => {
                  const user = getUserData(attendance);
                  return (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                            {user.profileImage ? (
                              <img
                                src={`${BASE_URL}/uploads/${user.profileImage}`}
                                alt={`${user.firstName || "User"} profile`}
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = defaultProfileImage;
                                }}
                              />
                            ) : (
                              <FaUser className="h-full w-full text-gray-400 p-2" />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.employeeId || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span>{formatTimeDisplay(attendance.time)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            attendance.status
                          )}`}
                        >
                          {attendance.status ? 
                            attendance.status.charAt(0).toUpperCase() +
                            attendance.status.slice(1).toLowerCase()
                            : "Unknown"
                          }
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? "No matching records found" : "No attendance records available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile view */}
        <div className="md:hidden divide-y divide-gray-200">
          {currentTasks.length > 0 ? (
            currentTasks.map((attendance, i) => {
              const user = getUserData(attendance);
              return (
                <div key={i} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                        {user.profileImage ? (
                          <img
                            src={`${BASE_URL}/uploads/${user.profileImage}`}
                            alt={`${user.firstName || "User"} profile`}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = defaultProfileImage;
                            }}
                          />
                        ) : (
                          <FaUser className="h-full w-full text-gray-400 p-2" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.employeeId || "N/A"}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        attendance.status
                      )}`}
                    >
                      {attendance.status ? 
                        attendance.status.charAt(0).toUpperCase() +
                        attendance.status.slice(1).toLowerCase()
                        : "Unknown"
                      }
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-900">
                    <span>Check-in: {formatTimeDisplay(attendance.time)}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-gray-500">
              {searchTerm ? "No matching records found" : "No attendance records available"}
            </div>
          )}
        </div>
      </div>

      {filteredTasks.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{indexOfFirstTask + 1}</span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(indexOfLastTask, filteredTasks.length)}
            </span>{" "}
            of <span className="font-medium">{filteredTasks.length}</span>{" "}
            results
            {searchTerm && (
              <span className="ml-2">for "{searchTerm}"</span>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === pageNum
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;