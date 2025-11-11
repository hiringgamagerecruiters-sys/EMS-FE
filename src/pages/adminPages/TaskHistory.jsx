import React, { useEffect, useState } from "react";
import { FaFilePdf, FaExternalLinkAlt, FaEye, FaDownload } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../utils/api";

const BASE_URL = import.meta.env.VITE_API_URL_;

function TaskHistory({ refreshTrigger = 0 }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchTaskHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const token = Cookies.get("token");
      if (!token) {
        navigate("/login");
        return;
      }

      console.log("Fetching task history...");
      
      const response = await api.get(
        "/admin/tasks_history",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Task history response:", response.data);
      setTasks(response.data || []);
    } catch (err) {
      console.error("Error fetching task history:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to load task history. Please try again.");
      }
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskHistory();
  }, [navigate, refreshTrigger]);

  const handleDelete = async (id) => {
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
        await api.delete(`/admin/remove_task`, {
          params: { id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        Swal.fire("Deleted!", "The task has been deleted.", "success");
        fetchTaskHistory();
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      Swal.fire("Error!", "Failed to delete task", "error");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Enhanced search for task history
  const filteredTasks = tasks.filter((task) => {
    if (!searchQuery) return true;
    
    const searchTerm = searchQuery.toLowerCase();
    
    const nameMatch = task.name?.toLowerCase().includes(searchTerm);
    const emailMatch = task.assignedTo?.email?.toLowerCase().includes(searchTerm);
    const firstNameMatch = task.assignedTo?.firstName?.toLowerCase().includes(searchTerm);
    const lastNameMatch = task.assignedTo?.lastName?.toLowerCase().includes(searchTerm);
    const fullName = `${task.assignedTo?.firstName || ''} ${task.assignedTo?.lastName || ''}`.toLowerCase().trim();
    const fullNameMatch = fullName.includes(searchTerm);
    const descriptionMatch = task.description?.toLowerCase().includes(searchTerm);
    const statusMatch = task.status?.toLowerCase().includes(searchTerm);
    
    const dateString = task.submitDate
      ? `${new Date(task.submitDate).getFullYear()}-${String(
          new Date(task.submitDate).getMonth() + 1
        ).padStart(2, "0")}-${String(new Date(task.submitDate).getDate()).padStart(2, "0")}`
      : "";
    const dateMatch = dateString.includes(searchTerm);
    
    return nameMatch || emailMatch || firstNameMatch || lastNameMatch || 
           fullNameMatch || descriptionMatch || statusMatch || dateMatch;
  });

  // Enhanced file viewing for task history
  const handleViewFile = async (fileUrl, isExternal = false) => {
    try {
      if (isExternal) {
        window.open(fileUrl, '_blank', 'noopener,noreferrer');
      } else {
        const token = Cookies.get("token");
        const fullUrl = `${BASE_URL}/${fileUrl}`;
        
        const response = await fetch(fullUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL, '_blank');
        } else {
          throw new Error('Failed to fetch file');
        }
      }
    } catch (error) {
      console.error("Error opening file:", error);
      Swal.fire("Error", "Could not open the file. Please try again.", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading task history...</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Task History ({filteredTasks.length})</h2>

      {/* Enhanced Search Bar */}
      <div className="flex w-full justify-end mb-6">
        <div className="w-80">
          <input
            type="text"
            placeholder="Search by task name, email, user name, or date"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {filteredTasks.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Task Name</th>
                <th className="py-3 px-4 text-left">Assigned To</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Submitted Date</th>
                <th className="py-3 px-4 text-left">File</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{task.name}</td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">
                        {task.assignedTo?.firstName} {task.assignedTo?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {task.assignedTo?.email || "Unassigned"}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-[200px]">
                    <div
                      className="truncate"
                      title={task.description || "No description provided"}
                    >
                      {task.description || "No description provided"}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {task.submitDate
                      ? new Date(task.submitDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-3">
                      {task.submitFilePath && (
                        <button
                          onClick={() => handleViewFile(task.submitFilePath, true)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Open external link"
                        >
                          <FaExternalLinkAlt size={18} />
                        </button>
                      )}
                      {task.submitFile && (
                        <button
                          onClick={() => handleViewFile(task.submitFile, false)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Open PDF file"
                        >
                          <FaFilePdf size={18} />
                        </button>
                      )}
                      {!task.submitFilePath && !task.submitFile && (
                        <span className="text-sm text-gray-500">No files</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete task"
                    >
                      <MdDeleteForever size={22} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {searchQuery ? 'No matching tasks found' : 'No task history found'}
          </h3>
          <p className="text-gray-500">
            {searchQuery 
              ? `No completed tasks found matching "${searchQuery}"` 
              : "No completed tasks found in history."}
          </p>
        </div>
      )}
    </div>
  );
}

export default TaskHistory;