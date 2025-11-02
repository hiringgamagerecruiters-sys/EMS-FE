import { CourseContext } from "../../../context/CourseContext"; 
import { NavLink, useNavigate } from "react-router-dom";
import { FaQuestion } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { AiOutlineProfile } from "react-icons/ai";
import { LuListChecks } from "react-icons/lu";
import { PiMonitorBold } from "react-icons/pi";
import { LiaSignOutAltSolid } from "react-icons/lia";
import { RiArrowLeftBoxLine } from "react-icons/ri";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import LogOutBtn from "../../Buttons/LogOutBtn";
import Cookies from "js-cookie";

function SideNavBar({ isOpen, toggleSidebar }) {
  const navItems = [
    {
      path: "/employee/dashboard",
      icon: <IoHomeOutline className="text-2xl" />,
      label: "My Dashboard",
    },
    {
      path: "/employee/dairy-submit",
      icon: <AiOutlineProfile className="text-2xl" />,
      label: "Intern Dairy Submit",
    },
    {
      path: "/employee/leave-form",
      icon: <PiMonitorBold className="text-xl" />,
      label: "Apply for Leave",
    },
    {
      path: "/employee/taskManagement",
      icon: <LuListChecks className="text-xl" />,
      label: "Task Management",
    },
  ];
  const navigate = useNavigate();
  const userId = Cookies.get("id");
  const userEmail = Cookies.get("email");
  const userName = Cookies.get("name") || userEmail?.split('@')[0] || "User";
  const userCode = Cookies.get("userCode");
  

  const hadlegolearninghub = () => {
    navigate("/employee/learninghub");
  };


  return (
    <section
      className={`bg-[#0097A7] shadow-lg flex-col space-y-6 h-full p-4 w-72  max-h-screen overflow-y-auto absolute xl:static z-20 transition-all duration-300 ${
        isOpen ? "fixed lg:static" : "hidden lg:block"
      }`}
    >
      <div className="flex justify-end items-center ">
        <button
          onClick={toggleSidebar}
          className="xl:hidden text-black text-3xl border border-white hover:border-white hover:text-white rounded-3xl p-2"
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
            <div className="text-gray-500 text-xs">
              {userId || "Not found"}

            </div>
               <div className="text-gray-500 text-xs font-bold">
              {userCode || "Not found"}

            </div>
          </div>
        </div>
      </div>

      <nav className="flex flex-col space-y-4 xl:mt-10">
        {navItems.map(({ path, icon, label }) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => window.innerWidth < 768 && toggleSidebar()}
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

      <div className="flex flex-col justify-center items-center mt-10 w-[250px] rounded-xl ">
        <div className="relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10 bg-slate-500 p-4 rounded-full border-amber-50 border-4">
            <FaQuestion />
          </div>
          <div className="bg-slate-500 px-5 py-5 flex flex-col items-center justify-center rounded-2xl">
            <div className="p-3 text-white font-bold text-xl text-center">
              Learning Hub
            </div>
            <div className="p-3 text-white text-center font-semibold">
              <div>Having Trouble in Learning?</div>
              <div>Contact us for more questions.</div>
            </div>
            <button
              className="bg-green-400 p-3 w-full gap-2 rounded-2xl hover:bg-green-600 active:scale-95 transition duration-150 cursor-pointer active:bg-green-300 flex items-center justify-center font-semibold"
              onClick={hadlegolearninghub}
            >
              <span className="inline-block text-md">Go To Learning Hub</span>
              <FaRegArrowAltCircleRight className="text-2xl" />
            </button>
          </div>
        </div>
      </div>

      <LogOutBtn/>
      
    </section>
  );
}

export default SideNavBar;
