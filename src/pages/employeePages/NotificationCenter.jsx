import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/employee/my-notifications",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications(response.data.notifications || []);
      setLoading(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
      if (err.response?.status === 401) navigate("/login");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Mark a notification as read
  const markAsRead = async (id) => {
    try {
      const token = Cookies.get("token");
      await axios.put(
        `http://localhost:5000/api/employee/my-notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err.response?.data || err.message);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  // Function to get sender name
  const getSenderName = (notification) => {
    if (notification.senderId) {
      // If senderId is populated with user details
      return `${notification.senderId.firstName} ${notification.senderId.lastName}`;
    } else {
      return "System";
    }
  };

  if (loading) return <div className="text-center py-8">Loading notifications...</div>;

  const filteredNotifications = notifications.filter((n) => {
    const notifDate = new Date(n.date || n.createdAt || Date.now());
    const now = new Date();
    switch (filter) {
      case "today":
        return notifDate.toDateString() === now.toDateString();
      case "1day":
        return now - notifDate <= 24 * 60 * 60 * 1000;
      case "7days":
        return now - notifDate <= 7 * 24 * 60 * 60 * 1000;
      case "30days":
        return now - notifDate <= 30 * 24 * 60 * 60 * 1000;
      default:
        return true;
    }
  });

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Notification Center</h2>
      </div>

      <div className="flex justify-end mb-4 space-x-2">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="today">Today</option>
          <option value="1day">Last 1 Day</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="all">All</option>
        </select>
      </div>

      {filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map((n) => {
            const notifDate = new Date(n.date || n.createdAt || Date.now());
            return (
              <div
                key={n._id}
                className={`p-3 border rounded-lg shadow-sm cursor-pointer ${
                  n.read ? "bg-gray-50" : "bg-blue-50 border-blue-300"
                }`}
                onClick={() => markAsRead(n._id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-lg">{n.title}</p>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    From: {getSenderName(n)}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{n.message}</p>
                <p className="text-sm text-gray-400">
                  {notifDate.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No notifications found for this filter.</p>
      )}
    </div>
  );
}

export default NotificationCenter;