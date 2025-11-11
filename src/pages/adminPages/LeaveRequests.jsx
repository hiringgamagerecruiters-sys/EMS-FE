import React, { useState, useEffect, useContext } from "react";
import { MainContext } from "../../context/MainContext";
import { FaCheck, FaTimes, FaUndo, FaEye, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Cookies from "js-cookie";
import UserData from "../../components/ui/viewUser/userData";
import { Tooltip } from "antd";
import api from "../../utils/api";

const token = Cookies.get("token");

const LeaveRequestsTable = () => {
  const { date } = useContext(MainContext);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSenderDetailsModal, setShowSenderDetailsModal] = useState(false);
  const [selectedSender, setSelectedSender] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchLeaveHistory = async () => {
    try {
      const response = await api.get(
        `/admin/leaves/pending?date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLeaveRequests(response.data);
    } catch (error) {
      console.error(" Leave fetch error:", error);
    }
  };

  const handleStatusChange = async (id, status, reason = "") => {
    try {
      const payload = { status };
      if (reason) {
        payload.rejectionReason = reason;
      }
      
      await api.put(
        `/admin/leaves/update?id=${id}&status=${status}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchLeaveHistory();
      
      // Show success message
      if (status === "Approved") {
        alert("Leave request approved successfully!");
      } else if (status === "Rejected") {
        alert("Leave request rejected successfully!");
      }
    } catch (error) {
      console.error(`Failed to update status:`, error);
      alert("Failed to update leave status. Please try again.");
    }
  };

  const handleRejectClick = (leave) => {
    setSelectedLeave(leave);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const confirmRejection = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    
    handleStatusChange(selectedLeave._id, "Rejected", rejectionReason.trim());
    setShowRejectModal(false);
    setSelectedLeave(null);
    setRejectionReason("");
  };

  const cancelRejection = () => {
    setShowRejectModal(false);
    setSelectedLeave(null);
    setRejectionReason("");
  };

  useEffect(() => {
    fetchLeaveHistory();
  }, [date]);

  // Filter data based on search
  const filteredLeaveRequests = leaveRequests.filter((item) => {
    const name = `${item.userId?.firstName || ""} ${
      item.userId?.lastName || ""
    }`.toLowerCase();
    const email = item.userId?.email?.toLowerCase() || "";
    return (
      name.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase())
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLeaveRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLeaveRequests.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="h-full flex flex-col">
      {/* Header - Fixed */}
      <div className="bg-white p-4 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredLeaveRequests.length)} of {filteredLeaveRequests.length} entries
          </div>
          <div className="flex justify-end">
            <input
              type="text"
              placeholder="Search by name or email"
              className="px-4 py-2 rounded-lg shadow-sm w-full max-w-xs focus:ring-2 focus:ring-teal-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Container - Scrollable inside */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#0A96A6] sticky top-0 z-10">
              <tr>
                {[
                  "Name",
                  "Email",
                  "Group",
                  "Days",
                  "Start Date",
                  "End Date",
                  "View",
                  "Reason",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-2 py-3 text-left text-xs font-medium text-white tracking-wider"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-2 text-sm text-gray-900 whitespace-nowrap">
                      {item.userId?.firstName || "Empty"}{" "}
                      {item.userId?.lastName || ""}
                    </td>
                    <td className="px-2 text-sm text-gray-500 whitespace-nowrap">
                      {item.userId?.email || "Empty"}
                    </td>
                    <td className="px-2 text-sm text-gray-500 whitespace-nowrap">
                      {item.userId?.group || "Empty"} 
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-500 whitespace-nowrap">
                      {item.days || "Empty"}
                    </td>
                    <td className="px-2 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(item.leaveDate).toISOString().split("T")[0] ||
                        "Empty"}
                    </td>
                    <td className="px-2 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(item.endDate).toISOString().split("T")[0] ||
                        "Empty"}
                    </td>
                    <td className="px-2 py-2 text-sm text-center flex justify-start">
                      <button
                        onClick={() => {
                          setSelectedSender(item);
                          setShowSenderDetailsModal(true);
                        }}
                        className="text-blue-500 rounded hover:text-gray-800 transition-colors"
                      >
                        <FaEye size={20} />
                      </button>
                    </td>
                    <td className="px-2 text-sm text-gray-500 break-words break-all w-48 pr-10">
                      <Tooltip
                        title={item.reason || "Empty"}
                        placement="bottom"
                        color="blue"
                      >
                        {(item.reason || "Empty").length > 35
                          ? (item.reason || "Empty").slice(0, 35) + "..."
                          : item.reason || "Empty"}
                      </Tooltip>
                    </td>
                    <td className="px-2 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          item.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : item.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : item.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status || "Empty"}
                      </span>
                    </td>
                    <td className="px-2 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleStatusChange(item._id, "Approved")
                          }
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full"
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleRejectClick(item)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full"
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(item._id, "Pending")
                          }
                          className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-blue-100 rounded-full"
                          title="Pending"
                        >
                          <FaUndo />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    className="text-center text-sm text-gray-500 py-8"
                  >
                    No leave requests found for your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredLeaveRequests.length > 0 && (
        <div className="bg-white p-4 flex-shrink-0 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
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
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                <FaChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {showRejectModal && selectedLeave && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Reject Leave Request
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                You are about to reject the leave request for{" "}
                <strong>
                  {selectedLeave.userId?.firstName} {selectedLeave.userId?.lastName}
                </strong>
                .
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Please provide a reason for rejection:
              </p>
              
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                autoFocus
              />
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={cancelRejection}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRejection}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSenderDetailsModal && selectedSender && (
        <UserData
          internData={selectedSender}
          onClose={() => setShowSenderDetailsModal(false)}
        />
      )}
    </div>
  );
};

export default LeaveRequestsTable;