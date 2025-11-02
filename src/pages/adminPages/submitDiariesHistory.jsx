import React, { useState, useEffect } from "react";
import { FiEye } from "react-icons/fi";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdKeyboardArrowDown, MdDeleteForever } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import Reply from "../../components/ui/Reply/Reply";
import SenderDetails from "../../components/ui/SenderDetails/SenderDetails";
import defaultProfileImage from "../../assets/demo.jpg";
import { FaFilePdf } from "react-icons/fa6";
import { FaExternalLinkAlt, FaSearch } from "react-icons/fa";
import { Tooltip } from "antd";

const SubmitDiariesHistory = ({ isHistory = false, showActions = false }) => {
  const navigate = useNavigate();

  const [submitDiaries, setSubmitDiaries] = useState([]);
  const [visibleCards, setVisibleCards] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [internToReply, setInternToReply] = useState(null);
  const [showSenderDetailsModal, setShowSenderDetailsModal] = useState(false);
  const [selectedSender, setSelectedSender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const rowsPerPage = 6;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours() % 12 || 12).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
  };

  const filteredDiaries = submitDiaries.filter((diary) => {
    if (!diary || !diary.userId) return false;
    const fullName = `${diary.userId.firstName || ""} ${
      diary.userId.lastName || ""
    }`.toLowerCase();
    const employeeId = diary.userId._id || "";
    const formattedDate = formatDate(diary.date).toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formattedDate.includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredDiaries.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredDiaries.slice(indexOfFirstRow, indexOfLastRow);

  const handleLoadMore = () => setVisibleCards((prev) => prev + rowsPerPage);
  const handleViewDetails = (intern) => {
    setSelectedIntern(intern);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedIntern(null);
  };
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchDashboardData();
  }, [isHistory]);

  const fetchDashboardData = async () => {
    try {
      const token = Cookies.get("token");

      if (!token) {
        Swal.fire({
          icon: 'warning',
          title: 'Unauthorized',
          text: 'Please log in to continue',
          confirmButtonText: 'OK'
        }).then(() => navigate("/login"));
        return;
      }

      const endpoint = isHistory 
        ? "http://localhost:5000/api/admin/diaries_history"
        : "http://localhost:5000/api/admin/diaries";

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const validDiaries = response.data.filter(
        (diary) => diary && diary.userId
      );
      setSubmitDiaries(validDiaries);
      setLoading(false);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load dashboard data. Please try again.',
        confirmButtonText: 'OK'
      });
      if (err.response?.status === 401) {
        navigate("/login");
      }
      setLoading(false);
    }
  };

  const handleDiarieRemove = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const token = Cookies.get("token");
        await axios.delete(`http://localhost:5000/api/admin/remove_diarie`, {
          params: { id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        Swal.fire("Deleted!", "The diary has been deleted.", "success");
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Failed to delete diary:", error);
      Swal.fire("Error!", "Failed to delete diary", "error");
    }
  };

  const handleStatusChange = async (id, status) => {
    const token = Cookies.get("token");
    
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You're about to change the status of this diary to ${status}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes, set to ${status}!`,
      });

      if (result.isConfirmed) {
        await axios.put(
          `http://localhost:5000/api/admin/diaries/update?id=${id}&status=${status}`,
          { status },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        Swal.fire(
          "Status Updated!",
          `Diary status has been changed to ${status}.`,
          "success"
        );
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Failed to update diary:", error);
      const errorMessage = error.response?.data?.message || "Failed to update diary status";
      Swal.fire("Error!", errorMessage, "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-medium">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 md:p-6 max-w-8xl mx-auto rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        {isHistory ? "Intern Daily Diaries History" : "Intern Daily Diaries"} (<span>{filteredDiaries.length}</span>)
      </h2>

      <div className="w-full flex justify-end">
        <div className="relative w-md mb-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={isHistory ? "Search by name, ID or date (YYYY-MM-DD)..." : "Search......"}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-cyan-700 text-white">
            <tr>
              <th className="px-2 py-3 text-left text-xs font-medium  tracking-wider">
                Profile
              </th>
              <th className="text-left text-xs font-medium  tracking-wider">
                Name
              </th>
              <th className="text-left text-xs font-medium  tracking-wider">
                Mail
              </th>
              <th className="text-left text-xs font-medium  tracking-wider">
                Team
              </th>
              <th className="text-left text-xs font-medium  tracking-wider">
                Job Role
              </th>
              <th className="text-left text-xs font-medium  tracking-wider">
                University
              </th>
              <th className="text-left text-xs font-medium  tracking-wider">
                Diaries Name
              </th>
              <th className=" text-left text-xs font-medium  tracking-wider">
                Submit Date
              </th>
              <th className=" text-left text-xs font-medium  tracking-wider">
                View
              </th>
              <th className="text-left text-xs font-medium  tracking-wider">
                Status
              </th>
              {showActions && (
                <th className="text-left text-xs font-medium  tracking-wider">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRows.map((diary, index) => (
              <tr
                key={index}
                className={
                  index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"
                }
              >
                <td className="whitespace-nowrap py-1">
                  <div className="flex items-center">
                    <img
                      src={
                        diary.userId?.profileImage
                          ? `http://localhost:5000/uploads/${diary.userId.profileImage}`
                          : defaultProfileImage
                      }
                      alt={`${diary.userId?.firstName || "User"} profile`}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultProfileImage;
                      }}
                    />
                  </div>
                </td>
                <td className="whitespace-nowrap text-sm text-gray-500">
                  {`${diary.userId.firstName || ""} ${
                    diary.userId.lastName || ""
                  }`}
                </td>
                <td className="whitespace-nowrap text-sm text-gray-500">
                  {diary.userId.email || "N/A"}
                </td>
                <td className="whitespace-nowrap text-sm text-gray-500">
                  {diary.userId?.team?.teamName || "N/A"}
                </td>
                <td className="whitespace-nowrap text-sm text-gray-500">
                  {diary.userId?.jobRole?.jobRoleName || "N/A"}
                </td>
                <td className="text-sm text-gray-500 w-40 break-words ">
                    {diary.userId.university || "Empty"}
                  </td>
                <td className="px-2 text-sm text-gray-500 break-words break-all w-48 pr-10">
                  <Tooltip
                    title={diary.name || "Empty"}
                    placement="bottom"
                    color="blue"
                  >
                    {(diary.name || "Empty").length > 35
                      ? (diary.name || "Empty").slice(0, 35) + "..."
                      : diary.name || "Empty"}
                  </Tooltip>
                </td>
                <td className="whitespace-nowrap text-sm text-gray-500">
                  {diary.date
                    ? formatDate(diary.date)
                    : "N/A"}
                </td>
                <td className="whitespace-nowrap">
                  <button
                    onClick={() => isHistory ? setShowSenderDetailsModal(true) || setSelectedSender(diary) : handleViewDetails(diary)}
                    className="text-cyan-700 hover:text-cyan-900"
                  >
                    <FiEye size={20} />
                  </button>
                </td>
                <td className="whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      diary.diaryStatus === "Replied"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {diary.diaryStatus || "Unknown"}
                  </span>
                </td>
                {showActions && (
                  <td className="py-4 whitespace-nowrap flex gap-5 text-xl">
                    <button
                      onClick={() => handleStatusChange(diary._id, "Pending")}
                      className="text-yellow-500 hover:text-yellow-700"
                      title="Set to Pending"
                    >
                      <GrUpdate />
                    </button>
                    <button
                      onClick={() => handleDiarieRemove(diary._id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full"
                      title="Delete diary"
                    >
                      <MdDeleteForever />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Desktop Pagination */}
        {!isHistory && (
          <div className="flex items-center justify-between mt-4">
            <div className="flex-1 flex justify-between items-center">
              <span className="text-sm text-gray-700">
                Showing page {currentPage} of {totalPages}
              </span>
              <div className="flex space-x-1">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentPage === i + 1
                        ? "bg-cyan-700 text-white"
                        : "text-gray-700 bg-white hover:bg-gray-50 border border-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredDiaries.slice(0, isHistory ? filteredDiaries.length : visibleCards).map((diary, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <img
                  src={
                    diary.userId?.profileImage
                      ? `http://localhost:5000/uploads/${diary.userId.profileImage}`
                      : defaultProfileImage
                  }
                  alt={`${diary.userId?.firstName || "User"} profile`}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultProfileImage;
                  }}
                />
                <div>
                  <h3 className="font-medium text-gray-900">{diary.name}</h3>
                  <h3 className="font-sans text-blue-400">
                    {diary.userId.email}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {diary.date
                      ? new Date(diary.date).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3 flex justify-between items-center">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  diary.diaryStatus === "Replied"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {diary.diaryStatus}
              </span>
              <div className="flex items-center gap-2">
                {showActions && (
                  <>
                    <button
                      onClick={() => handleStatusChange(diary._id, "Pending")}
                      className="text-yellow-500 hover:text-yellow-700"
                      title="Set to Pending"
                    >
                      <GrUpdate size={16} />
                    </button>
                    <button
                      onClick={() => handleDiarieRemove(diary._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete diary"
                    >
                      <MdDeleteForever size={16} />
                    </button>
                  </>
                )}
                <button
                  onClick={() => isHistory ? setShowSenderDetailsModal(true) || setSelectedSender(diary) : handleViewDetails(diary)}
                  className="flex items-center text-sm text-cyan-700 hover:text-cyan-900"
                >
                  <FiEye className="mr-1" size={16} /> View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile "Load More" Button */}
      {!isHistory && visibleCards < filteredDiaries.length && (
        <div className="md:hidden flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            className="flex items-center px-6 py-2 bg-gradient-to-r from-cyan-700 to-cyan-900 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all"
          >
            Load More <MdKeyboardArrowDown className="ml-1" size={20} />
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredDiaries.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No diaries found matching your search criteria.
          </p>
        </div>
      )}

      {/* Diary Details Modal */}
      {showModal && selectedIntern && (
        <div className="fixed inset-0 bg-white/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-xl font-bold text-gray-800">
                Intern Submitted Diary
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-red-500 hover:text-gray-700"
              >
                <IoIosCloseCircleOutline size={34} />
              </button>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  <img
                    src={
                      selectedIntern.userId?.profileImage
                        ? `http://localhost:5000/uploads/${selectedIntern.userId.profileImage}`
                        : defaultProfileImage
                    }
                    alt={`${
                      selectedIntern.userId?.firstName || "User"
                    } profile`}
                    className="w-40 h-40 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultProfileImage;
                    }}
                  />
                  <h4 className="text-xl font-bold text-gray-900 mt-4">
                    {selectedIntern.userId.firstName}{" "}
                    {selectedIntern.userId.lastName}
                  </h4>
                  <p className="text-gray-600">{selectedIntern.userId.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="pb-5">
                  <h5 className="font-bold text-gray-800 mb-2">Description</h5>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">
                    {selectedIntern.description || "No description provided"}
                  </p>
                </div>

                <div className="pb-5">
                  <h5 className="font-bold text-gray-800 mb-5">
                    File Uploaded
                  </h5>
                  <div className="flex gap-10 pl-5">
                    {selectedIntern.filePathLink && (
                      <a
                        href={selectedIntern.filePathLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open external link"
                        className="text-2xl text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <FaExternalLinkAlt />
                      </a>
                    )}
                    {selectedIntern.filePath && (
                      <a
                        href={`http://localhost:5000/${selectedIntern.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open PDF file"
                        className="text-2xl text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FaFilePdf />
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="font-bold text-gray-800 mb-2">Submit Date</h5>
                  <p className="text-gray-700">
                    {formatDateTime(selectedIntern.date)}
                  </p>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => {
                      setInternToReply(selectedIntern);
                      setShowReplyModal(true);
                    }}
                    className="px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-800 transition-colors"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSender(selectedIntern);
                      setShowSenderDetailsModal(true);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                  >
                    View Sender Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
    {showReplyModal && internToReply && (
  <Reply
    internName={internToReply.name}
    diaryId={internToReply._id} // Add this line
    onClose={() => setShowReplyModal(false)}
  />
)}

      {/* Sender Details Modal */}
      {showSenderDetailsModal && selectedSender && (
        <SenderDetails
          internData={selectedSender}
          onClose={() => setShowSenderDetailsModal(false)}
        />
      )}
    </div>
  );
};

export default SubmitDiariesHistory;