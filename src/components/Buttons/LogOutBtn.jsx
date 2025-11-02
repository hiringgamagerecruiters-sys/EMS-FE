import React from 'react'
import {  useNavigate } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import Cookies from "js-cookie";

function LogOutBtn() {

  const navigate = useNavigate();

  const hadlogOutBtn = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("email");
    navigate("/");
    window.location.reload();
  };
  return (
    <div className="px-4 py-3 mt-4 rounded-2xl flex justify-center items-center cursor-pointer">
        <button
          className="bg-amber-50 p-4 rounded-2xl hover:bg-red-300 active:bg-red-500 active:scale-95 transition duration-150 cursor-pointer flex items-center gap-2 "
          onClick={hadlogOutBtn}
        >
          <span className="text-md text-red-700 font-semibold">Log Out</span>
          <IoMdLogOut className="text-red-700 text-2xl" />
        </button>
      </div>
  )
}

export default LogOutBtn

