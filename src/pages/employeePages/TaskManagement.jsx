import React, { useEffect, useState, useContext } from "react";
import { MainContext } from "../../context/MainContext";
import {
  FaTasks,
  FaStar,
  FaClock,
  FaHourglassHalf,
  FaRegClock,
  FaChevronDown,
  FaChevronRight,
  FaChevronLeft,
  FaFile,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

function TaskManagement() {
  const navigate = useNavigate();
  const { date, selectTask } = useContext(MainContext);
  const [tasks, setTasks] = useState([]);
  const [acceptedTasks, setAcceptedTasks] = useState(new Set());
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleViewDetails = (task) => {
    selectTask(task);
    navigate("/employee/taskdetails");
  };

  // BUG025: Handle task acceptance
  const handleAcceptTask = async (taskId) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Unauthorized. Please log in.");
        navigate("/login");
        return;
      }

      const response = await api.put(
        `/employee/tasks/${taskId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Update local state to show task as accepted
        setAcceptedTasks(prev => new Set(prev).add(taskId));
        
        // Refresh tasks list
        fetchTask();
        
        alert("Task accepted successfully!");
      }
    } catch (error) {
      console.error("Task acceptance error:", error);
      alert(error.response?.data?.msg || "Failed to accept task.");
    }
  };

  const fetchTask = async () => {
    try {
      const token = Cookies.get("token");

      if (!token) {
        alert("Unauthorized. Please log in.");
        navigate("/login");
        return;
      }

      const res = await api.get("/employee/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(res.data);
      
      // Initialize accepted tasks set
      const accepted = res.data
        .filter(task => task.status === "Accepted" || task.accepted)
        .map(task => task._id);
      setAcceptedTasks(new Set(accepted));
    } catch (err) {
      console.error("Task fetch error:", err);
      alert("Failed to load tasks. Please log in again.");
    }
  };

  // BUG026: Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  // BUG026: Handle file removal
  const handleRemoveFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // BUG026: Handle file submission
  const handleSubmitFiles = async (taskId) => {
    if (uploadedFiles.length === 0) {
      alert("Please upload at least one file before submitting.");
      return;
    }

    try {
      const token = Cookies.get("token");
      const formData = new FormData();
      
      uploadedFiles.forEach(file => {
        formData.append("files", file);
      });

      const response = await api.post(
        `/employee/tasks/${taskId}/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Files submitted successfully!");
        setUploadedFiles([]);
        fetchTask(); // Refresh tasks
      }
    } catch (error) {
      console.error("File submission error:", error);
      alert(error.response?.data?.msg || "Failed to submit files.");
    }
  };

  useEffect(() => {
    fetchTask();
  }, [date]);

  // Compute statistics
  const todayTasks = tasks.filter(
    (task) => new Date(task.deadline).toISOString().split("T")[0] === date
  );
  const pendingTasks = tasks.filter((task) => task.status === "Progress" || task.status === "Assigned");
  const totalTasks = tasks.length;

  const cardsData = [
    {
      id: 1,
      icon: <FaTasks className="text-2xl text-blue-500" />,
      title: "Today's Tasks",
      value: todayTasks.length,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      id: 2,
      icon: <FaHourglassHalf className="text-2xl text-amber-600" />,
      title: "Pending Tasks",
      value: pendingTasks.length,
      color: "bg-gradient-to-r from-amber-500 to-amber-600",
    },
    {
      id: 3,
      icon: <FaStar className="text-2xl text-purple-600" />,
      title: "Total Tasks",
      value: totalTasks,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
    },
  ];

  const getStatusColor = (status, taskId) => {
    // BUG025: Check if task is accepted
    if (acceptedTasks.has(taskId)) {
      return "bg-green-100 text-green-800 font-semibold";
    }
    
    switch (status) {
      case "Progress":
        return "bg-yellow-100 text-yellow-800 font-semibold";
      case "Assigned":
        return "bg-blue-100 text-blue-800 font-semibold";
      case "Accepted":
        return "bg-green-100 text-green-800 font-semibold";
      case "Completed":
        return "bg-green-100 text-green-800 font-semibold";
      default:
        return "bg-gray-100 text-gray-800 font-semibold";
    }
  };

  // BUG024: Check if task has files
  const hasTaskFiles = (task) => {
    return task.files && task.files.length > 0;
  };

  const hasUserFiles = (task) => {
    return task.submittedFiles && task.submittedFiles.length > 0;
  };

  // BUG024: File indicator component
  const FileIndicator = ({ hasFiles, type }) => (
    <div className="flex items-center space-x-1">
      <FaFile className="text-gray-400 text-xs" />
      <span className="text-xs text-gray-600">{type}:</span>
      <span className={`text-xs ${hasFiles ? 'text-green-600' : 'text-gray-400'}`}>
        {hasFiles ? '📎 File' : 'No file'}
      </span>
    </div>
  );

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 h-full">
      {/* Task Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {cardsData.map((task) => (
          <div
            key={task.id}
            className={`${task.color} rounded-xl text-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className="flex items-center">
              <div className="p-3 mr-4 bg-white bg-opacity-20 rounded-full">
                {task.icon}
              </div>
              <div>
                <p className="text-xl font-bold opacity-90">{task.title}</p>
                <p className="text-3xl font-bold">{task.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* File Upload Section - BUG026 */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md border border-blue-200 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800">Files Ready for Submission</h3>
            <button
              onClick={() => setUploadedFiles([])}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaFile className="text-blue-500" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Task */}
        <div className="bg-white h-fit p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FaTasks className="mr-2 text-blue-500" />
              Today's Tasks
            </h2>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                <FaChevronLeft className="text-gray-500 text-xs" />
              </button>
              <button className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                <FaChevronRight className="text-gray-500 text-xs" />
              </button>
            </div>
          </div>

          {todayTasks.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {todayTasks.map((task, index) => (
                <div
                  key={task._id || index}
                  className="min-w-[320px] border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {task.name}
                      </h3>
                      {/* BUG025: Accept button for assigned tasks */}
                      {(task.status === "Assigned" || !acceptedTasks.has(task._id)) ? (
                        <button
                          onClick={() => handleAcceptTask(task._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1"
                        >
                          <FaCheck className="text-xs" />
                          <span>Accept</span>
                        </button>
                      ) : (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                          ✓ Accepted
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 w-full mb-4 line-clamp-2 break-words">
                      {task.description}
                    </p>

                    {/* BUG024: File indicators */}
                    <div className="flex items-center space-x-4 text-xs mb-3">
                      <FileIndicator hasFiles={hasTaskFiles(task)} type="Task" />
                      <FileIndicator hasFiles={hasUserFiles(task)} type="Your" />
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <FaRegClock className="mr-2" />
                        <span>
                          Due: {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                          task.status,
                          task._id
                        )}`}
                      >
                        {acceptedTasks.has(task._id) ? "Accepted" : task.status}
                      </span>
                    </div>

                    {/* BUG026: File upload for this task */}
                    <div className="space-y-3">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      
                      <div className="flex space-x-2">
                        <button
                          className="flex-1 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-sm font-medium transition-colors"
                          onClick={() => handleViewDetails(task)}
                        >
                          View Details
                        </button>
                        
                        {uploadedFiles.length > 0 && (
                          <button
                            onClick={() => handleSubmitFiles(task._id)}
                            className="flex-1 py-2 bg-green-500 text-white hover:bg-green-600 rounded-md text-sm font-medium transition-colors"
                          >
                            Submit Files
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-gray-500">
              No tasks scheduled for today
            </div>
          )}

          <div className="mt-6 text-right">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors text-sm font-medium"
              onClick={() => navigate("/employee/my-tasks")}
            >
              View All Tasks
            </button>
          </div>
        </div>

        {/* All Tasks */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FaStar className="mr-2 text-purple-500" />
              All Tasks
            </h2>
            <button className="text-gray-500 hover:text-gray-700">
              <FaChevronDown />
            </button>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <div
                  key={task._id || index}
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {task.name}
                      </h3>
                      {/* BUG025: Accept button for assigned tasks */}
                      {(task.status === "Assigned" || !acceptedTasks.has(task._id)) ? (
                        <button
                          onClick={() => handleAcceptTask(task._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1"
                        >
                          <FaCheck className="text-xs" />
                          <span>Accept</span>
                        </button>
                      ) : (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                          ✓ Accepted
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 w-full mb-4 line-clamp-2 break-words">
                      {task.description}
                    </p>

                    {/* BUG024: File indicators */}
                    <div className="flex items-center space-x-4 text-xs mb-3">
                      <FileIndicator hasFiles={hasTaskFiles(task)} type="Task" />
                      <FileIndicator hasFiles={hasUserFiles(task)} type="Your" />
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <FaRegClock className="mr-2" />
                        <span>
                          Due: {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                          task.status,
                          task._id
                        )}`}
                      >
                        {acceptedTasks.has(task._id) ? "Accepted" : task.status}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      
                      <div className="flex space-x-2">
                        <button
                          className="flex-1 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-sm font-medium transition-colors"
                          onClick={() => handleViewDetails(task)}
                        >
                          View Details
                        </button>
                        
                        {uploadedFiles.length > 0 && (
                          <button
                            onClick={() => handleSubmitFiles(task._id)}
                            className="flex-1 py-2 bg-green-500 text-white hover:bg-green-600 rounded-md text-sm font-medium transition-colors"
                          >
                            Submit Files
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-gray-500">
                No tasks available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskManagement;