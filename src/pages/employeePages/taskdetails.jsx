import { useContext, useRef, useState } from "react";
import { MainContext } from "../../context/MainContext";
import {
  FaUpload,
  FaClipboardList,
  FaCalendarAlt,
  FaFilePdf,
  FaExternalLinkAlt,
} from "react-icons/fa";
import TaskIMG from "../../assets/taskimage.jpg";
import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");

const TaskDetail = () => {
  const { selectedTask, date } = useContext(MainContext);
  const fileInputRef = useRef(null);
  const fileUrl = selectedTask.assignFile?.replace(/\\/g, "/");

  const [submitData, setSubmitData] = useState({
    id: selectedTask._id,
    satrus: "Completed",
    submitDate: date,
    submitFile: "",
    submitFilePath: "",
    file: null,
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Progress":
        return "bg-yellow-100 text-yellow-800 font-semibold";
      case "Assigned":
        return "bg-blue-100 text-blue-800 font-semibold";
      default:
        return "bg-gray-100 text-gray-800 font-semibold";
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file" && files?.[0]) {
      setSubmitData({
        ...submitData,
        file: files[0],
        submitFile: files[0].name,
      });
    } else {
      setSubmitData({
        ...submitData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("id", submitData.id);
    form.append("status", submitData.satrus);
    form.append("submitDate", submitData.submitDate);
    form.append("submitFilePath", submitData.submitFilePath);
    form.append("submitFile", submitData.submitFile);
    if (submitData.file) {
      form.append("file", submitData.file);
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/employee/task/submit_tasks",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Task submitted successfully!",response);
      

      setSubmitData({
        submitFilePath: "",
        submitFile: "",
        file: null,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.msg || error.message || "Failed to submit task";
      alert(errMsg);
    }
  };

  
  const handleAccept = async (id, status) => {
    try {
      await axios.put(
       `http://localhost:5000/api/employee/task/accept_tasks?id=${id}&status=${status}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Task submitted successfully!");
     
    } catch (error) {
      console.error(`Failed to update status:`, error);
    }
  };

  return (
    <div className="px-4 sm:px-6 py-6 bg-gray-100 w-full">
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full max-w-5xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="bg-black text-white p-2 rounded-md mr-3">
            <FaClipboardList size={20} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">Task Details</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full">
            <img
              src={TaskIMG}
              alt="Task"
              className="w-full h-64 sm:h-80 object-cover rounded-md mb-4"
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
              <h3 className="text-xl sm:text-2xl font-bold text-black">
                {selectedTask.name}
              </h3>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 sm:px-10 rounded-lg transition"
              onClick={() => handleAccept(selectedTask._id, "Progress")}
              >
                Accept
              </button>
            </div>

            <div className="text-black mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2 text-gray-700" />
                {new Date(selectedTask.deadline).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full ${getStatusColor(
                    selectedTask.status
                  )}`}
                >
                  {selectedTask.status}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:gap-10 w-full justify-end text-2xl py-5">
              {selectedTask.assignFilePath && (
                <a
                  href={selectedTask.assignFilePath}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaExternalLinkAlt className="flex items-center gap-2 text-xl text-blue-500 hover:text-blue-600" />
                </a>
              )}

              {selectedTask.assignFile && (
                <a
                  href={`http://localhost:5000/${fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  <FaFilePdf className="text-xl text-red-500 hover:text-red-600" />
                </a>
              )}
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed break-all">
              {selectedTask.description}
            </p>

            <h3 className="text-gray-700 font-medium text-2xl my-10">
              Upload Complete Task
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Upload File Link
                </label>
                <input
                  name="submitFilePath"
                  value={submitData.submitFilePath}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Attachment (PDF)
                </label>
                <input
                  type="file"
                  name="file"
                  ref={fileInputRef}
                  onChange={handleChange}
                  accept=".pdf"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition"
                />
              </div>

              <div className="mt-10 flex w-full justify-end">
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 sm:px-10 sm:py-3 rounded-lg transition">
                  Submit Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
