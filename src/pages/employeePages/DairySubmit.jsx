import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import api from "../../utils/api";
import {
  FiUploadCloud,
  FiCalendar,
  FiUser,
  FiFileText,
  FiArrowLeft,
  FiLink,
  FiTrash,
  FiEdit,
  FiX,
  FiDownload
} from "react-icons/fi";

function DairySubmit() {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    file: null,
    filePathLink: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  });

  const [userId, setUserId] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replies] = useState([]);
  const [previousDiaries, setPreviousDiaries] = useState([]);
  const [editingDiary, setEditingDiary] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    file: null,
    filePathLink: "",
    date: "",
  });

  // Allowed file types
  const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.txt'];

  const fetchPreviousDiaries = async () => {
    try {
      const id = Cookies.get("id");
      const token = Cookies.get("token");
      const response = await api.get(
        `/employee/diaries/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        const sortedDiaries = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setPreviousDiaries(sortedDiaries);
      }
    } catch (error) {
      console.error("Error fetching diaries:", error);
    }
  };

  const handleDeleteDiary = async (id) => {
    const token = Cookies.get("token");
    try {
      if (!token) {
        Swal.fire("Error", "Please log in first.", "error");
        return;
      }
      const response = await Swal.fire({
        title: "Deleting Diary",
        text: "Are you sure you want to delete this diary?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
      });

      if (response.isConfirmed) {
        await api.delete(
          `/employee/diaries/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPreviousDiaries((prev) =>
          prev.filter((diary) => diary._id !== id)
        );
        Swal.fire("Deleted!", "Your diary has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting diary:", error);
      Swal.fire("Error", "Failed to delete diary. Please try again.", "error");
    }
  };

  // BUG020: Edit diary function
  const handleEditDiary = (diary) => {
    setEditingDiary(diary._id);
    setEditFormData({
      name: diary.name || "",
      description: diary.description || "",
      file: null, // Reset file for new upload
      filePathLink: diary.filePathLink || "",
      date: diary.date ? diary.date.split('T')[0] : new Date().toISOString().split("T")[0],
    });
  };

  const handleCancelEdit = () => {
    setEditingDiary(null);
    setEditFormData({
      name: "",
      description: "",
      file: null,
      filePathLink: "",
      date: "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: files ? files[0] : value,
    });
  };

  const handleEditSubmit = async (diaryId) => {
    if (!editFormData.name || !editFormData.description) {
      Swal.fire("Error", "Please fill in all required fields.", "error");
      return;
    }

    // BUG019: Validate date for edit
    const today = new Date().toISOString().split("T")[0];
    if (editFormData.date > today) {
      Swal.fire("Error", "Cannot submit diary for future dates.", "error");
      return;
    }

    try {
      const token = Cookies.get("token");
      const data = new FormData();
      data.append("name", editFormData.name);
      data.append("description", editFormData.description);
      data.append("date", editFormData.date);
      
      if (editFormData.file) {
        data.append("file", editFormData.file);
      }
      if (editFormData.filePathLink) {
        data.append("filePathLink", editFormData.filePathLink);
      }

      await api.put(
        `/employee/diaries/${diaryId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire("Success!", "Diary updated successfully.", "success");
      setEditingDiary(null);
      fetchPreviousDiaries();
    } catch (error) {
      console.error("Error updating diary:", error);
      Swal.fire("Error", "Failed to update diary. Please try again.", "error");
    }
  };

  // BUG018: Remove uploaded file
  const handleRemoveFile = () => {
    setFormData({
      ...formData,
      file: null,
    });
    const fileInput = document.getElementById("fileUpload");
    if (fileInput) fileInput.value = null;
  };

  const handleRemoveEditFile = () => {
    setEditFormData({
      ...editFormData,
      file: null,
    });
  };

  // BUG017: Validate file type
  const validateFileType = (file) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Invalid File Type",
        text: `Please upload only these file types: ${ALLOWED_FILE_EXTENSIONS.join(', ')}`,
      });
      return false;
    }
    return true;
  };

  useEffect(() => {
    const id = Cookies.get("id");
    setUserId(id);
    setFormData((prevData) => ({
      ...prevData,
      id: id,
    }));

    if (id) {
      fetchPreviousDiaries();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "file" && files && files[0]) {
      // BUG017: Validate file type before setting
      if (!validateFileType(files[0])) {
        return;
      }
    }
    
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      // BUG017: Validate file type before setting
      if (!validateFileType(file)) {
        return;
      }
      setFormData({
        ...formData,
        file: file,
        filePathLink: "",
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // BUG019: Validate date - cannot be future date
    const today = new Date().toISOString().split("T")[0];
    if (formData.date > today) {
      Swal.fire("Error", "Cannot submit diary for future dates.", "error");
      setIsSubmitting(false);
      return;
    }

    if (!formData.file && !formData.filePathLink) {
      Swal.fire("Error", "Please upload a file or provide a file link.", "error");
      setIsSubmitting(false);
      return;
    }

    if (formData.file && formData.filePathLink) {
      Swal.fire(
        "Error",
        "Please provide either a file upload OR a file link, not both.",
        "error"
      );
      setIsSubmitting(false);
      return;
    }

    if (formData.file && formData.file.size > 5 * 1024 * 1024) {
      Swal.fire("Error", "File size should be under 5MB", "error");
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    data.append("id", formData.id);
    data.append("name", formData.name);
    data.append("description", formData.description);
    if (formData.file) {
      data.append("file", formData.file);
    }
    data.append("date", formData.date);
    data.append("time", formData.time);
    if (formData.filePathLink) {
      data.append("filePathLink", formData.filePathLink);
    }

    try {
      const token = Cookies.get("token");
      if (!token) {
        Swal.fire("Error", "Please log in first.", "error");
        setIsSubmitting(false);
        return;
      }

      const response = await api.post(
        "/employee/diary",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Your diary has been successfully submitted.",
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "View Replies",
          cancelButtonText: "Close",
          customClass: {
            confirmButton:
              "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg",
            cancelButton:
              "bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg",
          },
          buttonsStyling: false,
        }).then((result) => {
          if (result.isConfirmed) {
            setShowForm(false);
          }
        });

        setFormData({
          id: userId || "",
          name: "",
          description: "",
          file: null,
          filePathLink: "",
          date: new Date().toISOString().split("T")[0],
          time: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        });

        const fileInput = document.getElementById("fileUpload");
        if (fileInput) fileInput.value = null;
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.response?.data?.message || "An error occurred!",
      });
    } finally {
      setIsSubmitting(false);
    }

    await fetchPreviousDiaries();
  };

  // BUG021: Handle file download/view
  const handleFileAccess = (diary) => {
    if (diary.filePathLink) {
      window.open(diary.filePathLink, '_blank');
    } else if (diary.file) {
      // If file is stored in the system, you would typically have a download endpoint
      // For now, we'll show a message
      Swal.fire({
        title: "File Access",
        text: "This file is stored in the system. Please contact administrator for access.",
        icon: "info"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-left ml-15 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Intern Diary</h1>
          <div className="flex items-center justify-left gap-2 text-lg text-gray-600">
            <FiCalendar className="text-blue-500" />
            <span>
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="overflow-hidden flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3 bg-white rounded-xl shadow-md overflow-hidden">
            {showForm ? (
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="id"
                        required
                        disabled
                        value={formData.id}
                        onChange={handleChange}
                        className="block font-bold text-blue-800 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your ID"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                      <FiFileText className="text-gray-400" />
                    </div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe your diary entry..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File Upload <span className="text-gray-500">(or provide a link below)</span>
                  </label>
                  <div
                    className={`mt-1 border-2 border-dashed ${
                      formData.file ? "border-green-300 bg-green-50" : "border-gray-300"
                    } rounded-lg p-6 text-center cursor-pointer transition-colors relative`}
                    onDrop={handleFileDrop}
                    onDragOver={handleDragOver}
                    onClick={() => document.getElementById("fileUpload").click()}
                  >
                    <input
                      type="file"
                      name="file"
                      id="fileUpload"
                      onChange={handleChange}
                      className="hidden"
                      accept={ALLOWED_FILE_TYPES.join(',')}
                    />
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FiUploadCloud className="text-3xl text-blue-500" />
                      <p className="text-sm text-gray-600">
                        {formData.file ? (
                          <span className="font-medium text-green-600">{formData.file.name}</span>
                        ) : (
                          <>
                            <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                          </>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        Supported files: {ALLOWED_FILE_EXTENSIONS.join(', ')} (Max 5MB)
                      </p>
                    </div>
                    {/* BUG018: Remove file button */}
                    {formData.file && (
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1"
                      >
                        <FiX size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-center text-gray-500 font-medium">OR</div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File Link <span className="text-gray-500">(if not uploading a file)</span>
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLink className="text-gray-400" />
                    </div>
                    <input
                      type="url"
                      name="filePathLink"
                      value={formData.filePathLink}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/file.pdf"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date <span className="text-gray-500">(cannot be future date)</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        max={new Date().toISOString().split("T")[0]} // BUG019: Prevent future dates
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <div className="relative rounded-md shadow-sm bg-gray-100">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <p className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-700">
                        {formData.time}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Replies</h2>
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiArrowLeft className="mr-2" />
                    Back to Form
                  </button>
                </div>

                {replies.length > 0 ? (
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Message
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {replies.map((reply, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {reply.date} {reply.time && `at ${reply.time}`}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {reply.message}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                      <svg
                        className="h-full w-full"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7v4m0 0v4m0-4h4m-4 0H4"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">
                      No replies yet.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:w-1/3 bg-white rounded-xl shadow-md overflow-hidden p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Previous Diaries</h2>
            {previousDiaries.length > 0 ? (
              previousDiaries.map((diary) => (
                <div
                  key={diary._id}
                  className="border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow relative"
                >
                  {editingDiary === diary._id ? (
                    // Edit Form
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={editFormData.name}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={editFormData.description}
                          onChange={handleEditChange}
                          rows="3"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={editFormData.date}
                          onChange={handleEditChange}
                          max={new Date().toISOString().split("T")[0]}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Update File
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center relative">
                          <input
                            type="file"
                            name="file"
                            onChange={handleEditChange}
                            className="hidden"
                            id={`edit-file-${diary._id}`}
                            accept={ALLOWED_FILE_TYPES.join(',')}
                          />
                          <div 
                            className="cursor-pointer"
                            onClick={() => document.getElementById(`edit-file-${diary._id}`).click()}
                          >
                            <FiUploadCloud className="text-xl text-blue-500 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                              {editFormData.file ? (
                                <span className="font-medium text-green-600">{editFormData.file.name}</span>
                              ) : (
                                "Click to upload new file"
                              )}
                            </p>
                          </div>
                          {editFormData.file && (
                            <button
                              type="button"
                              onClick={handleRemoveEditFile}
                              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                              <FiX size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleEditSubmit(diary._id)}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <>
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm text-blue-600 font-semibold">
                          {diary.date
                            ? (() => {
                                const d = new Date(diary.date);
                                const year = d.getFullYear();
                                const month = String(d.getMonth() + 1).padStart(2, "0");
                                const day = String(d.getDate()).padStart(2, "0");
                                return `${year}-${month}-${day}${diary.time ? `, ${diary.time}` : ""}`;
                              })()
                            : "N/A"}
                        </p>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            diary.diaryStatus === 'Replied' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {diary.diaryStatus || 'Pending'}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-2">{diary.description}</p>
                      
                      {/* Show reply details if status is Replied */}
                      {diary.diaryStatus === 'Replied' && diary.replyMessage && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm font-medium text-gray-900 mb-1">Reply:</p>
                          <p className="text-sm text-gray-700">{diary.replyMessage}</p>
                          {diary.replyDate && (
                            <p className="text-xs text-gray-500 mt-1">
                              Replied on: {new Date(diary.replyDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}

                      {/* BUG021: Show file access for both link and uploaded files */}
                      {(diary.filePathLink || diary.file) && (
                        <button
                          onClick={() => handleFileAccess(diary)}
                          className="inline-flex items-center text-blue-600 hover:underline text-sm mt-2"
                        >
                          <FiDownload className="mr-1" />
                          {diary.filePathLink ? "File Link" : "Download File"}
                        </button>
                      )}
                      
                      <div className="flex justify-between items-center mt-3">
                        <button
                          onClick={() => handleEditDiary(diary)}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <FiEdit className="mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDiary(diary._id)}
                          className="inline-flex items-center text-red-500 hover:text-red-700 text-sm"
                        >
                          <FiTrash className="mr-1" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No previous diaries found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DairySubmit;