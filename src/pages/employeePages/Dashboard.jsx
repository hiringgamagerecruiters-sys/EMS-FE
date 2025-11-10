import React, { useEffect, useState, useContext } from "react";
import { FiChevronDown, FiChevronUp, FiCalendar, FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import AttendanceModel from "../../components/attendancePopUp";
import { MainContext } from "../../context/MainContext";
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import api from "../../utils/api";

function Dashboard() {
  const navigate = useNavigate();
  const { date, time } = useContext(MainContext);

  const [showAttendancePopUp, setShowAttendancePopUp] = useState(false);
  const [hasAttendedToday, setHasAttendedToday] = useState(false); 
  const [attendanceHistory, setAttendanceHistory] = useState([]); 
  const [showAllHistory, setShowAllHistory] = useState(false); 
  const [currentTimeStatus, setCurrentTimeStatus] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const visibleHistoryCount = 4;

  // Deduplicate attendance records by date
  const getUniqueAttendanceDays = (history) => {
    const uniqueDays = {};
    return history.filter(item => {
      const dateKey = item.date;
      if (!uniqueDays[dateKey]) {
        uniqueDays[dateKey] = true;
        return true;
      }
      return false;
    });
  };

  // Check current time and set status
  const checkTimeStatus = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    // Define time boundaries in minutes
    const startTime = 8 * 60; // 8:00 AM
    const earlyEndTime = 8 * 60 + 30; // 8:30 AM
    const endTime = 17 * 60 + 30; // 5:30 PM
    
    if (currentTimeInMinutes < startTime) {
      setCurrentTimeStatus("beforehours");
    } else if (currentTimeInMinutes >= startTime && currentTimeInMinutes < earlyEndTime) {
      setCurrentTimeStatus("early");
    } else if (currentTimeInMinutes >= earlyEndTime && currentTimeInMinutes <= endTime) {
      setCurrentTimeStatus("ontime");
    } else {
      setCurrentTimeStatus("afterhours");
    }
  };

  // Handle marking attendance
  const handleMakeAttendance = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setHasAttendedToday(true); // Immediately disable button
    
    if (currentTimeStatus === "beforehours") {
      alert("Attendance can only be marked after 8:00 AM.");
      setHasAttendedToday(false);
      setIsSubmitting(false);
      return;
    }
    
    if (currentTimeStatus === "afterhours") {
      alert("Attendance cannot be marked after 5:30 PM.");
      setHasAttendedToday(false);
      setIsSubmitting(false);
      return;
    }

    const payload = {
      date: date,
      time: time,
    };

    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Please log in first.");
        navigate('/login');
        setHasAttendedToday(false);
        setIsSubmitting(false);
        return;
      }

      console.log("Sending attendance data:", payload);

      const response = await api.post(
        "/employee/attendance",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert(response.data.msg || "Attendance recorded successfully!");
      setShowAttendancePopUp(false);
      // Keep hasAttendedToday as true
      fetchAttendanceHistory();

    } catch (error) {
      console.error("Attendance submission error:", error);
      // Re-enable button on error
      setHasAttendedToday(false);
      
      if (error.response?.status === 401) {
        alert('Session expired. Please log in again.');
        navigate('/login');
      } else if (error.response?.status === 409) {
        // Handle duplicate attendance from server
        alert("Attendance already recorded for today.");
        setHasAttendedToday(true);
      } else {
        alert("Failed to submit attendance. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchAttendanceStatus = async () => {
    try {
      const token = Cookies.get('token');

      if (!token) {
        alert('Unauthorized. Please log in.');
        navigate('/login');
        return;
      }

      const attendanceStatusResponse = await api.get('/employee/is_attendance', {
        params: { date: date },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const attendanceData = attendanceStatusResponse.data.attendance;

      // Properly check if attendance already exists for today
      if (attendanceData && attendanceData.date === date) {
        setHasAttendedToday(true);
      } else {
        setHasAttendedToday(false);
      }

      await fetchAttendanceHistory();

    } catch (err) {
      console.error('❌ Attendance fetch error:', err);
      if (err.response?.status === 401) {
        alert('Session expired. Please log in again.');
        navigate('/login');
      } else {
        alert('Failed to check attendance status. Please try again.');
      }
    }
  };

  const fetchAttendanceHistory = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        alert('Unauthorized. Please log in.');
        navigate('/login');
        return;
      }
      const historyResponse = await api.get('/employee/attendance/history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     
      const sortedHistory = historyResponse.data.sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('/').map(Number);
        const [dayB, monthB, yearB] = b.date.split('/').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        return dateB - dateA; 
      });

      setAttendanceHistory(sortedHistory);
    } catch (err) {
      console.error('❌ Attendance history fetch error:', err);
    }
  };

  useEffect(() => {
    fetchAttendanceStatus();
    checkTimeStatus();
    
    // Check time status every minute
    const interval = setInterval(checkTimeStatus, 60000);
    
    return () => clearInterval(interval);
  }, [navigate, date]); 

  const closePopUp = () => setShowAttendancePopUp(false);
  const toggleShowAllHistory = () => setShowAllHistory(prev => !prev);

  // Use deduplicated history for display and calculations
  const uniqueAttendanceHistory = getUniqueAttendanceDays(attendanceHistory);
  const displayedHistory = showAllHistory
    ? uniqueAttendanceHistory
    : uniqueAttendanceHistory.slice(0, visibleHistoryCount);

  const totalDays = uniqueAttendanceHistory.length;
  const attendedDays = uniqueAttendanceHistory.filter(item => item.status === "Attended").length;
  const leaveDays = uniqueAttendanceHistory.filter(item => item.status === "Leave").length;
  const lateDays = uniqueAttendanceHistory.filter(item => item.status === "Late").length;
  const attendancePercentage = totalDays > 0 ? Math.round((attendedDays / totalDays) * 100) : 0;

  const monthName = new Date().toLocaleString('default', { month: 'long' });

  const canMarkAttendance = 
    !hasAttendedToday && 
    !isSubmitting &&
    (currentTimeStatus === "early" || currentTimeStatus === "ontime");

  const getTimeStatusMessage = () => {
    switch(currentTimeStatus) {
      case "beforehours":
        return "Attendance can be marked after 8:00 AM";
      case "early":
        return "You're marking attendance early today!";
      case "ontime":
        return "You can mark your attendance now";
      case "afterhours":
        return "Attendance cannot be marked after 5:30 PM";
      default:
        return "";
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-4 py-8 gap-8 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-100 opacity-20 blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-purple-100 opacity-20 blur-xl"></div>

      {showAttendancePopUp && (
        <div className="fixed inset-0 bg-sky-50/1 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <AttendanceModel
            onCancel={closePopUp}
            handleMakeAttendance={handleMakeAttendance}
            isEarly={currentTimeStatus === "early"}
          />
        </div>
      )}

      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 bg-white/30 backdrop-blur-md px-6 py-3 rounded-xl shadow-sm">
            Attendance Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your attendance summary</p>
        </div>
        <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md px-6 py-3 rounded-xl shadow-sm border border-white/30">
          <FiCalendar className="text-blue-600" />
          <span className="font-medium text-gray-700">
            {date}
          </span>
        </div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 z-10">
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl border border-white/30 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Today's Status</h3>
              <p className={`mt-1 text-2xl font-semibold ${
                hasAttendedToday ? "text-green-700" : "text-amber-600"
              }`}>
                {hasAttendedToday ? "Present" : "Pending"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {getTimeStatusMessage()}
              </p>
            </div>
            {hasAttendedToday ? (
              <FiCheckCircle className="text-green-600 text-2xl" />
            ) : (
              <FiAlertCircle className="text-amber-500 text-2xl" />
            )}
          </div>
          {canMarkAttendance ? (
            <button
              onClick={() => setShowAttendancePopUp(true)} 
              className="mt-6 w-full py-3 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
            >
              <FiClock className="text-lg" />
              Mark Attendance
            </button>
          ) : hasAttendedToday ? (
            <button
              disabled
              className="mt-6 w-full py-3 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 bg-gray-100/70 text-gray-500 cursor-not-allowed"
            >
              <FiCheckCircle className="text-lg" />
              Attendance Recorded
            </button>
          ) : isSubmitting ? (
            <button
              disabled
              className="mt-6 w-full py-3 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 bg-gray-100/70 text-gray-500 cursor-not-allowed"
            >
              <FiClock className="text-lg animate-spin" />
              Recording...
            </button>
          ) : (
            <button
              disabled
              className="mt-6 w-full py-3 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 bg-gray-100/70 text-gray-500 cursor-not-allowed"
            >
              <FiClock className="text-lg" />
              {currentTimeStatus === "beforehours" 
                ? "Available after 8:00 AM" 
                : "Not available now"}
            </button>
          )}
        </div>

        <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl border border-white/30 shadow-sm hover:shadow-md transition-all">
          <h3 className="text-sm font-medium text-gray-600">{monthName} Summary</h3>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-gray-800">{attendedDays}</span>
                <span className="text-xs text-gray-600">Present</span>
              </div>
              <div className="h-10 w-px bg-gray-300/50"></div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-gray-800">{leaveDays}</span>
                <span className="text-xs text-gray-600">Leave</span>
              </div>
              <div className="h-10 w-px bg-gray-300/50"></div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-gray-800">{lateDays}</span>
                <span className="text-xs text-gray-600">Late</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl border border-white/30 shadow-sm hover:shadow-md transition-all">
          <h3 className="text-sm font-medium text-gray-600">Attendance Rate</h3>
          <div className="mt-4 flex items-center gap-4">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(229,231,235,0.7)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeDasharray={`${attendancePercentage}, 100`}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-800">{attendancePercentage}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-700">
                {attendancePercentage >= 90 ? "Excellent attendance!" :
                  attendancePercentage >= 75 ? "Good attendance" :
                    "Needs improvement"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {attendedDays} of {totalDays} days
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl bg-white/70 backdrop-blur-md rounded-xl border border-white/30 shadow-sm hover:shadow-md transition-all overflow-hidden z-10">
        <div className="p-6 border-b border-white/30 flex justify-between items-center">
          <h2 className="font-bold text-gray-800">Recent Attendance</h2>
          <button
            onClick={toggleShowAllHistory}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors bg-white/50 px-3 py-1 rounded-md backdrop-blur-sm"
          >
            {showAllHistory ? (
              <>
                <span>Show less</span>
                <FiChevronUp />
              </>
            ) : (
              <>
                <span>Show all</span>
                <FiChevronDown />
              </>
            )}
          </button>
        </div>

        <div className="divide-y divide-white/30">
          {displayedHistory.length > 0 ? (
            displayedHistory.map((item, index) => {
              const formattedDate = item.date; // Use original date format

              return (
                <div key={`${item.date}-${index}`} className="p-4 hover:bg-white/50 transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                        <FiCalendar className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{formattedDate}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <FiClock className="text-blue-500" />
                          {item.time}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                      item.status === "Attended" ? "bg-green-100/70 text-green-800" :
                      item.status === "Leave" ? "bg-blue-100/70 text-blue-800" :
                      "bg-amber-100/70 text-amber-800"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-gray-600">No attendance history available.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;