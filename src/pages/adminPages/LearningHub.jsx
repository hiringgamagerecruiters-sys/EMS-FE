import React, { useState, useRef, useEffect } from "react";
import { FiPlus, FiTrash2, FiUpload, FiEdit, FiX } from "react-icons/fi";
import axios from "axios";
import Cookies from "js-cookie";

const LearnHub = () => {
  const [formData, setFormData] = useState({
    courseTitle: "",
    courseDescription: "",
    requirements: [""],
    learn: [""],
    courseImage: null,
  });
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  
  const fileInputRef = useRef(null);

  // Fetch all courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(
        "http://localhost:5000/api/admin/courses",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      alert("Failed to fetch courses");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleArrayChange = (index, field, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData({ ...formData, [field]: updatedArray });
  };

  const handleAddField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const handleRemoveField = (field, index) => {
    const filteredArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: filteredArray });
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const resetForm = () => {
    setFormData({
      courseTitle: "",
      courseDescription: "",
      requirements: [""],
      learn: [""],
      courseImage: null,
    });
    setEditingCourse(null);
    setIsEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("courseTitle", formData.courseTitle);
    data.append("courseDescription", formData.courseDescription);

    formData.requirements.forEach(req => {
      if (req.trim()) data.append("requirements", req);
    });
    
    formData.learn.forEach(item => {
      if (item.trim()) data.append("learn", item);
    });

    if (formData.courseImage) {
      data.append("courseImage", formData.courseImage);
    }

    try {
      const token = Cookies.get('token');
      let response;
      
      if (isEditMode && editingCourse) {
        // Update existing course
        response = await axios.put(
          `http://localhost:5000/api/admin/course/${editingCourse._id}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`
            }
          }
        );
        alert("Course updated successfully!");
      } else {
        // Create new course
        response = await axios.post(
          "http://localhost:5000/api/admin/course",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`
            }
          }
        );
        alert("Course created successfully!");
      }
      
      console.log("Course saved:", response.data);
      resetForm();
      fetchCourses(); // Refresh the course list
    } catch (error) {
      console.error("Full error:", {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setIsEditMode(true);
    setFormData({
      courseTitle: course.courseTitle,
      courseDescription: course.courseDescription,
      requirements: [...course.requirements],
      learn: [...course.learn],
      courseImage: null, // We don't set the image as we'll use the existing one unless changed
    });
    // Scroll to form
    document.getElementById("course-form").scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const token = Cookies.get('token');
      await axios.delete(
        `http://localhost:5000/api/admin/course/${courseToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Course deleted successfully!");
      fetchCourses(); // Refresh the course list
    } catch (error) {
      console.error("Error deleting course:", error);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setShowDeleteConfirm(false);
      setCourseToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setCourseToDelete(null);
  };

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Sticky Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 py-4 px-6">
        <h2 className="text-3xl font-bold text-center text-teal-700">
          {isEditMode ? "Edit Course" : "Create New Course"}
        </h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Image Upload Section */}
            <div className="lg:w-1/2 w-full">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <input
                  type="file"
                  name="courseImage"
                  onChange={handleChange}
                  accept="image/*"
                  className="hidden"
                  id="courseImage"
                  ref={fileInputRef}
                />
                <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                  {formData.courseImage ? (
                    <img
                      src={URL.createObjectURL(formData.courseImage)}
                      alt="Course Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : editingCourse && editingCourse.courseImage ? (
                    <img
                      src={`http://localhost:5000/${editingCourse.courseImage}`}
                      alt="Course Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <FiUpload className="mx-auto text-3xl text-gray-400 mb-2" />
                      <p className="text-gray-500 text-sm">
                        Upload Course Image
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Recommended size: 1280x720px
                      </p>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="mt-4 w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition duration-200 flex items-center justify-center gap-2"
                >
                  <FiUpload />
                  {formData.courseImage || (editingCourse && editingCourse.courseImage) 
                    ? "Change Image" 
                    : "Upload Image"}
                </button>
                
                {isEditMode && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-4 w-full py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition duration-200 flex items-center justify-center gap-2"
                  >
                    <FiX />
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:w-2/3 w-full">
              <form
                id="course-form"
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                {/* Title */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Course Title
                  </label>
                  <input
                    type="text"
                    name="courseTitle"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition duration-200"
                    value={formData.courseTitle}
                    onChange={handleChange}
                    placeholder="e.g., UI/UX Design Principles"
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Course Description
                  </label>
                  <textarea
                    name="courseDescription"
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition duration-200"
                    value={formData.courseDescription}
                    onChange={handleChange}
                    placeholder="Describe what this course is about..."
                    required
                  />
                </div>

                {/* Requirements */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Requirements
                  </label>
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        name={`requirements-${index}`}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition duration-200"
                        placeholder={`Requirement ${index + 1}`}
                        value={req}
                        onChange={(e) =>
                          handleArrayChange(index, "requirements", e.target.value)
                        }
                        required
                      />
                      {formData.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveField("requirements", index)}
                          className="px-3 text-red-500 hover:text-red-700 transition"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddField("requirements")}
                    className="mt-2 flex items-center gap-1 text-teal-600 hover:text-teal-800 transition"
                  >
                    <FiPlus size={16} />
                    Add Requirement
                  </button>
                </div>

                {/* Learning Points */}
                <div className="mb-8">
                  <label className="block text-gray-700 font-medium mb-2">
                    What Students Will Learn
                  </label>
                  {formData.learn.map((learn, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        name={`learn-${index}`}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition duration-200"
                        placeholder={`Learning point ${index + 1}`}
                        value={learn}
                        onChange={(e) =>
                          handleArrayChange(index, "learn", e.target.value)
                        }
                        required
                      />
                      {formData.learn.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveField("learn", index)}
                          className="px-3 text-red-500 hover:text-red-700 transition"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddField("learn")}
                    className="mt-2 flex items-center gap-1 text-teal-600 hover:text-teal-800 transition"
                  >
                    <FiPlus size={16} />
                    Add Learning Point
                  </button>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-md transition duration-200"
                  >
                    {isEditMode ? "Update Course" : "Create Course"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Course List Section */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-teal-700 mb-6">Existing Courses</h3>
            
            {courses.length === 0 ? (
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <p className="text-gray-500">No courses found. Create your first course above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                  <div key={course._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="h-48 overflow-hidden">
                      {course.courseImage ? (
                        <img 
                          src={`http://localhost:5000/${course.courseImage}`} 
                          alt={course.courseTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-lg mb-2 line-clamp-1">{course.courseTitle}</h4>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.courseDescription}</p>
                      
                      <div className="flex justify-between">
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2"
                        >
                          <FiEdit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(course)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2"
                        >
                          <FiTrash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-red-600 mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete the course "{courseToDelete.courseTitle}"? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnHub;