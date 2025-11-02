import { useEffect } from "react";
import { FaFilePdf, FaTrash, FaCheck } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");

const TaskCard = ({ task, onDelete, onSubmit, refreshTasks , showSubmitButton }) => {
  const getStatusColor = () => {
    switch (task.status) {
      case "Assigned":
        return "bg-blue-100 text-blue-700";
      case "Progress":
        return "bg-yellow-100 text-yellow-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleStatusChange = async (e) => {
  const status = e.target.value;
  const cardId = task._id;

  try {
    await axios.put(
      `http://localhost:5000/api/admin/update_tasks_staus?id=${cardId}&status=${status}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (typeof refreshTasks === "function") {
      refreshTasks(); // ✅ trigger refresh
    }

  } catch (error) {
    console.error("Failed to update status:", error);
  }
};
  const handleSubmit = () => {
    onSubmit(task.id);
    handleStatusChange();
  };

  useEffect(() => {
    console.log("Todat Task is :");
  }, []);

  return (
    <div className="bg-sky-50/50 rounded-2xl shadow-md p-5 flex flex-col justify-between transition-all hover:shadow-lg hover:bg-sky-100 break-all">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">{task.name}</h2>
        <p className="text-sm text-gray-600 mt-1 mb-4">{task.description}</p>

        <div className="text-sm text-gray-700 space-y-1">
          <div>
            <span className="font-medium">Assigned to:</span>{" "}
            <span className="text-blue-600 font-serif">
              {task.assignedTo?.email}
            </span>
          </div>
          <div>
            <span className="font-medium">Name:</span>{" "}
            <span className="text-blue-600 font-serif">
              {task.assignedTo?.firstName} {task.assignedTo?.lastName}
            </span>
          </div>
          <div>
            <span className="font-medium">Deadline:</span> {new Date(task.deadline).toISOString().split("T")[0]}
            <br />
            <span className="font-medium">Submitted Day:</span>{" "}
            {task.submittedDay}
          </div>
        </div>

        <div className="mt-4">
          <a
            href={task.filePath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-red-500 hover:text-red-700 text-sm"
          >
            <FaFilePdf /> View File
          </a>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor()}`}
          >
            {task.status}
          </span>

          <select
            onChange={handleStatusChange}
            value={task.status}
            className="ml-2 border border-sky-500 rounded px-2 py-1 text-sm"
          >
            <option className="text-blue-700 font-semibold" value="Assigned">
              Assigned
            </option>
            <option
              className="text-yellow-700 font-semibold"
              value="Progress"
            >
              In Progress
            </option>
            <option className="text-green-700 font-semibold" value="Completed">
              Completed
            </option>
          </select>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {showSubmitButton && (
              <button
                onClick={handleSubmit}
                className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded flex items-center"
              >
                <FaCheck className="mr-1" /> Submit
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(task.id)}
                className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded flex items-center"
              >
                <FaTrash className="mr-1" /> Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
