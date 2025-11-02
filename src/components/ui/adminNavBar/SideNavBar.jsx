import { NavLink } from "react-router-dom";
import { CourseContext } from "../../../context/CourseContext"; // adjust path as needed
import { RiArrowLeftBoxLine } from "react-icons/ri";
import LogOutBtn from "../../Buttons/LogOutBtn";

import {
  FaTachometerAlt,
  FaUserPlus,
  FaBookOpen,
  FaCalendarAlt,
  FaTasks,
  FaFolderOpen,
  FaUserCircle,
  FaWpforms,
  FaEye,
  FaHistory,
  FaRegBell
} from "react-icons/fa";

import Cookies from "js-cookie";

const navItems = [
  {
    path: "/admin/dashboard",
    icon: <FaTachometerAlt />,
    label: "My Dashboard",
  },
  { path: "/admin/viewmember", icon: <FaEye />, label: "View  Members" },
  {
    path: "/admin/registration",
    icon: <FaUserPlus />,
    label: "Intern Registration",
  },
  {
    path: "/admin/diaries",
    icon: <FaBookOpen />,
    label: "Intern Daily Diaries",
  },
  { path: "/admin/leave", icon: <FaCalendarAlt />, label: "Leave Management" },
  { path: "/admin/task", icon: <FaTasks />, label: "Task Management" },
  {
    path: "/admin/resource",
    icon: <FaFolderOpen />,
    label: "Learning Resources",
  },
  {
    path: "/admin/learn_hubForm",
    icon: <FaWpforms />,
    label: "Learn Hub Form",
  },
   { path: '/admin/attendanceHistory', icon: <FaHistory />, label: 'Attendance Hisory' },

      { path: '/admin/createNotification', icon: <FaRegBell  />, label: 'Create Notification' },



];

function SideNavBar({ isOpen, toggleSidebar }) {
  // const userId = Cookies.get("id");
  const userEmail = Cookies.get("email");
  const userName = Cookies.get("name") || userEmail?.split("@")[0] || "User";
  const userCode = Cookies.get("userCode");


  return (
    <section
      className={`bg-[#0097A7] shadow-lg flex-col space-y-6 h-full max-h-screen overflow-y-auto p-4 w-72 transition-all duration-300  ${
        isOpen ? "fixed lg:static" : "hidden lg:block"
      }`}
    >
      <div className="flex justify-end items-center">
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-black text-3xl border border-white hover:border-white hover:text-white rounded-3xl p-2"
        >
          <RiArrowLeftBoxLine />
        </button>
      </div>

      {/* User Profile Display */}
      <div className="bg-white rounded-lg p-2 w-fit h-fit shadow">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-800 text-sm">
              {userName}
            </div>
            {/* <div className="text-gray-500 text-xs">{userId || "Not found"}</div> */}
            <div className="text-gray-500 text-xs">{userCode || "Not found"}</div>

          </div>
        </div>
      </div>

      <nav className="flex flex-col space-y-2 overflow-y-auto xl:mt-10">
        {navItems.map(({ path, icon, label }) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => {
              // Close sidebar on mobile when a link is clicked
              if (window.innerWidth < 1024) {
                toggleSidebar();
              }
            }}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-white text-[#0097A7] shadow-md font-semibold"
                  : "text-gray-950 hover:bg-white hover:text-[#0097A7]"
              }`
            }
          >
            {icon}
            <span className="font-bold text-[16px] md:text-lg">{label}</span>
          </NavLink>
        ))}
      </nav>

      <LogOutBtn />
    </section>
  );
}

export default SideNavBar;
