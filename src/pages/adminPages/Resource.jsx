import React, { useState, useEffect } from "react";
import { Eye, Search, Plus, X, User, Mail, Briefcase, Users, Check, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Resource = () => {
  const navigate = useNavigate();
  const [resource, setResource] = useState([]);
  const [resourceItems, setResourceItems] = useState([]);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateModalJob, setShowCreateModalJob] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newResource, setNewResource] = useState({ name: "" });
  const [teams, setTeams] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [jobRoleError, setJobRoleError] = useState("");
  const [setTeamError] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const validateJobRoleName = (name) => {
    if (/^\d+$/.test(name)) {
      return "Job role name cannot contain only numbers";
    }
    if (!name.trim()) {
      return "Job role name is required";
    }
    if (name.trim().length < 2) {
      return "Job role name must be at least 2 characters long";
    }
    return "";
  };

  const validateTeamName = (name) => {
    if (/^\d+$/.test(name)) {
      return "Team name cannot contain only numbers";
    }
    if (!name.trim()) {
      return "Team name is required";
    }
    if (name.trim().length < 2) {
      return "Team name must be at least 2 characters long";
    }
    return "";
  };

  const handleCreateJobRole = async (e) => {
    if (e) e.preventDefault();

    const error = validateJobRoleName(newResource.name);
    if (error) {
      setJobRoleError(error);
      return;
    }

    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Unauthorized. Please log in.");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/admin/job-roles",
        { jobRoleName: newResource.name.trim() },
        { 
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: (status) => status < 500
        }
      );

      if (response.status === 201) {
        alert("Job role created successfully!");
        const newJobRole = {
          _id: response.data.jobRole._id || Date.now().toString(),
          jobRoleName: newResource.name.trim()
        };
        setJobRoles(prevJobRoles => [...prevJobRoles, newJobRole]);
        setNewResource({ name: "" });
        setJobRoleError("");
        setShowCreateModalJob(false);
      }
    } catch (err) {
      console.error("Job role creation failed:", err);
      if (err.response?.status === 400) {
        setJobRoleError(err.response.data.message || "Invalid job role name format");
      } else if (err.response?.status === 401) {
        alert("Unauthorized. Please log in.");
        navigate("/login");
      } else {
        setJobRoleError("Failed to create job role. Please try again.");
      }
    }
  };

  const handleUpdateJobRole = async (jobRoleId, newName) => {
    const error = validateJobRoleName(newName);
    if (error) {
      alert(error);
      return false;
    }

    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Unauthorized. Please log in.");
        navigate("/login");
        return false;
      }

      const response = await axios.put(
        `http://localhost:5000/api/admin/job-roles/${jobRoleId}`,
        { jobRoleName: newName },
        { 
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: (status) => status < 500
        }
      );

      if (response.status === 200) {
        alert("Job role updated successfully!");
        setJobRoles(prevJobRoles => 
          prevJobRoles.map(role => 
            role._id === jobRoleId 
              ? { ...role, jobRoleName: newName }
              : role
          )
        );
        return true;
      }
    } catch (err) {
      console.error("Job role update failed:", err);
      if (err.response?.status === 400) {
        alert(err.response.data.message || "Invalid job role name format");
      } else if (err.response?.status === 401) {
        alert("Unauthorized. Please log in.");
        navigate("/login");
      } else {
        alert("Failed to update job role. Please try again.");
      }
      return false;
    }
  };

  const handleDeleteJobRole = async (jobRoleId) => {
    if (!window.confirm("Are you sure you want to delete this job role?")) {
      return;
    }

    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Unauthorized. Please log in.");
        navigate("/login");
        return;
      }

      const response = await axios.delete(
        `http://localhost:5000/api/admin/job-roles/${jobRoleId}`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: (status) => status < 500
        }
      );

      if (response.status === 200) {
        alert("Job role deleted successfully!");
        setJobRoles(prevJobRoles => 
          prevJobRoles.filter(role => role._id !== jobRoleId)
        );
      }
    } catch (err) {
      console.error("Job role deletion failed:", err);
      if (err.response?.status === 400) {
        alert(err.response.data.message || "Cannot delete job role");
      } else if (err.response?.status === 401) {
        alert("Unauthorized. Please log in.");
        navigate("/login");
      } else {
        alert("Failed to delete job role. Please try again.");
      }
    }
  };

  const handleCreateTeam = async (e) => {
    if (e) e.preventDefault();

    const error = validateTeamName(newResource.name);
    if (error) {
      setTeamError(error);
      return;
    }

    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Unauthorized. Please log in.");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/admin/teams",
        { teamName: newResource.name.trim() },
        { 
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: (status) => status < 500
        }
      );

      if (response.status === 201) {
        alert("Team created successfully!");
        const newTeam = {
          _id: response.data.team._id || Date.now().toString(),
          teamName: newResource.name.trim()
        };
        setTeams(prevTeams => [...prevTeams, newTeam]);
        setNewResource({ name: "" });
        setTeamError("");
      }
    } catch (err) {
      console.error("Team creation failed:", err);
      if (err.response?.status === 400) {
        setTeamError(err.response.data.message || "Invalid team name format");
      } else if (err.response?.status === 401) {
        alert("Unauthorized. Please log in.");
        navigate("/login");
      } else {
        setTeamError("Failed to create team. Please try again.");
      }
    }
  };

  const handleUpdateTeam = async (teamId, newName) => {
    const error = validateTeamName(newName);
    if (error) {
      alert(error);
      return false;
    }

    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Unauthorized. Please log in.");
        navigate("/login");
        return false;
      }

      const response = await axios.put(
        `http://localhost:5000/api/admin/teams/${teamId}`,
        { teamName: newName },
        { 
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: (status) => status < 500
        }
      );

      if (response.status === 200) {
        alert("Team updated successfully!");
        setTeams(prevTeams => 
          prevTeams.map(team => 
            team._id === teamId 
              ? { ...team, teamName: newName }
              : team
          )
        );
        return true;
      }
    } catch (err) {
      console.error("Team update failed:", err);
      if (err.response?.status === 400) {
        alert(err.response.data.message || "Invalid team name format");
      } else if (err.response?.status === 401) {
        alert("Unauthorized. Please log in.");
        navigate("/login");
      } else {
        alert("Failed to update team. Please try again.");
      }
      return false;
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm("Are you sure you want to delete this team?")) {
      return;
    }

    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Unauthorized. Please log in.");
        navigate("/login");
        return;
      }

      const response = await axios.delete(
        `http://localhost:5000/api/admin/teams/${teamId}`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: (status) => status < 500
        }
      );

      if (response.status === 200) {
        alert("Team deleted successfully!");
        setTeams(prevTeams => 
          prevTeams.filter(team => team._id !== teamId)
        );
      }
    } catch (err) {
      console.error("Team deletion failed:", err);
      if (err.response?.status === 400) {
        alert(err.response.data.message || "Cannot delete team");
      } else if (err.response?.status === 401) {
        alert("Unauthorized. Please log in.");
        navigate("/login");
      } else {
        alert("Failed to delete team. Please try again.");
      }
    }
  };

  useEffect(() => {
    const fetchTeams = async () => {
      if (!showCreateModal) return;

      try {
        const token = Cookies.get("token");
        const response = await axios.get("http://localhost:5000/api/admin/teams", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeams(response.data);
      } catch (err) {
        console.error("Failed to load teams:", err);
      }
    };

    fetchTeams();
  }, [showCreateModal]);

  useEffect(() => {
    const fetchJobRoles = async () => {
      if (!showCreateModalJob) return;

      try {
        const token = Cookies.get("token");
        const response = await axios.get("http://localhost:5000/api/admin/job-roles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobRoles(response.data);
      } catch (err) {
        console.error("Failed to load job roles:", err);
      }
    };

    fetchJobRoles();
  }, [showCreateModalJob]);

  const handleViewTeam = async (resource) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Unauthorized. Please log in.");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/admin/resourceItems/${resource.position}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResourceItems(response.data);
      setSelectedResource(resource);
      setShowTeamModal(true);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching resource items:", err);
      alert("Failed to load team data. Please try again.");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    const fetchResourceData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          alert("Unauthorized. Please log in.");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/admin/learning_resource",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setResource(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Resource fetch error:", err);
        alert("Failed to load resource data. Please try again.");
        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchResourceData();
  }, [navigate]);

  // Filter resources based on search
  const filteredResources = resource.filter(
    (res) => res.position && res.position.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResources.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-medium">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-gray-800">Resources</h1>
            <span className="ml-3 bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
              {resource.length}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400 w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <button 
              onClick={() => {
                setShowCreateModalJob(true);
                setJobRoleError("");
              }}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Job Role</span>
            </button>
            
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Team</span>
            </button>
          </div>
        </div>
        
        {/* Desktop Table - Non-scrollable */}
        <div className="hidden md:block bg-white rounded-xl shadow-md">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Members
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((res, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {res.position || "Uncategorized"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {res.count} members
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button 
                        onClick={() => handleViewTeam(res)}
                        className="text-blue-500 hover:text-blue-700 active:text-blue-200 transition-colors p-2 rounded-full hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-2">No resources found</div>
                <div className="text-gray-400 text-sm">Try adjusting your search query</div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredResources.length > 0 && (
            <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredResources.length)} of {filteredResources.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === pageNum
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                  }`}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Mobile Cards - Non-scrollable */}
        <div className="md:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentItems.map((res, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-blue-600">
                        {res.position || "Uncategorized"}
                      </h3>
                      <span className="text-xs text-gray-500">ID: {indexOfFirstItem + index + 1}</span>
                    </div>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {res.count} members
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleViewTeam(res)}
                    className="text-blue-500 hover:text-blue-700 active:text-blue-200 transition-colors p-1"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {filteredResources.length === 0 && (
              <div className="col-span-full text-center py-8 bg-white rounded-xl shadow-md">
                <div className="text-gray-500 mb-2">No resources found</div>
                <div className="text-gray-400 text-sm">Try adjusting your search query</div>
              </div>
            )}
          </div>

          {/* Mobile Pagination */}
          {filteredResources.length > 0 && (
            <div className="bg-white p-4 rounded-xl shadow-md mt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                    }`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rest of your modals remain the same */}
      {/* Enhanced Create Job Role Modal */}
      {showCreateModalJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Create New Job Role</h2>
              </div>
              <p className="text-gray-500 text-sm ml-13">Add a new job role to your organization</p>

              <button
                onClick={() => {
                  setShowCreateModalJob(false);
                  setJobRoleError("");
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-xl hover:bg-gray-100 group"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-2">
                    Job Role Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      value={newResource.name}
                      onChange={(e) => {
                        setNewResource({ name: e.target.value });
                        if (jobRoleError) setJobRoleError("");
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newResource.name.trim()) {
                          handleCreateJobRole(e);
                        }
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 text-gray-900 font-medium ${
                        jobRoleError ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:ring-blue-100"
                      }`}
                      placeholder="e.g., Software Engineer"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Plus className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  {jobRoleError && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {jobRoleError}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModalJob(false);
                      setJobRoleError("");
                    }}
                    className="px-6 py-2.5 border-2 border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateJobRole}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                    disabled={!newResource.name.trim()}
                  >
                    <Check className="w-4 h-4" />
                    Create Job Role
                  </button>
                </div>
              </div>
            </div>

            {/* Available Job Role List */}
            {jobRoles.length > 0 && (
              <div className="px-6 pb-6 pt-0">
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-gray-500" />
                    <h3 className="text-sm font-semibold text-gray-800">
                      Available Job Roles ({jobRoles.length})
                    </h3>
                  </div>
                  
                  <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
                    {jobRoles.map((role, index) => (
                      <div
                        key={role._id}
                        className="group flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-sm"
                        style={{ 
                          animationDelay: `${index * 50}ms`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                            <Users className="w-4 h-4 text-gray-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-800">
                            {role.jobRoleName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => {
                              const newName = prompt("Enter new job role name:", role.jobRoleName);
                              if (newName && newName !== role.jobRoleName) {
                                handleUpdateJobRole(role._id, newName);
                              }
                            }}
                            className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded"
                            title="Edit job role"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteJobRole(role._id)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                            title="Delete job role"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Create New Team</h2>
              </div>
              <p className="text-gray-500 text-sm ml-13">Add a new team to your organization</p>
              
              <button 
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-xl hover:bg-gray-100 group"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-2">
                    Team Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      value={newResource.name}
                      onChange={(e) => setNewResource({ name: e.target.value })}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newResource.name.trim()) {
                          handleCreateTeam(e);
                        }
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 text-gray-900 font-medium"
                      placeholder="e.g., Development Team"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Plus className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-2.5 border-2 border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateTeam}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                    disabled={!newResource.name.trim()}
                  >
                    <Check className="w-4 h-4" />
                    Create Team
                  </button>
                </div>
              </div>
            </div>

            {/* Available Teams List */}
            {teams.length > 0 && (
              <div className="px-6 pb-6 pt-0">
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-gray-500" />
                    <h3 className="text-sm font-semibold text-gray-800">
                      Available Teams ({teams.length})
                    </h3>
                  </div>
                  
                  <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
                    {teams.map((team, index) => (
                      <div
                        key={team._id}
                        className="group flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-sm"
                        style={{ 
                          animationDelay: `${index * 50}ms`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                            <Users className="w-4 h-4 text-gray-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-800">
                            {team.teamName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => {
                              const newName = prompt("Enter new team name:", team.teamName);
                              if (newName && newName !== team.teamName) {
                                handleUpdateTeam(team._id, newName);
                              }
                            }}
                            className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded"
                            title="Edit team"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteTeam(team._id)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                            title="Delete team"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Team Members Modal */}
      {showTeamModal && selectedResource && (
        <div className="fixed inset-0 bg-sky-200/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
            {/* Header section: sticky */}
            <div className="p-6 flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full mr-2">
                    {selectedResource.position || "Uncategorized"}
                  </span>
                  Team Members
                </h2>
                <p className="text-gray-600 mt-1">{selectedResource.count} members</p>
              </div>
              <button 
                onClick={() => setShowTeamModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-rose-300 active:bg-amber-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Info Cards */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="w-8 h-8 text-blue-500" />
                    <div>
                      <div className="text-sm text-gray-500">Total Members</div>
                      <div className="text-lg font-semibold">{selectedResource.count}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-8 h-8 text-green-500" />
                    <div>
                      <div className="text-sm text-gray-500">Position</div>
                      <div className="text-lg font-semibold">{selectedResource.position}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-purple-500" />
                    <div>
                      <div className="text-sm text-gray-500">Team Status</div>
                      <div className="text-lg font-semibold text-green-600">Active</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Section */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">User ID</th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Contact</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {resourceItems.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{user._id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-blue-600">{`${user.firstName} ${user.lastName}`}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a href={`mailto:${user.email}`} className="text-blue-500 hover:underline">
                            {user.email}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.contactNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {resourceItems.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-2">No team members found</div>
                    <div className="text-gray-400 text-sm">This position has no assigned members</div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-100 text-right sticky bottom-0">
              <button
                onClick={() => setShowTeamModal(false)}
                className="bg-red-200 hover:bg-red-400 hover:text-red-100 text-red-800 px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resource;