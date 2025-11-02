import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleEditClick = () => {
    navigate("/admin/a-profile-edit");
  };

  // Function to get initials from first and last name
  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("token");

        if (!token) {
          alert("Unauthorized. Please log in.");
          navigate("/login");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/admin/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
      } catch (err) {
        console.error("❌ Profile fetch error:", err);
        alert("Failed to load profile. Please log in again.");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-xl font-medium text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center pt-10 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="p-6">
          <div className="flex flex-col items-center">
            {/* Circle with initials (no profile image) */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-md">
              {getInitials(user.firstName, user.lastName)}
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              {user.firstName} {user.lastName}
            </h2>
            <h3 className="text-sm font-semibold text-gray-600">ID: {user._id}</h3>
            <h3 className="text-sm font-semibold text-gray-600">User Code: {user.userCode}</h3>

          </div>

          <div className="mt-6 space-y-4">
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Role" value={user.role} />
            <InfoRow label="Job Role" value={user.jobRole?.jobRoleName || "N/A"} />
            <InfoRow label="Contact" value={user.contactNumber || "N/A"} />
            <InfoRow
              label="Date of Birth"
              value={user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
            />
            <InfoRow label="NIC" value={user.nic || "N/A"} />
            <InfoRow
              label="Intern Start Date"
              value={
                user.internStartDate
                  ? new Date(user.internStartDate).toLocaleDateString()
                  : "N/A"
              }
            />
            <InfoRow
              label="Intern End Date"
              value={
                user.internEndDate
                  ? new Date(user.internEndDate).toLocaleDateString()
                  : "N/A"
              }
            />
            <InfoRow label="University" value={user.university || "N/A"} />
            <InfoRow label="Team" value={user.team?.teamName || "N/A"} />
            <InfoRow
              label="Address"
              value={`${user.addressLine1 || ""} ${user.addressLine2 || ""}`}
            />
          </div>

          <button
            onClick={handleEditClick}
            className="mt-6 w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between border-b pb-2">
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className="text-gray-800">{value || "N/A"}</span>
  </div>
);

export default Profile;
