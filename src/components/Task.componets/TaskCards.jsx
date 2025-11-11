/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { FaFilePdf, FaTrash, FaCheck } from "react-icons/fa";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const TaskCard = ({ task, onDelete, onSubmit, refreshTasks, showSubmitButton }) => {
  const navigate = useNavigate();

  const getStatusColor = () => {
    switch (task.status) {
      case "Assigned":
        return "bg-blue-100 text-blue-700";
      case "Progress":
        return "bg-yellow-100 text-yellow-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleStatusChange = async (e) => {
    const status = e.target.value;
    const cardId = task._id;

    try {
      const token = Cookies.get("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await api.put(`/admin/update_tasks_staus`, null, {
        params: {
          id: cardId,
          status: status,
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (typeof refreshTasks === "function") {
        refreshTasks(); // ✅ trigger refresh
      }

    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // FIXED: Proper file viewing function
  const handleViewFile = async () => {
    if (!task.filePath) {
      alert("No file attached to this task");
      return;
    }

    try {
      const token = Cookies.get("token");
      if (!token) {
        navigate("/login");
        return;
      }

      console.log(`📁 Viewing file for task ${task._id}: ${task.filePath}`);
      
      const response = await api.get(task.filePath, {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
        responseType: 'blob'
      });

      // Create blob and open file
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/pdf' 
      });
      const url = window.URL.createObjectURL(blob);
      
      // Check if it's a PDF or other file type
      const contentType = response.headers['content-type'];
      if (contentType === 'application/pdf') {
        // Open PDF in new tab
        window.open(url, '_blank');
      } else {
        // Download other file types
        const link = document.createElement('a');
        link.href = url;
        const filename = task.filePath.split('/').pop() || 'task-file';
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      
      // Clean up
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      
    } catch (error) {
      console.error("❌ File view error:", error);
      
      if (error.response?.status === 404) {
        alert("File not found. It may have been deleted or moved.");
      } else if (error.response?.status === 401) {
        navigate("/login");
      } else {
        alert("Failed to open file. Please try again.");
      }
    }
  };

  const handleSubmit = () => {
    if (typeof onSubmit === "function") {
      onSubmit(task._id || task.id);
    }
  };

  const handleDelete = () => {
    if (typeof onDelete === "function") {
      onDelete(task._id || task.id);
    }
  };

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    try {
      return new Date(dateString).toISOString().split("T")[0];
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Check if task is due today
  const isDueToday = () => {
    if (!task.deadline) return false;
    try {
      const taskDate = new Date(task.deadline);
      const today = new Date();
      return taskDate.toDateString() === today.toDateString();
    } catch (error) {
      return false;
    }
  };

  // Check if task is overdue
  const isOverdue = () => {
    if (!task.deadline) return false;
    try {
      const taskDate = new Date(task.deadline);
      const today = new Date();
      return taskDate < today && !isDueToday();
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    console.log("Task data:", task);
  }, [task]);

  return (
    <div className="bg-sky-50/50 rounded-2xl shadow-md p-5 flex flex-col justify-between transition-all hover:shadow-lg hover:bg-sky-100 break-all">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">{task.name || "Unnamed Task"}</h2>
        <p className="text-sm text-gray-600 mt-1 mb-4">{task.description || "No description provided"}</p>

        <div className="text-sm text-gray-700 space-y-1">
          <div>
            <span className="font-medium">Assigned to:</span>{" "}
            <span className="text-blue-600 font-serif">
              {task.assignedTo?.email || "Unassigned"}
            </span>
          </div>
          <div>
            <span className="font-medium">Name:</span>{" "}
            <span className="text-blue-600 font-serif">
              {task.assignedTo?.firstName || "Unknown"} {task.assignedTo?.lastName || ""}
            </span>
          </div>
          <div>
            <span className="font-medium">Deadline:</span>{" "}
            <span className={isOverdue() ? 'text-red-600 font-semibold' : isDueToday() ? 'text-green-600 font-semibold' : ''}>
              {formatDate(task.deadline)}
              {isDueToday() && ' (Today)'}
              {isOverdue() && ' (Overdue)'}
            </span>
            <br />
            <span className="font-medium">Submitted Day:</span>{" "}
            {task.submittedDay ? formatDate(task.submittedDay) : "Not submitted"}
          </div>
        </div>

        <div className="mt-4">
          {task.filePath ? (
            <button
              onClick={handleViewFile}
              className="inline-flex items-center gap-2 text-red-500 hover:text-red-700 text-sm cursor-pointer"
            >
              <FaFilePdf /> View File
            </button>
          ) : (
            <span className="text-gray-400 text-sm">No file attached</span>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor()}`}
          >
            {task.status || "Unknown"}
          </span>

          <select
            onChange={handleStatusChange}
            value={task.status || "Assigned"}
            className="ml-2 border border-sky-500 rounded px-2 py-1 text-sm bg-white"
          >
            <option className="text-blue-700 font-semibold" value="Assigned">
              Assigned
            </option>
            <option className="text-yellow-700 font-semibold" value="Progress">
              In Progress
            </option>
            <option className="text-green-700 font-semibold" value="Completed">
              Completed
            </option>
          </select>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {showSubmitButton && (
              <button
                onClick={handleSubmit}
                className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded flex items-center transition-colors"
              >
                <FaCheck className="mr-1" /> Submit
              </button>
            )}

            {onDelete && (
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded flex items-center transition-colors"
              >
                <FaTrash className="mr-1" /> Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;