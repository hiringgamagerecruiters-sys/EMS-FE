import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import api from "../../utils/api";
import { FiCalendar, FiClock, FiCheck, FiX, FiClock as FiPending } from "react-icons/fi";

const LeaveForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    leaveDate: "",
    endDate: "",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // BUG022: Character limit for reason field
  const MAX_REASON_LENGTH = 255;

  // Fetch leave history
  const fetchLeaveHistory = async () => {
    try {
      setLoadingHistory(true);
      const token = Cookies.get("token");
      if (!token) return;

      const response = await api.get("/employee/leave/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        const sortedHistory = response.data.sort(
          (a, b) => new Date(b.createdAt || b.leaveDate) - new Date(a.createdAt || a.leaveDate)
        );
        setLeaveHistory(sortedHistory);
      }
    } catch (error) {
      console.error("Error fetching leave history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // BUG022: Enforce character limit for reason field
    if (name === "reason" && value.length > MAX_REASON_LENGTH) {
      return; // Don't update if exceeds limit
    }
    
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // BUG022: Validate reason length before submission
    if (form.reason.length > MAX_REASON_LENGTH) {
      alert(`Reason cannot exceed ${MAX_REASON_LENGTH} characters.`);
      setIsSubmitting(false);
      return;
    }

    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Please log in first.");
        setIsSubmitting(false);
        return;
      }

      const response = await api.post(
        "/employee/leave",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert(response.data.msg || "Leave request submitted successfully!");
      setForm({ name: "", email: "", leaveDate: "", endDate: "", reason: "" });
      
      // Refresh leave history after successful submission
      fetchLeaveHistory();
    } catch (error) {
      console.error("Leave request error:", error.response?.data || error.message);
      alert(error.response?.data?.msg || "Failed to submit leave request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      'approved': { color: 'bg-green-100 text-green-800', icon: FiCheck, label: 'Approved' },
      'rejected': { color: 'bg-red-100 text-red-800', icon: FiX, label: 'Rejected' },
      'pending': { color: 'bg-yellow-100 text-yellow-800', icon: FiPending, label: 'Pending' }
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  // Calculate total days between two dates
  const calculateTotalDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end dates
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with date */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Leave Request</h1>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <span className="font-medium text-gray-700">
              {new Date().toLocaleDateString("en-GB", {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leave Application Form - Takes 2/3 on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100">
              <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">
                Leave Application Form
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required 
                      className="w-full px-4 py-3 rounded-md border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition duration-200 ease-in-out"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-md border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition duration-200 ease-in-out"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="leaveDate"
                      value={form.leaveDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-md border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition duration-200 ease-in-out"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={form.endDate}
                      onChange={handleChange}
                      required
                      min={form.leaveDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-md border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition duration-200 ease-in-out"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Leave
                      <span className="text-gray-500 text-sm font-normal ml-1">
                        (Max {MAX_REASON_LENGTH} characters)
                      </span>
                    </label>
                    <textarea
                      name="reason"
                      value={form.reason}
                      onChange={handleChange}
                      rows="4"
                      required
                      maxLength={MAX_REASON_LENGTH}
                      className="w-full px-4 py-3 rounded-md border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition duration-200 ease-in-out"
                      placeholder="Please describe the reason for your leave..."
                    />
                    {/* BUG022: Character counter */}
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">
                        {form.reason.length} / {MAX_REASON_LENGTH} characters
                      </span>
                      {form.reason.length > MAX_REASON_LENGTH * 0.8 && (
                        <span className="text-xs text-amber-600">
                          Approaching character limit
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center items-center px-6 py-4 border border-transparent rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-200 ${
                      isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Submit Leave Request'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* BUG023: Leave History Section - Takes 1/3 on large screens */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-fit sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Leave History</h2>
                <button
                  onClick={fetchLeaveHistory}
                  disabled={loadingHistory}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50"
                >
                  Refresh
                </button>
              </div>

              {loadingHistory ? (
                <div className="flex justify-center items-center py-8">
                  <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : leaveHistory.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {leaveHistory.map((leave) => (
                    <div
                      key={leave._id || leave.leaveDate}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <FiCalendar className="text-gray-400 text-sm" />
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(leave.leaveDate).toLocaleDateString()}
                          </span>
                          {leave.endDate && leave.endDate !== leave.leaveDate && (
                            <>
                              <span className="text-gray-400">-</span>
                              <span className="text-sm font-medium text-gray-900">
                                {new Date(leave.endDate).toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </div>
                        {getStatusBadge(leave.status)}
                      </div>

                      {leave.endDate && leave.endDate !== leave.leaveDate && (
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <FiClock className="mr-1" />
                          {calculateTotalDays(leave.leaveDate, leave.endDate)} days
                        </div>
                      )}

                      {leave.reason && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {leave.reason}
                        </p>
                      )}

                      <div className="text-xs text-gray-400 mt-2">
                        Submitted: {new Date(leave.createdAt || leave.leaveDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiCalendar className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">No leave requests yet</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Your submitted leave requests will appear here
                  </p>
                </div>
              )}

              {/* Leave Statistics */}
              {leaveHistory.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Summary</h3>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold text-yellow-600">
                        {leaveHistory.filter(l => !l.status || l.status.toLowerCase() === 'pending').length}
                      </div>
                      <div className="text-xs text-gray-500">Pending</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        {leaveHistory.filter(l => l.status?.toLowerCase() === 'approved').length}
                      </div>
                      <div className="text-xs text-gray-500">Approved</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-red-600">
                        {leaveHistory.filter(l => l.status?.toLowerCase() === 'rejected').length}
                      </div>
                      <div className="text-xs text-gray-500">Rejected</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveForm;