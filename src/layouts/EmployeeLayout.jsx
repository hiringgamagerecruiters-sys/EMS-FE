import React, { useState, useEffect } from "react";
import EmployeeSideNav from "../components/ui/employeeNavBar/SideNavBar";
import { Outlet, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { FaBars, FaRegBell } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import Cookies from "js-cookie";

function EmployeeLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fetch unread notifications
  const fetchUnreadNotifications = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) return;

      const response = await axios.get(
        "http://localhost:5000/api/employee/my-notifications",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Filter unread notifications
      const unread = response.data.notifications.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Error fetching notifications:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchUnreadNotifications();

    // Optional: poll every 15 seconds for live updates
    const interval = setInterval(fetchUnreadNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 transform transition-all duration-300 ease-in-out 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        >
          <EmployeeSideNav isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>

        {/* Main Content */}
        <div className="flex-grow bg-gray-100 overflow-y-auto px-6 relative">
          {/* Top Navbar */}
          <div className="flex justify-between items-center xl:px-6 xl:py-3 sticky top-0 bg-gray-100 z-20">
            {/* Left: Logo + Sidebar Toggle */}
            <div className="flex items-center gap-4">
              <button className="lg:hidden px-2" onClick={toggleSidebar}>
                <FaBars className="text-xl text-gray-700" />
              </button>

              <img
                src={Logo}
                alt="logo"
                className="w-14 sm:w-10 h-auto rounded-lg object-contain p-2"
              />
              <span className="text-black font-bold xl:text-xl text-sm">
                Gamage Recruiters (PVT) LTD
              </span>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center justify-end gap-6 pr-5 relative">
              <button
                className="relative"
                onClick={() => navigate("/employee/notification")}
              >
                <FaRegBell className="text-2xl text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button onClick={() => navigate("/employee/profile")}>
                <CgProfile className="text-2xl text-gray-700" />
              </button>
            </div>
          </div>

          {/* Page Content */}
          <div className="pt-4 pb-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeLayout;
