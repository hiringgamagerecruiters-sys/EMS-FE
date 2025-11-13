// src/pages/employeePages/Dashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import { FiChevronDown, FiChevronUp, FiCalendar, FiClock, FiCheckCircle, FiAlertCircle, FiRefreshCw } from "react-icons/fi";
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
  const [todayAttendanceRecord, setTodayAttendanceRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const visibleHistoryCount = 4;

  // Check current time and set status
  const checkTimeStatus = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    // Define time boundaries in minutes
    const startTime = 8 * 60; // 8:00 AM
    const onTimeDeadline = 8 * 60 + 15; // 8:15 AM
    const endTime = 17 * 60 + 30; // 5:30 PM
    
    if (currentTimeInMinutes < startTime) {
      setCurrentTimeStatus("beforehours");
    } else if (currentTimeInMinutes >= startTime && currentTimeInMinutes <= onTimeDeadline) {
      setCurrentTimeStatus("ontime");
    } else if (currentTimeInMinutes > onTimeDeadline && currentTimeInMinutes <= endTime) {
      setCurrentTimeStatus("latewindow");
    } else {
      setCurrentTimeStatus("afterhours");
    }
  };

  // Check if user has already attended today - IMPROVED METHOD
  const checkTodayAttendance = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) return false;

      // Method 1: Try to get today's attendance from history
      const historyResponse = await api.get('/employee/attendance/history', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (historyResponse.data && Array.isArray(historyResponse.data)) {
        const todayRecord = historyResponse.data.find(item => item.date === date);
        if (todayRecord) {
          console.log("✅ Found today's attendance in history:", todayRecord);
          setHasAttendedToday(true);
          setTodayAttendanceRecord(todayRecord);
          return true;
        }
      }

      // Method 2: Try the is_attendance endpoint
      try {
        const todayResponse = await api.get('/employee/is_attendance', {
          params: { date: date },
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (todayResponse.data.attendance) {
          console.log("✅ Found today's attendance via is_attendance:", todayResponse.data.attendance);
          setHasAttendedToday(true);
          setTodayAttendanceRecord(todayResponse.data.attendance);
          return true;
        }
      } catch (error) {
        console.log("is_attendance endpoint not available, using history method");
      }

      // If no attendance found
      setHasAttendedToday(false);
      setTodayAttendanceRecord(null);
      return false;

    } catch (error) {
      console.error("❌ Error checking today's attendance:", error);
      setHasAttendedToday(false);
      setTodayAttendanceRecord(null);
      return false;
    }
  };

  // Handle marking attendance - IMPROVED WITH BETTER STATE MANAGEMENT
  const handleMakeAttendance = async () => {
    if (isSubmitting || hasAttendedToday) {
      alert("Attendance already being processed or already recorded for today.");
      return;
    }
    
    setIsSubmitting(true);

    if (currentTimeStatus === "beforehours") {
      alert("Attendance can only be marked after 8:00 AM.");
      setIsSubmitting(false);
      return;
    }
    
    if (currentTimeStatus === "afterhours") {
      alert("Attendance cannot be marked after 5:30 PM.");
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
        setIsSubmitting(false);
        return;
      }

      console.log("🟢 Sending attendance data:", payload);

      // Mark attendance
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

      // Handle different response formats
      if (response.data.message && response.data.message.includes("already recorded")) {
        alert("Attendance already recorded for today.");
        setHasAttendedToday(true);
        if (response.data.existingRecord) {
          setTodayAttendanceRecord(response.data.existingRecord);
        }
      } else {
        alert("Attendance recorded successfully!");
        
        // Immediately update the state to prevent duplicate submissions
        setHasAttendedToday(true);
        
        // Create a local record since backend might not return full object
        const newAttendanceRecord = {
          time: time,
          status: currentTimeStatus === "ontime" ? "Attended" : "Late",
          date: date,
          _id: Date.now().toString() // temporary ID
        };
        setTodayAttendanceRecord(newAttendanceRecord);
        
        // Also add to local history
        setAttendanceHistory(prev => [newAttendanceRecord, ...prev]);
      }
      
      setShowAttendancePopUp(false);

      // Refresh data to get the actual record from server
      setTimeout(() => {
        fetchAttendanceStatus();
      }, 1000);

    } catch (error) {
      console.error("❌ Attendance submission error:", error);
      
      if (error.response?.status === 409 || error.response?.status === 400) {
        // Handle duplicate attendance from server
        const errorMessage = error.response.data.message || "Attendance already recorded for today";
        alert(errorMessage);
        setHasAttendedToday(true);
        if (error.response.data.existingRecord) {
          setTodayAttendanceRecord(error.response.data.existingRecord);
        }
      } else if (error.response?.status === 401) {
        alert('Session expired. Please log in again.');
        navigate('/login');
      } else {
        alert("Failed to submit attendance. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch attendance status and history
  const fetchAttendanceStatus = async () => {
    try {
      setRefreshing(true);
      const token = Cookies.get('token');

      if (!token) {
        alert('Unauthorized. Please log in.');
        navigate('/login');
        return;
      }

      // Check today's attendance first
      const hasAttended = await checkTodayAttendance();

      // Then fetch full history
      try {
        const historyResponse = await api.get('/employee/attendance/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (historyResponse.data && Array.isArray(historyResponse.data)) {
          const uniqueRecords = [];
          const seenDates = new Set();
          
          historyResponse.data.forEach(item => {
            if (!seenDates.has(item.date)) {
              seenDates.add(item.date);
              uniqueRecords.push(item);
            }
          });

          const sortedHistory = uniqueRecords.sort((a, b) => {
            const dateA = new Date(a.date.split('/').reverse().join('-'));
            const dateB = new Date(b.date.split('/').reverse().join('-'));
            return dateB - dateA;
          });

          setAttendanceHistory(sortedHistory);

          // Double-check if today's attendance exists in history
          if (!hasAttended) {
            const todayInHistory = sortedHistory.find(item => item.date === date);
            if (todayInHistory) {
              console.log("🔄 Found today's attendance in refreshed history");
              setHasAttendedToday(true);
              setTodayAttendanceRecord(todayInHistory);
            }
          }
        }
      } catch (error) {
        console.log('Could not fetch attendance history:', error.message);
        // Continue without history
      }

    } catch (err) {
      console.error('❌ Attendance fetch error:', err);
      if (err.response?.status === 401) {
        alert('Session expired. Please log in again.');
        navigate('/login');
      } else {
        console.log('No attendance records found');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Manual refresh function
  const handleRefresh = () => {
    fetchAttendanceStatus();
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

  // Use the already deduplicated history
  const displayedHistory = showAllHistory
    ? attendanceHistory
    : attendanceHistory.slice(0, visibleHistoryCount);

  const totalDays = attendanceHistory.length;
  const attendedDays = attendanceHistory.filter(item => 
    item.status === "Attended" || item.status === "attended"
  ).length;
  const leaveDays = attendanceHistory.filter(item => 
    item.status === "Leave" || item.status === "leave"
  ).length;
  const lateDays = attendanceHistory.filter(item => 
    item.status === "Late" || item.status === "late"
  ).length;
  const attendancePercentage = totalDays > 0 ? Math.round((attendedDays / totalDays) * 100) : 0;

  const monthName = new Date().toLocaleString('default', { month: 'long' });

  const canMarkAttendance = 
    !hasAttendedToday && 
    !isSubmitting &&
    (currentTimeStatus === "ontime" || currentTimeStatus === "latewindow");

  const getTimeStatusMessage = () => {
    if (hasAttendedToday && todayAttendanceRecord) {
      return `Attendance recorded at ${todayAttendanceRecord.time} (${todayAttendanceRecord.status})`;
    }
    
    switch(currentTimeStatus) {
      case "beforehours":
        return "Attendance can be marked after 8:00 AM";
      case "ontime":
        return "You're on time! Mark your attendance";
      case "latewindow":
        return "You can still mark attendance (will be marked as Late)";
      case "afterhours":
        return "Attendance cannot be marked after 5:30 PM";
      default:
        return "";
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch(statusLower) {
      case 'attended': return "bg-green-100/70 text-green-800";
      case 'leave': return "bg-blue-100/70 text-blue-800";
      case 'late': return "bg-amber-100/70 text-amber-800";
      default: return "bg-gray-100/70 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-4 py-8 gap-8 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-100 opacity-20 blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-purple-100 opacity-20 blur-xl"></div>

      {showAttendancePopUp && (
        <div className="fixed inset-0 bg-sky-50/1 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <AttendanceModel
            onCancel={closePopUp}
            handleMakeAttendance={handleMakeAttendance}
            isEarly={currentTimeStatus === "ontime"}
            isLate={currentTimeStatus === "latewindow"}
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
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md px-6 py-3 rounded-xl shadow-sm border border-white/30">
            <FiCalendar className="text-blue-600" />
            <span className="font-medium text-gray-700">
              {date}
            </span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-4 py-3 rounded-xl shadow-sm border border-white/30 hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`text-blue-600 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium text-gray-700">Refresh</span>
          </button>
        </div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 z-10">
        {/* Today's Status Card */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl border border-white/30 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Today's Status</h3>
              <p className={`mt-1 text-2xl font-semibold ${
                hasAttendedToday ? "text-green-700" : "text-amber-600"
              }`}>
                {hasAttendedToday ? (todayAttendanceRecord?.status || "Present") : "Pending"}
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
          
          {/* Improved Button Logic */}
          {hasAttendedToday ? (
            <button
              disabled
              className="mt-6 w-full py-3 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 bg-gray-100/70 text-gray-500 cursor-not-allowed"
            >
              <FiCheckCircle className="text-lg" />
              {todayAttendanceRecord ? 
                `Attendance Recorded (${todayAttendanceRecord.time})` : 
                'Attendance Recorded'
              }
            </button>
          ) : isSubmitting ? (
            <button
              disabled
              className="mt-6 w-full py-3 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 bg-gray-100/70 text-gray-500 cursor-not-allowed"
            >
              <FiClock className="text-lg animate-spin" />
              Recording Attendance...
            </button>
          ) : canMarkAttendance ? (
            <button
              onClick={() => setShowAttendancePopUp(true)} 
              className="mt-6 w-full py-3 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
            >
              <FiClock className="text-lg" />
              {currentTimeStatus === "ontime" ? "Mark Attendance" : "Mark Attendance (Late)"}
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

        {/* Month Summary Card */}
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

        {/* Attendance Rate Card */}
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

      {/* Recent Attendance Card */}
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
              const formattedDate = item.date;
              const isToday = item.date === date;

              return (
                <div key={`${item.date}-${index}`} className={`p-4 hover:bg-white/50 transition-colors group ${isToday ? 'bg-blue-50/50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-all ${isToday ? 'bg-blue-100' : 'bg-white/70 backdrop-blur-md'}`}>
                        <FiCalendar className={`${isToday ? 'text-blue-600' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 flex items-center gap-2">
                          {formattedDate}
                          {isToday && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              Today
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <FiClock className="text-blue-500" />
                          {item.time}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-600">
              <FiCalendar className="text-4xl text-gray-300 mx-auto mb-3" />
              <p>No attendance history available.</p>
              <p className="text-sm text-gray-500 mt-1">Your attendance records will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;