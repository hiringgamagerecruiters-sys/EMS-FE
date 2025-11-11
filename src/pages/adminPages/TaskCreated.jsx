import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import TaskCard from "../../components/Task.componets/TaskCards";
import api from "../../utils/api";

function TaskCreated({ refreshTrigger = 0 }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchCreatedTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const token = Cookies.get("token");
      if (!token) {
        navigate("/login");
        return;
      }

      console.log("Fetching created tasks...");
      
      const response = await api.get(
        "/admin/created_tasks",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Created tasks response:", response.data);
      setTasks(response.data || []);
    } catch (err) {
      console.error("Error fetching created tasks:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      } else if (err.response?.status === 404) {
        setError("Created tasks endpoint not found. Please contact administrator.");
      } else {
        setError("Failed to load created tasks. Please try again.");
      }
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatedTasks();
  }, [navigate, refreshTrigger]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Enhanced search function that properly searches by email
  const filteredTasks = tasks.filter((task) => {
    if (!searchQuery) return true;
    
    const searchTerm = searchQuery.toLowerCase();
    
    // Search in task name
    const nameMatch = task.name?.toLowerCase().includes(searchTerm);
    
    // Search in assigned user's email
    const emailMatch = task.assignedTo?.email?.toLowerCase().includes(searchTerm);
    
    // Search in assigned user's first name
    const firstNameMatch = task.assignedTo?.firstName?.toLowerCase().includes(searchTerm);
    
    // Search in assigned user's last name
    const lastNameMatch = task.assignedTo?.lastName?.toLowerCase().includes(searchTerm);
    
    // Search in assigned user's full name
    const fullName = `${task.assignedTo?.firstName || ''} ${task.assignedTo?.lastName || ''}`.toLowerCase().trim();
    const fullNameMatch = fullName.includes(searchTerm);
    
    // Search in task description
    const descriptionMatch = task.description?.toLowerCase().includes(searchTerm);
    
    // Search in task status
    const statusMatch = task.status?.toLowerCase().includes(searchTerm);
    
    return nameMatch || emailMatch || firstNameMatch || lastNameMatch || 
           fullNameMatch || descriptionMatch || statusMatch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading created tasks...</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Created Tasks ({filteredTasks.length})
        </h2>
        <button
          onClick={fetchCreatedTasks}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Error Display */}
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

      {/* Enhanced Search Bar */}
      <div className="w-full flex justify-end mb-6">
        <div className="w-80">
          <input
            type="text"
            placeholder="Search by task name, email, user name, or description"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="text-xs text-gray-500 mt-1">
            Search by: task name, email, user name, or description
          </div>
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">
            Showing {filteredTasks.length} of {tasks.length} tasks matching "{searchQuery}"
          </p>
        </div>
      )}

      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              refreshTasks={fetchCreatedTasks}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {searchQuery ? 'No matching tasks found' : 'No tasks created yet'}
          </h3>
          <p className="text-gray-500">
            {searchQuery 
              ? `No tasks found matching "${searchQuery}". Try searching with different terms.` 
              : "You haven't created any tasks yet."}
          </p>
          
          {searchQuery && (
            <div className="mt-4 max-w-md mx-auto text-sm text-gray-600 bg-white p-4 rounded-lg border text-left">
              <p className="font-medium mb-2">Search tips:</p>
              <ul className="space-y-1">
                <li>• Try searching by user email address</li>
                <li>• Search by user first or last name</li>
                <li>• Search by task name or description</li>
                <li>• Check for typos in your search</li>
              </ul>
            </div>
          )}
          
          {error && (
            <button
              onClick={fetchCreatedTasks}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskCreated;