import React, { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { MdAssignment } from "react-icons/md";
import Swal from "sweetalert2";
import api from "../../utils/api";

const token = Cookies.get("token");

const CreateTaskForm = ({ onCreate = () => {} }) => {
  const fileInputRef = useRef(null);

  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    assignedTo: "",
    name: "",
    deadline: "",
    description: "",
    assignFilePath: "",
    file: null,
  });

  // ✅ Fetch active employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/admin/all_active_users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(res.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "file") {
      // ✅ Frontend PDF validation
      if (files.length > 0) {
        const file = files[0];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        if (fileExtension !== 'pdf') {
          Swal.fire("Error", "Only PDF files are allowed.", "error");
          e.target.value = ""; // Clear the file input
          setFormData(prev => ({ ...prev, file: null }));
          return;
        }

        // ✅ Check file size (optional: 5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          Swal.fire("Error", "File size must be less than 5MB.", "error");
          e.target.value = "";
          setFormData(prev => ({ ...prev, file: null }));
          return;
        }

        setFormData(prev => ({ ...prev, file }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      await api.post("/admin/create_tasks", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire("Success!", "Task created successfully", "success");

      setFormData({
        assignedTo: "",
        name: "",
        deadline: "",
        description: "",
        assignFilePath: "",
        file: null,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      onCreate();
    } catch (error) {
      console.error("Error creating task:", error);
      const msg = error.response?.data?.msg || "Failed to create task";
      Swal.fire("Error", msg, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ✅ Employee dropdown */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Assigned To (Employee)
        </label>
        <select
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">Select Employee </option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.firstName} {emp.lastName} ({emp.email})
            </option>
          ))}
        </select>
      </div>

      {[
        { label: "Task Name", name: "name", type: "text" },
      ].map(({ label, name, type }) => (
        <div key={name}>
          <label className="block text-gray-700 font-medium mb-1">
            {label}
          </label>
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      ))}

      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Deadline
        </label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          required
          min={new Date().toISOString().split("T")[0]}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>
           
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          File Path (URL)
        </label>
        <input
          type="text"
          name="assignFilePath"
          value={formData.assignFilePath}
          onChange={handleChange}
          placeholder="https://example.com/file.pdf"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Attachment (PDF Only)
        </label>
        <input
          type="file"
          name="file"
          ref={fileInputRef}
          onChange={handleChange}
          accept=".pdf"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition"
        />
        <p className="text-sm text-gray-500 mt-1">
          Only PDF files are accepted. Maximum file size: 5MB
        </p>
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-medium w-full"
      >
        <MdAssignment className="text-xl" /> Create Task
      </button>
    </form>
  );
};

export default CreateTaskForm;