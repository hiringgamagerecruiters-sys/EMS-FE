import React, { useState, useEffect, useContext } from "react";
import { MainContext } from "../../context/MainContext";
import axios from "axios";
import Cookies from "js-cookie";
import { FaEye, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Tooltip } from "antd";
import UserData from "../../components/ui/viewUser/userData";
const token = Cookies.get("token");

const OnLeaveTable = () => {
  const { date } = useContext(MainContext);
  const [onLeave, setOnLeave] = useState([]);
  const [showSenderDetailsModal, setShowSenderDetailsModal] = useState(false);
  const [selectedSender, setSelectedSender] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/admin/leave/leaveByDay?date=${date}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOnLeave(response.data);
      } catch (error) {
        console.error("Leave fetch error:", error);
      }
    };

    fetchData();
  }, [date]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = onLeave.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(onLeave.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, onLeave.length)} of {onLeave.length} entries
          </div>
        </div>
      </div>

      {/* Table Container */}
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
                  <tr key={item.id} className="hover:bg-gray-50">
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
                    <td className="py-2 whitespace-nowrap">
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center py-8 text-sm text-gray-500"
                  >
                    No upcoming pending leave requests.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {onLeave.length > 0 && (
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

      {showSenderDetailsModal && selectedSender && (
        <UserData
          internData={selectedSender}
          onClose={() => setShowSenderDetailsModal(false)}
        />
      )}
    </div>
  );
};

export default OnLeaveTable;