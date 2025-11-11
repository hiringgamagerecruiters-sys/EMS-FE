import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import TaskCard from '../../components/Task.componets/TaskCards';
import api from '../../utils/api';

function TodayTasks({ refreshTrigger = 0 }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchTodayTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const token = Cookies.get("token");
      if (!token) {
        navigate("/login");
        return;
      }

      console.log("Fetching today's tasks...");
      
      const response = await api.get(
        "/admin/today_tasks",
        { 
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log("Today's tasks response:", response.data);
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching today's tasks:", err);
      
      if (err.response?.status === 404) {
        setError("Today's tasks endpoint not found. Please contact administrator.");
      } else if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to load today's tasks. Please try again.");
      }
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayTasks();
  }, [navigate, refreshTrigger]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredTasks = tasks.filter(task =>
    task.name?.toLowerCase().includes(searchQuery) ||
    task.assignedTo?.email?.toLowerCase().includes(searchQuery) ||
    task.assignedTo?.firstName?.toLowerCase().includes(searchQuery) ||
    task.assignedTo?.lastName?.toLowerCase().includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading today's tasks...</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Today's Tasks ({filteredTasks.length})
        </h2>
        <button
          onClick={fetchTodayTasks}
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

      {/* Search Bar */}
      <div className='w-full flex justify-end mb-6'>
        <div className="w-80">
          <input
            type="text"
            placeholder="Search by task name, email, or user name"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <TaskCard 
              key={task._id} 
              task={task}
              refreshTasks={fetchTodayTasks}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {error ? 'Error Loading Tasks' : 'No tasks scheduled for today'}
          </h3>
          <p className="text-gray-500">
            {error 
              ? error 
              : tasks.length === 0 
                ? "No tasks have been assigned for today." 
                : "No tasks match your search criteria."}
          </p>
          {error && (
            <button
              onClick={fetchTodayTasks}
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

export default TodayTasks;