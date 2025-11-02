import React, { useState } from "react";
import SideNavBar from "../../components/ui/employeeNavBar/SideNavBar";
import { Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FaRegBell } from "react-icons/fa";

import Logo from "../../assets/logo.png";

function Employee() {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  return (
    <div className="flex h-screen relative">
      <SideNavBar
        showSidebar={showSidebar}
        toggleSidebar={toggleSidebar}
        className="xl:block w-72 absolute xl:static z-20 "
      />

      <div className="flex flex-col flex-grow bg-gray-100">
        <div className="flex justify-between items-center xl:px-6 xl:py-3 ">
          {/* Left: Logo + Sidebar Toggle */}

          <div className="xl:hidden ">
            <button className="px-5" onClick={toggleSidebar}>
              <FaBars className="text-xl text-gray-700" />
            </button>
          </div>

          <div className="flex flex-col xl:flex-row xl:gap-4 xl:justify-between w-full">
            <div className="flex items-center gap-4 ">
              <img
                src={Logo}
                alt="logo"
                className="w-14 sm:10 h-auto rounded-lg object-contain p-2"
              />
              <span className="text-black font-bold xl:text-xl text-sm">
                Gamage Recruiters (PVT) LTD
              </span>
            </div>
            {/* Right: Icons */}
            <div className="flex items-center justify-end gap-6 pr-5">
              <FaRegBell className="size-5" />
              <CgProfile className="size-9" />
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto px-4 py-4">
          <Outlet context={{ toggleSidebar }} />
        </div>
      </div>
    </div>
  );
}

export default Employee;
