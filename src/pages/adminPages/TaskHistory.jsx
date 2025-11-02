import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { FaFilePdf } from "react-icons/fa";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";

function TaskHistory() {
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTaskHistory();
  }, [navigate]);

  const fetchTaskHistory = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/admin/tasks_history",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching task history:", err);
        if (err.response?.status === 401) {
          navigate("/login");
        }
        setLoading(false);
      }
    };

  const handleDelete = async (id) => {
      try {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        });
  
        if (result.isConfirmed) {
          const token = Cookies.get("token");
          await axios.delete(`http://localhost:5000/api/admin/remove_task`, {
            params: { id },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          Swal.fire("Deleted!", "The diary has been deleted.", "success");
          fetchTaskHistory();
        }
      } catch (error) {
        console.error("Failed to delete diary:", error);
        Swal.fire("Error!", "Failed to delete diary", "error");
      }
    };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredTasks = tasks.filter((task) => {
    const nameMatch = task.name?.toLowerCase().includes(searchQuery);
    const emailMatch = task.assignedTo?.email?.toLowerCase().includes(searchQuery);
    const dateString = task.submitDate
      ? `${new Date(task.submitDate).getFullYear()}-${String(
          new Date(task.submitDate).getMonth() + 1
        ).padStart(2, "0")}-${String(new Date(task.submitDate).getDate()).padStart(2, "0")}`
      : "";
    const dateMatch = dateString.includes(searchQuery);
    return nameMatch || emailMatch || dateMatch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Task History ({filteredTasks.length})</h2>

      {/* 🔍 Search Bar */}
      <div className="flex w-full justify-end">
        <div className="w-md mb-4">
          <input
            type="text"
            placeholder="Search by task name, email or date (YYYY-MM-DD)"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
      </div>


      {filteredTasks.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Task Name</th>
                <th className="py-3 px-4 text-left">Assigned To</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Submitted Date</th>
                <th className="py-3 px-4 text-left">File</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{task.name}</td>
                  <td className="py-3 px-4">
                    {task.assignedTo?.email || "Unassigned"}
                  </td>
                  <td className="py-3 px-4 max-w-[200px]">
                    <div
                      className="truncate"
                      title={task.description || "No description provided"}
                    >
                      {task.description || "No description provided"}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {task.submitDate
                      ? `${new Date(task.submitDate).getFullYear()}-${String(
                          new Date(task.submitDate).getMonth() + 1
                        ).padStart(2, "0")}-${String(
                          new Date(task.submitDate).getDate()
                        ).padStart(2, "0")}`
                      : "N/A"}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-10 pl-5">
                      {task.submitFilePath && (
                        <a
                          href={task.submitFilePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open external link"
                          className="text-xl text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          <FaExternalLinkAlt />
                        </a>
                      )}
                      {task.submitFile && (
                        <a
                          href={`http://localhost:5000/${task.submitFile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open PDF file"
                          className="text-xl text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FaFilePdf />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="pl-5">
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete task"
                    >
                      <MdDeleteForever size={25} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 text-lg">No matching task history found.</p>
        </div>
      )}
    </div>
  );
}

export default TaskHistory;
