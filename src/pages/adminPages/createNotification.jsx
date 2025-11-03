import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

function CreateNotification() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch recent notifications
  const fetchNotifications = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get(
        "/admin/notifications",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Fetched notifications:", response.data);
      setNotifications(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching notifications:", err.response?.data || err.message);
      if (err.response?.status === 401) navigate("/login");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      const token = Cookies.get("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.post(
        "/admin/notifications/send",
        { title, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setSuccess("✅ Notification sent to all users!");
        setTitle("");
        setMessage("");
        fetchNotifications(); // refresh notifications list
      } else {
        setError("❌ Failed to send notification.");
      }
    } catch (err) {
      console.error("Error sending notification:", err.response?.data || err.message);
      if (err.response?.status === 401) navigate("/login");
      else setError("❌ Failed to send notification.");
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Notification</h2>

      {/* Notification Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full border p-2 rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter notification title"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Message</label>
          <textarea
            className="w-full border p-2 rounded-lg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter notification message"
            rows="4"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send Notification
        </button>
      </form>

      {/* Success/Error Messages */}
      {success && <p className="text-green-600 mt-4">{success}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}

      {/* Recent Notifications */}
      <h3 className="text-xl font-semibold mt-8 mb-4">Recent Notifications</h3>
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className="p-3 border rounded-lg bg-gray-50 shadow-sm"
            >
              <p className="font-semibold">{n.title}</p>
              <p className="text-gray-700">{n.message}</p>
              <p className="text-sm text-gray-400">
                {new Date(n.date || n.createdAt || Date.now()).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No notifications yet.</p>
      )}
    </div>
  );
}

export default CreateNotification;
