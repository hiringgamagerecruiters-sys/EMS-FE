
import React, { useState } from "react";
import logo from "../../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const BASE_URL = import.meta.env.VITE_API_URL;


function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    console.log("Login data email is : ", email);
    console.log("Login data pasword is : ", password);

    event.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        
        Cookies.set("token", data.token, { expires: 1 / 24 });
        Cookies.set("role", data.role, { expires: 1 / 24 });
        Cookies.set("email", email, { expires: 1 / 24 });
        Cookies.set("id", data.id, { expires: 1 / 24 });
        Cookies.set("userCode", data.userCode, { expires: 1 / 24 });



        

        setEmail("");
        setPassword("");

        if (data.role === "admin") {
           navigate("/admin/dashboard");
           alert("Login successful!");
           window.location.reload();
        } else if (data.role === "employee") {   
           navigate("/employee/dashboard");
           window.location.reload();
        } else {
          navigate("/");
          window.location.reload();
        }
      } else {
        alert(data.message || "Invalid credentials.");
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong.");
      navigate("/");
    }

     
  };

  return (
    <div className="min-h-screen bg-[#0097A7] flex items-center justify-center px-4 py-6 overflow-auto">
      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <img src={logo} alt="Logo" className="w-10 h-10 mr-2" />
          <h2 className="text-lg font-bold">Gamage Recruiters</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0097A7]"
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2  rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0097A7]"
            />
           
          </div>

          <div className="flex items-center mb-6">
            <input type="checkbox" id="remember" className="mr-2" />
            <label htmlFor="remember" className="text-sm">
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-[#0097A7] text-white font-bold shadow-md hover:bg-[#007c8a] transition"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/forgotpassword" className="text-sm text-black hover:underline">
            Forgot Password?
          </Link>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-800">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#0097A7] hover:underline font-bold"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
