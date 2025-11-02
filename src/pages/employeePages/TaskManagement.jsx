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
} from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function TaskManagement() {
  const navigate = useNavigate();
  const { date, selectTask } = useContext(MainContext);
  const [tasks, setTasks] = useState([]);

  const handleViewDetails = (task) => {
    selectTask(task); // Store the task in context
    navigate("/employee/taskdetails"); // Navigate to details page
  };

  const fetchTask = async () => {
    try {
      const token = Cookies.get("token");

      if (!token) {
        alert("Unauthorized. Please log in.");
        navigate("/login");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/employee/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(res.data);
    } catch (err) {
      console.error(" Task fetch error:", err);
      alert("Failed to load Task. Please log in again.");
    }
  };

  useEffect(() => {
    fetchTask();
  }, [date]);

  // Compute statistics
  const todayTasks = tasks.filter(
    (task) => new Date(task.deadline).toISOString().split("T")[0] === date
  );
  const pendingTasks = tasks.filter((task) => task.status === "Progress");
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Progress":
        return "bg-yellow-100 text-yellow-800 font-semibold";
      case "Assigned":
        return "bg-blue-100 text-blue-800 font-semibold";
      default:
        return "bg-gray-100 text-gray-800 font-semibold";
    }
  };

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 h-full ">
      {/* Task Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {cardsData.map((task) => (
          <div
            key={task.id}
            className={`${task.color} rounded-xl  text-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Task */}
        <div className="bg-white h-fit p-6 rounded-xl shadow-sm border border-gray-100 ">
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
                  key={index}
                  className="min-w-[280px] border-red-400 flex-wrap rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {task.name}
                      </h3>
                      
                    </div>
                    <p className="text-sm text-gray-600 w-full mb-4 line-clamp-1 break-words">
                      {task.description}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <FaRegClock className="mr-2" />
                      <span>
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 ml-5 rounded-full ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                    </div>

                    <button
                      className="w-full py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-sm font-medium transition-colors"
                      onClick={() => handleViewDetails(task)}
                    >
                      View Details
                    </button>
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
                  key={index}
                  className="min-w-[280px] border border-sky-500 flex-wrap rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {task.name}
                      </h3>
                      
                    </div>
                    <p className="text-sm text-gray-600 w-full mb-4 line-clamp-1 break-words">
                      {task.description}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <FaRegClock className="mr-2" />
                      <span>
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </span>
                      <span
                        className={`text-xs px-2 ml-5 py-1 rounded-full ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                    </div>

                    <button
                      className="w-full py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-sm font-medium transition-colors"
                      onClick={() => handleViewDetails(task)}
                    >
                      View Details
                    </button>
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
