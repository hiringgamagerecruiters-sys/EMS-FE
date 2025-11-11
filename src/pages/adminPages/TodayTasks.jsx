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

      console.log("🔄 Fetching today's tasks...");
      
      const response = await api.get(
        "/admin/today_tasks",
        { 
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log("✅ Today's tasks response:", response.data);
      
      if (Array.isArray(response.data)) {
        setTasks(response.data);
        console.log(`📊 Loaded ${response.data.length} tasks`);
        
        // Debug: Log each task
        response.data.forEach((task, index) => {
          const taskDate = task.deadline ? new Date(task.deadline) : null;
          const isToday = taskDate && 
            taskDate.toDateString() === new Date().toDateString();
          
          console.log(`Task ${index + 1}:`, {
            name: task.name,
            deadline: task.deadline,
            isToday: isToday,
            status: task.status,
            assignedTo: task.assignedTo?.email,
          });
        });
      } else {
        console.warn("⚠️ Response data is not an array:", response.data);
        setTasks([]);
      }
    } catch (err) {
      console.error("❌ Error fetching today's tasks:", err);
      
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

  // FIXED: Improved search filter that properly handles email search
  const filteredTasks = tasks.filter(task => {
    if (!searchQuery) return true;
    
    const searchTerm = searchQuery.toLowerCase();
    
    // Search in task name
    if (task.name?.toLowerCase().includes(searchTerm)) {
      return true;
    }
    
    // Search in assigned user's email (fixed)
    if (task.assignedTo?.email?.toLowerCase().includes(searchTerm)) {
      return true;
    }
    
    // Search in assigned user's first name
    if (task.assignedTo?.firstName?.toLowerCase().includes(searchTerm)) {
      return true;
    }
    
    // Search in assigned user's last name
    if (task.assignedTo?.lastName?.toLowerCase().includes(searchTerm)) {
      return true;
    }
    
    // Search in full name (combination of first and last name)
    const fullName = `${task.assignedTo?.firstName || ''} ${task.assignedTo?.lastName || ''}`.toLowerCase().trim();
    if (fullName.includes(searchTerm)) {
      return true;
    }
    
    return false;
  });

  // Categorize tasks for better display
  const tasksDueToday = filteredTasks.filter(task => {
    if (!task.deadline) return false;
    const taskDate = new Date(task.deadline);
    return taskDate.toDateString() === new Date().toDateString();
  });

  const upcomingTasks = filteredTasks.filter(task => {
    if (!task.deadline) return false;
    const taskDate = new Date(task.deadline);
    return taskDate > new Date();
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading tasks...</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Active Tasks ({filteredTasks.length})
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {tasksDueToday.length} due today • {upcomingTasks.length} upcoming
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchTodayTasks}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            Refresh
          </button>
        </div>
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
            placeholder="Search by task name, user email, or user name"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Debug search info (remove in production) */}
      {searchQuery && (
        <div className="mb-4 p-2 bg-blue-50 rounded text-sm text-blue-700">
          Searching for: "{searchQuery}" • Found {filteredTasks.length} tasks
          {filteredTasks.length > 0 && (
            <div className="mt-1 text-xs">
              Matching tasks: {filteredTasks.map(t => t.name).join(', ')}
            </div>
          )}
        </div>
      )}

      {filteredTasks.length > 0 ? (
        <div>
          {/* Tasks Due Today Section */}
          {tasksDueToday.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Due Today ({tasksDueToday.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {tasksDueToday.map(task => (
                  <TaskCard 
                    key={task._id} 
                    task={task}
                    refreshTasks={fetchTodayTasks}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Tasks Section */}
          {upcomingTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                Upcoming Tasks ({upcomingTasks.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {upcomingTasks.map(task => (
                  <TaskCard 
                    key={task._id} 
                    task={task}
                    refreshTasks={fetchTodayTasks}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other Active Tasks */}
          {filteredTasks.length > tasksDueToday.length + upcomingTasks.length && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Other Active Tasks ({filteredTasks.length - tasksDueToday.length - upcomingTasks.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTasks
                  .filter(task => {
                    if (!task.deadline) return true;
                    const taskDate = new Date(task.deadline);
                    return taskDate.toDateString() !== new Date().toDateString() && 
                           taskDate <= new Date();
                  })
                  .map(task => (
                    <TaskCard 
                      key={task._id} 
                      task={task}
                      refreshTasks={fetchTodayTasks}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {error ? 'Error Loading Tasks' : 'No active tasks found'}
          </h3>
          <p className="text-gray-500 mb-4">
            {error 
              ? error 
              : "There are no active tasks assigned to users."}
          </p>
          
          <div className="max-w-md mx-auto text-sm text-gray-600 bg-white p-4 rounded-lg border text-left">
            <p className="font-medium mb-2">What this section shows:</p>
            <ul className="space-y-1">
              <li>• Tasks with status: Assigned, Progress, or Pending</li>
              <li>• Tasks due today OR created recently</li>
              <li>• Tasks assigned to active users</li>
            </ul>
          </div>
          
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