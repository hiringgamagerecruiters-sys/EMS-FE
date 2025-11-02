import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import AdminSideNav from "../components/ui/adminNavBar/SideNavBar";
import { Outlet } from "react-router-dom";
import Logo from "../assets/logo.png";
import { FaBars } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FaRegBell } from "react-icons/fa";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

   const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="flex h-screen">
        {/* Sidebar - hidden on medium screens unless open */}
        <div
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 transform transition-all duration-300 ease-in-out 
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <AdminSideNav isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </div>

        {/* Main Content Area */}
        <div className="flex-grow overflow-y-auto relative h-[100vh]" >
          {/* Top Navigation Bar */}
          <div className="flex justify-between items-center xl:px-6 xl:py-3 sticky top-0 bg-gray-100 z-20 h-[6vh]">
            {/* Left: Logo + Sidebar Toggle */}
            <div className="flex items-center gap-4 ml-5">
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
            <div className="flex items-center justify-end gap-6 pr-5">
              <button onClick={() => navigate('/admin/createNotification')}>
                <FaRegBell className="size-5" />
              </button>

              <button onClick={() => navigate('/admin/profile')}>
                <CgProfile className="size-9 " />
              </button>
            </div>
          </div>

          {/* Page Content */}
          <div className="">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
