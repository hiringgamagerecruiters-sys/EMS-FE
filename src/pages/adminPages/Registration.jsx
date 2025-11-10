import React, { useState, useRef, useEffect } from "react";
import { UserPlus, Upload, X, Check, Eye, EyeOff, Users } from "lucide-react";
import api from "../../utils/api";

function Registration() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    nic: "",
    internStartDate: "",
    internEndDate: "",
    dob: "",
    role: "",
    jobRole: "",
    active: "true",
    password: "",
    university: "",
    team: "",
    addressLine1: "",
    addressLine2: "",
    profileImage: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teams, setTeams] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);

  // Fetch teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await api.get("/admin/teams");
        setTeams(response.data);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      }
    };
    fetchTeams();
  }, []);

  // Fetch job roles
  useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        const response = await api.get("/admin/job-roles");
        setJobRoles(response.data);
      } catch (error) {
        console.error("Failed to fetch job roles:", error);
      }
    };
    fetchJobRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    // Clear any previous messages
    setApiError("");
    setSuccessMessage("");

    if (name === "team") {
      const selectedTeam = teams.find((team) => team._id === value) || null;
      setFormData({ ...formData, team: selectedTeam });
    } else if (name === "jobRole") {
      const selectedJobRole = jobRoles.find((role) => role._id === value) || null;
      setFormData({ ...formData, jobRole: selectedJobRole });
    } else {
      setFormData({
        ...formData,
        [name]: type === "file" ? files[0] : value,
      });
    }

    // Clear error on input
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleToggleStatus = () => {
    setFormData({
      ...formData,
      active: formData.active === "true" ? "false" : "true",
    });
  };

  // Enhanced validation with date comparison and password strength
  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.contactNumber) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^[0-9]{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Invalid contact number (must be 10 digits)";
    }
    
    if (!formData.nic) newErrors.nic = "NIC is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.jobRole) newErrors.jobRole = "Job role is required";
    if (!formData.university) newErrors.university = "University is required";
    if (!formData.team) newErrors.team = "Team selection is required";
    if (!formData.addressLine1) newErrors.addressLine1 = "Address Line 1 is required";
    if (!formData.addressLine2) newErrors.addressLine2 = "Address Line 2 is required";

    // Date validations
    if (!formData.internStartDate) {
      newErrors.internStartDate = "Start date is required";
    }
    
    if (!formData.internEndDate) {
      newErrors.internEndDate = "End date is required";
    } else if (formData.internStartDate && formData.internEndDate) {
      const startDate = new Date(formData.internStartDate);
      const endDate = new Date(formData.internEndDate);
      
      if (endDate < startDate) {
        newErrors.internEndDate = "End date must be after start date";
      }
    }

    // Password validations
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long";
      } else if (formData.password.length > 20) {
        newErrors.password = "Password must be less than 20 characters";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
        newErrors.password = "Password must contain both uppercase and lowercase letters";
      } else if (!/(?=.*\d)/.test(formData.password)) {
        newErrors.password = "Password must contain at least one number";
      } else if (!/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(formData.password)) {
        newErrors.password = "Password must contain at least one special character";
      }
    }

    // Date of birth validation
    if (formData.dob) {
      const dob = new Date(formData.dob);
      const today = new Date();
      const minAgeDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
      
      if (dob > minAgeDate) {
        newErrors.dob = "Must be at least 16 years old";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setApiError("");
    setSuccessMessage("");
    
    if (!validateForm()) {
      setApiError("Please fix the validation errors above");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "jobRole" || key === "team") {
          data.append(key, formData[key]?._id || "");
        } else if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      const response = await api.post(
        "/auth/register",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      
      console.log("Registration successful:", response.data);
      setSuccessMessage("Intern successfully registered!");
      
      // Clear form after successful registration
      setTimeout(() => {
        handleClearForm();
      }, 2000);
      
    } catch (error) {
      console.error("Registration failed:", error);
      
      // Enhanced error handling with specific messages
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            if (data.message?.includes("email") || data.message?.includes("Email")) {
              errorMessage = "This email address is already registered. Please use a different email.";
            } else if (data.message?.includes("NIC") || data.message?.includes("nic")) {
              errorMessage = "This NIC number is already registered.";
            } else if (data.message) {
              errorMessage = data.message;
            } else {
              errorMessage = "Invalid data provided. Please check all fields.";
            }
            break;
          case 409:
            errorMessage = "This user already exists (email or NIC may be duplicate).";
            break;
          case 422:
            errorMessage = "Validation error. Please check all required fields.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            if (data.message) {
              errorMessage = data.message;
            }
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else {
        errorMessage = "An unexpected error occurred. Please try again.";
      }
      
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      nic: "",
      internStartDate: "",
      internEndDate: "",
      dob: "",
      role: "",
      jobRole: "",
      active: "true",
      password: "",
      university: "",
      team: "",
      addressLine1: "",
      addressLine2: "",
      profileImage: null,
    });
    setErrors({});
    setApiError("");
    setSuccessMessage("");
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!formData.password) return null;
    
    let strength = 0;
    if (formData.password.length >= 6) strength++;
    if (/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) strength++;
    if (/(?=.*\d)/.test(formData.password)) strength++;
    if (/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(formData.password)) strength++;
    
    const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];
    
    return (
      <div className="mt-2">
        <div className="flex space-x-1 mb-1">
          {[1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full ${
                index <= strength ? strengthColors[strength - 1] : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <p className={`text-xs ${
          strength <= 2 ? "text-red-600" : 
          strength === 3 ? "text-yellow-600" : 
          "text-green-600"
        }`}>
          Password strength: {strengthLabels[strength]}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 to-green-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-slate-800 flex items-center justify-center gap-3">
            <UserPlus className="text-teal-600" size={36} />
            Register New Intern
          </h2>
          <p className="text-slate-600 mt-2">Fill in the details to onboard a new intern.</p>
        </div>

        {/* Success and Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <div className="flex items-center">
              <Check className="text-green-500 mr-2" size={20} />
              {successMessage}
            </div>
          </div>
        )}

        {apiError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex items-center">
              <X className="text-red-500 mr-2" size={20} />
              {apiError}
            </div>
          </div>
        )}

        <form
          onSubmit={handleRegister}
          className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-200"
        >
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative">
              <input
                type="file"
                name="profileImage"
                onChange={handleChange}
                accept="image/*"
                className="hidden"
                id="profileImage"
                ref={fileInputRef}
              />
              <div className="w-32 h-32 bg-slate-100 rounded-full overflow-hidden border-4 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-teal-400 transition">
                {formData.profileImage ? (
                  <img
                    src={URL.createObjectURL(formData.profileImage)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="text-4xl text-slate-400" />
                )}
              </div>
              <button
                type="button"
                onClick={handleUploadClick}
                className="mt-3 px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 mx-auto transition-all duration-200 shadow-sm"
              >
                <Upload size={16} />
                {formData.profileImage ? "Change Photo" : "Upload Photo"}
              </button>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2 border-b pb-3">
                <Users size={20} className="text-teal-600" />
                Personal Information
              </h3>

              <div>
                <label className="block mb-2 text-slate-700 font-medium">First Name *</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition ${
                    errors.firstName ? "border-red-500" : "border-slate-300"
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block mb-2 text-slate-700 font-medium">Last Name *</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition ${
                    errors.lastName ? "border-red-500" : "border-slate-300"
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block mb-2 text-slate-700 font-medium">Email *</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition ${
                    errors.email ? "border-red-500" : "border-slate-300"
                  }`}
                  placeholder="Enter email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block mb-2 text-slate-700 font-medium">Date of Birth *</label>
                <input
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition ${
                    errors.dob ? "border-red-500" : "border-slate-300"
                  }`}
                />
                {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
              </div>

              <div>
                <label className="block mb-2 text-slate-700 font-medium">Address Line 1 *</label>
                <input
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition ${
                    errors.addressLine1 ? "border-red-500" : "border-slate-300"
                  }`}
                  placeholder="Enter street, city"
                />
                {errors.addressLine1 && <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>}
              </div>

              <div>
                <label className="block mb-2 text-slate-700 font-medium">Address Line 2 *</label>
                <input
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition ${
                    errors.addressLine2 ? "border-red-500" : "border-slate-300"
                  }`}
                  placeholder="Enter apartment, suite"
                />
                {errors.addressLine2 && <p className="text-red-500 text-sm mt-1">{errors.addressLine2}</p>}
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2 border-b pb-3">
                <Users size={20} className="text-teal-600" />
                Professional Information
              </h3>

              <div>
                <label className="block mb-2 text-slate-700 font-medium">Contact Number *</label>
                <input
                  name="contactNumber"
                  type="tel"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition ${
                    errors.contactNumber ? "border-red-500" : "border-slate-300"
                  }`}
                  placeholder="e.g. 0712345678"
                />
                {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}
              </div>

              <div>
                <label className="block mb-2 text-slate-700 font-medium">NIC Number *</label>
                <input
                  name="nic"
                  value={formData.nic}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition ${
                    errors.nic ? "border-red-500" : "border-slate-300"
                  }`}
                  placeholder="e.g. 987654321V"
                />
                {errors.nic && <p className="text-red-500 text-sm mt-1">{errors.nic}</p>}
              </div>

              <div>
                <label className="block mb-2 text-slate-700 font-medium">Team *</label>
                <select
                  name="team"
                  value={formData.team?._id || ""}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition ${
                    errors.team ? "border-red-500" : "border-slate-300"
                  }`}
                >
                  <option value="">Select Team</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.teamName}
                    </option>
                  ))}
                </select>
                {errors.team && <p className="text-red-500 text-sm mt-1">{errors.team}</p>}
              </div>

              <div>
                <label className="block mb-2 text-slate-700 font-medium">Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition ${
                    errors.role ? "border-red-500" : "border-slate-300"
                  }`}
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="employee">Employee</option>
                </select>
                {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
              </div>

              <div>
                <label className="block mb-2 text-slate-700 font-medium">Job Role *</label>
                <select
                  name="jobRole"
                  value={formData.jobRole?._id || ""}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition ${
                    errors.jobRole ? "border-red-500" : "border-slate-300"
                  }`}
                >
                  <option value="">Select Job Role</option>
                  {jobRoles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.jobRoleName}
                    </option>
                  ))}
                </select>
                {errors.jobRole && <p className="text-red-500 text-sm mt-1">{errors.jobRole}</p>}
              </div>

              <div>
                <label className="block mb-2 text-slate-700 font-medium">University *</label>
                <input
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition ${
                    errors.university ? "border-red-500" : "border-slate-300"
                  }`}
                  placeholder="Enter university name"
                />
                {errors.university && <p className="text-red-500 text-sm mt-1">{errors.university}</p>}
              </div>
            </div>

            {/* Internship Dates */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div>
                <label className="block mb-2 text-slate-700 font-medium">Internship Start Date *</label>
                <input
                  name="internStartDate"
                  type="date"
                  value={formData.internStartDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition ${
                    errors.internStartDate ? "border-red-500" : "border-slate-300"
                  }`}
                />
                {errors.internStartDate && <p className="text-red-500 text-sm mt-1">{errors.internStartDate}</p>}
              </div>

              <div>
                <label className="block mb-2 text-slate-700 font-medium">Internship End Date *</label>
                <input
                  name="internEndDate"
                  type="date"
                  value={formData.internEndDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition ${
                    errors.internEndDate ? "border-red-500" : "border-slate-300"
                  }`}
                />
                {errors.internEndDate && <p className="text-red-500 text-sm mt-1">{errors.internEndDate}</p>}
              </div>
            </div>

            {/* Password & Status */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block mb-2 text-slate-700 font-medium">Password *</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition pr-10 ${
                      errors.password ? "border-red-500" : "border-slate-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-teal-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                {getPasswordStrength()}
                <div className="text-xs text-gray-600 mt-1">
                  Password must be 6-20 characters with uppercase, lowercase, number, and special character.
                </div>
              </div>

              <div className="flex items-center justify-start md:justify-center gap-4 pt-8">
                <label className="text-slate-700 font-medium">Status</label>
                <button
                  type="button"
                  onClick={handleToggleStatus}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    formData.active === "true" ? "bg-teal-600" : "bg-red-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.active === "true" ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="font-medium text-slate-700">
                  {formData.active === "true" ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-10">
            <button
              type="button"
              onClick={handleClearForm}
              className="px-6 py-3 bg-slate-200 hover:bg-red-100 text-slate-800 font-medium rounded-lg flex items-center justify-center gap-2 transition duration-200"
            >
              <X size={18} />
              Clear Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition duration-200 shadow-md"
            >
              <UserPlus size={18} />
              {isSubmitting ? "Registering..." : "Register Intern"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registration;