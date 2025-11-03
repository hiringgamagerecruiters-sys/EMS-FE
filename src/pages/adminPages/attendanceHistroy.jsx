import React, { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { MainContext } from "../../context/MainContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../utils/api";

function AttendanceSheetHistory() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useContext(MainContext);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const fetchAttendanceData = async () => {
    try {
      const token = Cookies.get("token");
      
      if (!token) {
        setError("Please log in to access attendance history");
        setLoading(false);
        return;
      }

      setLoading(true);
      const response = await api.get(
        `/admin/attendance_history_sheet`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data && Array.isArray(response.data)) {
        const validData = response.data.filter((item) => item?.userId);
        setAttendanceData(validData);
        setError(null);
      } else {
        setError("Invalid data received from server");
      }
    } catch (err) {
      console.error("Error fetching attendance data:", err);
      
      if (err.response?.status === 403) {
        setError("Access denied. Admin privileges required. Please contact your system administrator.");
      } else if (err.response?.status === 401) {
        setError("Please log in again. Your session may have expired.");
      } else {
        setError(err.response?.data?.msg || "Failed to load attendance history. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  // Filter data based on search
  const filteredData = attendanceData.filter((item) => {
    const name = `${item.userId?.firstName || ""} ${item.userId?.lastName || ""}`.toLowerCase();
    const email = item.userId?.email?.toLowerCase() || "";
    const date = item.date ? new Date(item.date).toISOString().split("T")[0] : "";
    const status = item.status?.toLowerCase() || "";
    const teamName = item.userId?.team?.teamName?.toLowerCase() || "";
    
    return (
      name.includes(searchQuery.toLowerCase()) || 
      email.includes(searchQuery.toLowerCase()) ||
      date.includes(searchQuery.toLowerCase()) ||
      status.includes(searchQuery.toLowerCase()) ||
      teamName.includes(searchQuery.toLowerCase())
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'attended': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'onleave': return 'bg-blue-100 text-blue-800';
      case 'absent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Show access denied message if user is not admin
  if (user && user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200 max-w-md">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600 mb-4">Admin privileges are required to view attendance history.</p>
          <p className="text-gray-600 text-sm mb-4">
            Current user: {user.email}<br/>
            User role: {user.role}<br/>
            Admin access: {user.role === 'admin' ? 'Yes' : 'No'}
          </p>
          <button
            onClick={fetchAttendanceData}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading attendance history...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200 max-w-md">
        <div className="text-red-600 mb-3">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 01118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchAttendanceData}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header and Search */}
      <div className="bg-white px-16 py-4 border-b flex-shrink-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Attendance History</h1>
            <p className="text-gray-600 text-sm mt-1">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} records
              {searchQuery && ` (filtered from ${attendanceData.length} total)`}
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by name, email, date, status, or team"
              className="px-4 py-2 rounded-lg shadow-sm w-full md:max-w-xs focus:ring-2 focus:ring-teal-500 outline-none border border-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={fetchAttendanceData}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 bg-white rounded-xl shadow-md  py-4 px-16 ">
        <div className="h-full flex flex-col">
          {/* Table */}
          <div className="flex-1 overflow-hidden">
            <div className=" overflow-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#0A96A6] text-white sticky top-0 z-10">
                  <tr>
                    {["ID", "Name", "Email", "Date", "Status", "Team", "University", "Time"].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center"
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                      <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 text-sm text-gray-900 text-center">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 text-center">
                          {item.userId?.firstName || "N/A"} {item.userId?.lastName || ""}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 text-center">
                          {item.userId?.email || "N/A"}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 text-center">
                          {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status || "Unknown"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 text-center">
                          {item.userId?.team?.teamName || "No team assigned"}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 text-center">
                          {item.userId?.university || "N/A"}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 text-center">
                          {item.time || "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-12 text-sm text-gray-500">
                        <div className="flex flex-col items-center">
                          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-lg font-medium text-gray-500 mb-2">
                            {searchQuery ? "No matching records found" : "No attendance history available"}
                          </p>
                          <p className="text-gray-400">
                            {searchQuery ? "Try a different search term" : "Attendance records will appear here once available"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="bg-white px-6 py-4 border-t border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
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
                        onClick={() => paginate(pageNum)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === pageNum
                            ? "bg-[#0A96A6] text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                    }`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendanceSheetHistory;