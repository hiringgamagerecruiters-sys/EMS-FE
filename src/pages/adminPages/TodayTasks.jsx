import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import TaskCard from '../../components/Task.componets/TaskCards';
import api from '../../utils/api';

function TodayTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchTodayTasks = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get(
        "/admin/today_tasks",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(Array.isArray(response.data) ? response.data : []); // ✅ backend sends raw array
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      if (err.response?.status === 401) navigate("/login");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayTasks();
  }, [navigate]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredTasks = tasks.filter(task =>
    task.name?.toLowerCase().includes(searchQuery) ||
    task.assignedTo?.email?.toLowerCase().includes(searchQuery)
  );

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Today's Tasks ({filteredTasks.length})
      </h2>

      {/* Search Bar */}
      <div className='w-full flex justify-end'>
        <div className="mb-4 w-md">
          <input
            type="text"
            placeholder="Search by task name or email"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
      </div>

      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTasks.map(task => (
            <TaskCard 
              key={task._id} 
              task={task}
              refreshTasks={fetchTodayTasks}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No tasks for today.</p>
      )}
    </div>
  );
}

export default TodayTasks;
