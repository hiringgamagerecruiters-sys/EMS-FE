import React, { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { IoSettingsSharp } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
import api from "../../utils/api";
const BASE_URL = import.meta.env.VITE_API_URL_;


function ProfileEdit() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const [oldAvatar, setOldAvatar] = useState("");
  const [editableField, setEditableField] = useState(null);
  const [activeForm, setActiveForm] = useState("profile");
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [teams, setTeams] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingJobRoles, setLoadingJobRoles] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    dob: "",
    nic: "",
    internshipStartDate: "",
    internshipEndDate: "",
    role: "",
    jobRole: "",
    password: "",
    university: "",
    team: "",
    addressLine1: "",
    addressLine2: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Define required fields for validation
  const requiredFields = ['firstName', 'lastName', 'email', 'contact', 'dob', 'nic', 'internshipStartDate', 'internshipEndDate', 'university', 'addressLine1'];

  // Password requirements configuration
  const passwordRequirements = {
    minLength: 6,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false
  };

  // Enhanced validation rules
  const validationRules = {
    firstName: (value) => {
      if (!value || value.trim() === "") return "First name is required";
      if (!/^[A-Za-z\s]{2,50}$/.test(value)) return "First name must be 2-50 letters";
      return null;
    },
    lastName: (value) => {
      if (!value || value.trim() === "") return "Last name is required";
      if (!/^[A-Za-z\s]{2,50}$/.test(value)) return "Last name must be 2-50 letters";
      return null;
    },
    email: (value) => {
      if (!value || value.trim() === "") return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
      return null;
    },
    contact: (value) => {
      if (!value || value.trim() === "") return "Contact number is required";
      const contactPattern = /^(?:\+94|0)?[1-9]\d{8}$/;
      const cleanValue = value.replace(/\s/g, '');
      if (!contactPattern.test(cleanValue)) {
        return "Invalid Sri Lankan phone number format (e.g., 0771234567 or +94771234567)";
      }
      return null;
    },
    nic: (value) => {
      if (!value || value.trim() === "") return "NIC is required";
      const cleanNIC = value.trim().toUpperCase();
      const oldNICPattern = /^[0-9]{9}[VX]$/;
      const newNICPattern = /^[0-9]{12}$/;
      
      if (!oldNICPattern.test(cleanNIC) && !newNICPattern.test(cleanNIC)) {
        return "Invalid NIC format. Use 9 digits with V/X (901234567V) or 12 digits only (199901234567)";
      }
      
      if (oldNICPattern.test(cleanNIC)) {
        const lastChar = cleanNIC.charAt(9);
        if (lastChar !== 'V' && lastChar !== 'X') {
          return "Old NIC must end with V or X";
        }
      }
      
      if (newNICPattern.test(cleanNIC) && /[A-Za-z]/.test(cleanNIC)) {
        return "New NIC (12 digits) cannot contain letters";
      }
      
      return null;
    },
    dob: (value) => {
      if (!value) return "Date of Birth is required";
      const dob = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const minAge = new Date();
      minAge.setFullYear(today.getFullYear() - 100);
      
      const maxAge = new Date();
      maxAge.setFullYear(today.getFullYear() - 16);
      
      if (dob > maxAge) return "Must be at least 16 years old";
      if (dob < minAge) return "Invalid date of birth (maximum 100 years)";
      return null;
    },
    internshipStartDate: (value, allData) => {
      if (!value) return "Intern start date is required";
      const startDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate > today) {
        return "Start date cannot be in the future";
      }
      
      if (allData.internshipEndDate) {
        const endDate = new Date(allData.internshipEndDate);
        if (startDate >= endDate) {
          return "Start date must be before end date";
        }
      }
      return null;
    },
    internshipEndDate: (value, allData) => {
      if (!value) return "Intern end date is required";
      const endDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (endDate < today) {
        return "End date cannot be in the past";
      }
      
      if (allData.internshipStartDate) {
        const startDate = new Date(allData.internshipStartDate);
        if (endDate <= startDate) {
          return "End date must be after start date";
        }
      }
      return null;
    },
    university: (value) => {
      if (!value || value.trim() === "") return "University is required";
      if (value.length < 2) return "University name is too short";
      return null;
    },
    addressLine1: (value) => {
      if (!value || value.trim() === "") return "Address Line 1 is required";
      if (value.length < 5) return "Address is too short";
      return null;
    },
    password: (value, isForVerification = true) => {
      if (!value || value.trim() === "") {
        return isForVerification ? "Current password is required for verification" : "Password is required";
      }
      // BUG FIX: Apply same minimum length requirement for all passwords
      if (value.length < passwordRequirements.minLength) {
        return `Password must be at least ${passwordRequirements.minLength} characters`;
      }
      return null;
    }
  };

  // Enhanced password validation function
  const validatePassword = (password, isNewPassword = false) => {
    const errors = [];
    
    if (!password || password.length < passwordRequirements.minLength) {
      errors.push(`at least ${passwordRequirements.minLength} characters`);
    }
    
    if (passwordRequirements.requireUppercase && !/(?=.*[A-Z])/.test(password)) {
      errors.push("one uppercase letter");
    }
    
    if (passwordRequirements.requireLowercase && !/(?=.*[a-z])/.test(password)) {
      errors.push("one lowercase letter");
    }
    
    if (passwordRequirements.requireNumbers && !/(?=.*\d)/.test(password)) {
      errors.push("one number");
    }
    
    if (passwordRequirements.requireSpecialChars && !/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
      errors.push("one special character");
    }
    
    return errors;
  };

  // Real-time field validation
  const validateField = (name, value) => {
    if (requiredFields.includes(name) && (!value || value.trim() === '')) {
      return "This field is required";
    }

    const rule = validationRules[name];
    if (rule) {
      return rule(value, profileForm);
    }
    return null;
  };

  // Comprehensive form validation for profile
  const validateProfileForm = () => {
    const newErrors = {};
    
    requiredFields.forEach(field => {
      if (!profileForm[field] || profileForm[field].trim() === '') {
        newErrors[field] = "This field is required";
      }
    });

    Object.keys(validationRules).forEach(field => {
      if (field === 'password' || requiredFields.includes(field) || profileForm[field]) {
        const error = validationRules[field](profileForm[field], profileForm);
        if (error) {
          newErrors[field] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enhanced password form validation
  const validatePasswordForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!passwordForm.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passwordForm.email)) {
      newErrors.email = "Invalid email format";
    }
    
    // Current password validation - BUG FIX: Apply same rules as new password
    if (!profileForm.password) {
      newErrors.currentPassword = "Current password is required";
    } else {
      const currentPasswordErrors = validatePassword(profileForm.password);
      if (currentPasswordErrors.length > 0) {
        newErrors.currentPassword = `Current password must have ${currentPasswordErrors.join(', ')}`;
      }
    }
    
    // New password validation
    if (!passwordForm.newPassword) {
      newErrors.newPassword = "New password is required";
    } else {
      const newPasswordErrors = validatePassword(passwordForm.newPassword, true);
      if (newPasswordErrors.length > 0) {
        newErrors.newPassword = `New password must have ${newPasswordErrors.join(', ')}`;
      } else if (passwordForm.newPassword === profileForm.password) {
        newErrors.newPassword = "New password must be different from current password";
      }
    }
    
    // Confirm password validation
    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Get password requirements text for display
  const getPasswordRequirementsText = () => {
    const requirements = [`Minimum ${passwordRequirements.minLength} characters`];
    
    if (passwordRequirements.requireUppercase) {
      requirements.push("one uppercase letter");
    }
    if (passwordRequirements.requireLowercase) {
      requirements.push("one lowercase letter");
    }
    if (passwordRequirements.requireNumbers) {
      requirements.push("one number");
    }
    if (passwordRequirements.requireSpecialChars) {
      requirements.push("one special character");
    }
    
    return `Password must contain: ${requirements.join(', ')}`;
  };

  // Fetch teams and job roles
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
        if (!token) {
          alert("Unauthorized. Please log in.");
          navigate("/login");
          return;
        }

        const res = await api.get("/employee/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        setIsAdmin(data.role === "admin" || data.role === "super_admin");
        
        setProfileForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          contact: data.contactNumber || "",
          dob: data.dob?.slice(0, 10) || "",
          nic: data.nic || "",
          internshipStartDate: data.internStartDate?.slice(0, 10) || "",
          internshipEndDate: data.internEndDate?.slice(0, 10) || "",
          role: data.role || "",
          jobRole: data.jobRole?._id || "",
          university: data.university || "",
          team: data.team?._id || "",
          addressLine1: data.addressLine1 || "",
          addressLine2: data.addressLine2 || "",
          password: ""
        });

        setPasswordForm(prev => ({
          ...prev,
          email: data.email || ""
        }));

        if (data.profileImage) {
          setAvatar(`http://localhost:5000/uploads/${data.profileImage}`);
        }
      } catch (error) {
        alert("Failed to load profile. Please login again.");
        console.error(error);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleProfileChange = (e) => {
    const { id, value } = e.target;
    const updatedForm = { ...profileForm, [id]: value };
    setProfileForm(updatedForm);

    // Real-time validation
    const error = validateField(id, value);
    setErrors(prev => ({
      ...prev,
      [id]: error
    }));

    // Date dependencies handling
    if (id === "internshipStartDate" && profileForm.internshipEndDate) {
      const startDate = new Date(value);
      const endDate = new Date(profileForm.internshipEndDate);
      if (startDate >= endDate) {
        setErrors(prev => ({
          ...prev,
          internshipEndDate: "End date must be after start date"
        }));
      }
    }

    if (id === "internshipEndDate" && profileForm.internshipStartDate) {
      const endDate = new Date(value);
      const startDate = new Date(profileForm.internshipStartDate);
      if (endDate <= startDate) {
        setErrors(prev => ({
          ...prev,
          internshipEndDate: "End date must be after start date"
        }));
      }
    }
  };

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswordForm({ ...passwordForm, [id]: value });
    
    // Clear errors when user starts typing
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleInputClick = (field) => {
    if (editableField !== field) {
      setEditableField(field);
    }
  };

  const handleFormBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setEditableField(null);
    }
  };

  const handleReset = () => {
    window.location.reload();
  };

  const handleAvatarUpload = async (file) => {
    setOldAvatar(avatar);
    const previewURL = URL.createObjectURL(file);
    setAvatar(previewURL);

    const confirmUpload = window.confirm("Are you sure you want to change your avatar?");
    if (!confirmUpload) {
      setAvatar(oldAvatar);
      return;
    }

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

      setAvatar(`${BASE_URL}/uploads/${res.data.filename}`);
      alert("Avatar updated successfully!");
    } catch (error) {
      console.error("Avatar upload failed:", error);
      setAvatar(oldAvatar);
      alert("Failed to upload avatar.");
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    if (!validateProfileForm()) {
      alert("Please fix the validation errors before submitting.");
      setSubmitting(false);
      return;
    }

    const token = Cookies.get("token");
    if (!token) {
      alert("Unauthorized. Please log in.");
      navigate("/login");
      return;
    }

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

      if (isAdmin) {
        payload.role = profileForm.role;
      }

      await api.put(
        "/employee/profile",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
      alert(error.response?.data?.msg || "Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) {
      alert("Please fix the validation errors before changing your password.");
      return;
    }

    const token = Cookies.get("token");
    if (!token) {
      alert("Unauthorized. Please log in.");
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);
      await api.put(
        "/employee/profile",
        {
          password: profileForm.password,
          newPassword: passwordForm.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Password changed successfully!");
      setPasswordForm({
        email: passwordForm.email,
        newPassword: "",
        confirmPassword: ""
      });
      setProfileForm({ ...profileForm, password: "" });
      setErrors({});
    } catch (error) {
      console.error("Password change failed:", error);
      alert(error.response?.data?.msg || "Failed to change password.");
    } finally {
      setSubmitting(false);
    }
  };

  // Date restriction helpers
  const getMaxDOB = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 16);
    return date.toISOString().split('T')[0];
  };

  const getMaxStartDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMinEndDate = () => {
    if (profileForm.internshipStartDate) {
      const startDate = new Date(profileForm.internshipStartDate);
      startDate.setDate(startDate.getDate() + 1);
      return startDate.toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md relative mt-10">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-light"
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
              className="absolute bottom-0 right-0 bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
              title="Edit"
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
                reader.onload = (ev) => {
                  setAvatar(ev.target.result);
                  handleAvatarUpload(file);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">
          {activeForm === "profile" ? "Edit Profile" : "Change Password"}
        </h2>
      </div>

      {activeForm === "profile" ? (
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onBlur={handleFormBlur}
          onSubmit={handleProfileSubmit}
        >
          {/* ... (profile form fields remain the same as previous version) ... */}
          {[
            { id: "firstName", label: "First Name", type: "text", required: true },
            { id: "lastName", label: "Last Name", type: "text", required: true },
            { id: "email", label: "Email", type: "email", required: true },
            { id: "contact", label: "Contact Number", type: "text", required: true },
            { id: "dob", label: "Date of Birth", type: "date", required: true },
            { id: "nic", label: "NIC", type: "text", required: true },
            { id: "internshipStartDate", label: "Internship Start", type: "date", required: true },
            { id: "internshipEndDate", label: "Internship End", type: "date", required: true },
            { id: "university", label: "University", type: "text", required: true },
            { id: "addressLine1", label: "Address Line 1", type: "text", required: true },
            { id: "addressLine2", label: "Address Line 2", type: "text", required: false },
          ].map(({ id, label, type, required }) => (
            <div key={id} className="space-y-1">
              <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <input
                id={id}
                type={type}
                value={profileForm[id]}
                readOnly={editableField !== id}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors[id] ? 'border-red-500' : 'border-gray-300'
                } ${editableField !== id ? 'bg-gray-50 cursor-pointer' : 'bg-white'}`}
                onClick={() => handleInputClick(id)}
                onChange={handleProfileChange}
                {...(id === "dob" && { max: getMaxDOB() })}
                {...(id === "internshipStartDate" && { max: getMaxStartDate() })}
                {...(id === "internshipEndDate" && { min: getMinEndDate() })}
              />
              {errors[id] && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠</span>
                  {errors[id]}
                </p>
              )}
            </div>
          ))}

          {/* Role, Team, and Job Role dropdowns remain the same */}
          {isAdmin && (
            <div className="space-y-1">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                value={profileForm.role}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                onChange={handleProfileChange}
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
                <option value="employee">Employee</option>
              </select>
            </div>
          )}

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
              Current Password (for verification) <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              value={profileForm.password}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              onChange={handleProfileChange}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span>⚠</span>
                {errors.password}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {getPasswordRequirementsText()}
            </p>
          </div>

          <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <form
          className="grid grid-cols-1 gap-6"
          onSubmit={handlePasswordSubmit}
        >
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={passwordForm.email}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              onChange={handlePasswordChange}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span>⚠</span>
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
              Current Password <span className="text-red-500">*</span>
            </label>
            <input
              id="currentPassword"
              type="password"
              value={profileForm.password}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.currentPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              onChange={(e) => {
                setProfileForm({ ...profileForm, password: e.target.value });
                if (errors.currentPassword) {
                  setErrors(prev => ({ ...prev, currentPassword: null }));
                }
              }}
              required
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span>⚠</span>
                {errors.currentPassword}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password <span className="text-red-500">*</span>
            </label>
            <input
              id="newPassword"
              type="password"
              value={passwordForm.newPassword}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.newPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              onChange={handlePasswordChange}
              required
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span>⚠</span>
                {errors.newPassword}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              onChange={handlePasswordChange}
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span>⚠</span>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Password requirements display */}
          <div className="bg-blue-50 p-3 rounded-md">
            <h4 className="font-medium text-blue-800 mb-2">Password Requirements:</h4>
            <p className="text-sm text-blue-700">{getPasswordRequirementsText()}</p>
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ProfileEdit;