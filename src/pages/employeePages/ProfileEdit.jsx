import React, { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import api from "../../utils/api";
const BASE_URL = import.meta.env.VITE_API_URL_;

function ProfileEdit() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [avatar, setAvatar] = useState(null);
  const [activeForm, setActiveForm] = useState("profile");
  const [editableField, setEditableField] = useState(null);
  const [errors, setErrors] = useState({});
  const [teams, setTeams] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingJobRoles, setLoadingJobRoles] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    dob: "",
    nic: "",
    internshipStartDate: "",
    internshipEndDate: "",
    university: "",
    jobRole: "",
    team: "",
    addressLine1: "",
    addressLine2: "",
    password: "" // current password for verification
  });

  const [passwordForm, setPasswordForm] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const fetchTeams = async () => {
      setLoadingTeams(true);
      try {
        const response = await api.get("/admin/teams");
        setTeams(response.data);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
        alert("Failed to load teams. Please try again later.");
      } finally {
        setLoadingTeams(false);
      }
    };
    
    const fetchJobRoles = async () => {
      setLoadingJobRoles(true);
      try {
        const response = await api.get("/admin/job-roles");
        setJobRoles(response.data);
      } catch (error) {
        console.error("Failed to fetch job roles:", error);
        alert("Failed to load job roles. Please try again later.");
      } finally {
        setLoadingJobRoles(false);
      }
    };
    
    fetchTeams();
    fetchJobRoles();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) return navigate("/login");

        const res = await api.get("/employee/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;

        setProfileForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          contact: data.contactNumber || "",
          dob: data.dob?.slice(0, 10) || "",
          nic: data.nic || "",
          internshipStartDate: data.internStartDate?.slice(0, 10) || "",
          internshipEndDate: data.internEndDate?.slice(0, 10) || "",
          university: data.university || "",
          jobRole: data.jobRole?._id || "",
          team: data.team?._id || "",
          addressLine1: data.addressLine1 || "",
          addressLine2: data.addressLine2 || "",
          password: ""
        });

        setPasswordForm(prev => ({ ...prev, email: data.email || "" }));

        if (data.profileImage) {
          setAvatar(`http://localhost:5000/uploads/${data.profileImage}`);
        }
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleProfileChange = (e) => {
    const { id, value } = e.target;
    setProfileForm({ ...profileForm, [id]: value });
  };

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswordForm({ ...passwordForm, [id]: value });
  };

  const handleInputClick = (field) => setEditableField(field);

  const handleFormBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setEditableField(null);
  };

  const handleReset = () => window.location.reload();

  const handleAvatarUpload = async (file) => {
    try {
      const token = Cookies.get("token");
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await api.post(
        "/employee/upload-avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAvatar(`http://localhost:5000/uploads/${res.data.filename}`);
      alert("Avatar updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to upload avatar");
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = Cookies.get("token");
    if (!token) return navigate("/login");

    try {
      const payload = {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email,
        contactNumber: profileForm.contact,
        dob: profileForm.dob,
        nic: profileForm.nic,
        internStartDate: profileForm.internshipStartDate,
        internEndDate: profileForm.internshipEndDate,
        university: profileForm.university,
        jobRole: profileForm.jobRole,
        team: profileForm.team,
        addressLine1: profileForm.addressLine1,
        addressLine2: profileForm.addressLine2,
        password: profileForm.password
      };

      await api.put("/employee/profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    const token = Cookies.get("token");
    if (!token) return navigate("/login");

    try {
      await api.put(
        "/employee/profile",
        {
          password: profileForm.password,
          newPassword: passwordForm.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Password changed successfully!");
      setPasswordForm({ email: passwordForm.email, newPassword: "", confirmPassword: "" });
      setProfileForm({ ...profileForm, password: "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to change password.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md relative mt-10">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
      >
        <IoIosCloseCircleOutline size={24} />
      </button>

      <div className="absolute top-4 left-4">
        <IoSettingsSharp
          onClick={() => setActiveForm(prev => prev === "profile" ? "password" : "profile")}
          className="text-blue-600 hover:text-blue-800 cursor-pointer"
          size={24}
          title={activeForm === "profile" ? "Change Password" : "Edit Profile"}
        />
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="relative w-24 h-24 mb-4">
          <img
            src={avatar || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="}
            alt="avatar"
            className="w-full h-full rounded-full object-cover border-4 border-gray-100"
          />
          {activeForm === "profile" && (
            <div
              className="absolute bottom-0 right-0 bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700"
              onClick={() => fileInputRef.current.click()}
            >
              <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25z" />
                <path d="M14.06 6.19l3.75 3.75" />
              </svg>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => setAvatar(ev.target.result);
                reader.readAsDataURL(file);
                handleAvatarUpload(file);
              }
            }}
          />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">
          {activeForm === "profile" ? "Edit Profile" : "Change Password"}
        </h2>
      </div>

      {activeForm === "profile" ? (
        <form onBlur={handleFormBlur} onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { id: "firstName", label: "First Name", type: "text" },
            { id: "lastName", label: "Last Name", type: "text" },
            { id: "email", label: "Email", type: "email" },
            { id: "contact", label: "Contact Number", type: "text" },
            { id: "dob", label: "Date of Birth", type: "date" },
            { id: "nic", label: "NIC", type: "text" },
            { id: "internshipStartDate", label: "Internship Start", type: "date" },
            { id: "internshipEndDate", label: "Internship End", type: "date" },
            { id: "university", label: "University", type: "text" },
            { id: "addressLine1", label: "Address Line 1", type: "text" },
            { id: "addressLine2", label: "Address Line 2", type: "text" },
          ].map(({ id, label, type }) => (
            <div key={id} className="space-y-1">
              <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                id={id}
                type={type}
                value={profileForm[id]}
                readOnly={editableField !== id}
                className={`w-full px-3 py-2 border rounded-md ${editableField !== id ? 'bg-gray-50 cursor-pointer' : 'bg-white'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                onClick={() => handleInputClick(id)}
                onChange={handleProfileChange}
              />
            </div>
          ))}

          {/* Team Dropdown */}
          <div className="space-y-1">
            <label htmlFor="team" className="block text-sm font-medium text-gray-700">
              Team
            </label>
            {loadingTeams ? (
              <div className="w-full px-3 py-2 border rounded-md bg-gray-100 animate-pulse">
                Loading teams...
              </div>
            ) : (
              <select
                id="team"
                value={profileForm.team}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                onChange={handleProfileChange}
              >
                <option value="">Select Team</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.teamName}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Job Role Dropdown */}
          <div className="space-y-1">
            <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700">
              Job Role
            </label>
            {loadingJobRoles ? (
              <div className="w-full px-3 py-2 border rounded-md bg-gray-100 animate-pulse">
                Loading job roles...
              </div>
            ) : (
              <select
                id="jobRole"
                value={profileForm.jobRole}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                onChange={handleProfileChange}
              >
                <option value="">Select Job Role</option>
                {jobRoles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.jobRoleName}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="md:col-span-2 space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Current Password (for verification)
            </label>
            <input
              id="password"
              type="password"
              value={profileForm.password}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              onChange={handleProfileChange}
              required
            />
          </div>

          <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
            <button type="button" onClick={handleReset} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Reset</button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 gap-6">
          {["email","newPassword","confirmPassword"].map(id => (
            <div key={id} className="space-y-1">
              <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {id === "newPassword" ? "New Password" : 
                 id === "confirmPassword" ? "Confirm Password" : "Email"}
              </label>
              <input
                id={id}
                type={id.includes("Password") ? "password" : "email"}
                value={passwordForm[id]}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                onChange={handlePasswordChange}
                required
              />
              {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
            </div>
          ))}
          <div className="flex justify-end space-x-4 mt-4">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Change Password</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ProfileEdit;