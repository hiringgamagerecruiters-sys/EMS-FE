const TaskTable = ({ tasks, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left">Task Name</th>
            <th className="py-3 px-4 text-left">Assigned To</th>
            <th className="py-3 px-4 text-left">Description</th>
            <th className="py-3 px-4 text-left">Deadline</th>
            <th className="py-3 px-4 text-left">File</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-3 px-4">{task.name}</td>
              <td className="py-3 px-4">{task.assignedTo.email}</td>
              <td className="py-3 px-4">{task.description}</td>
              <td className="py-3 px-4">{task.deadline}</td>
              <td className="py-3 px-4">
                {task.filePath && (
                  <a href={task.filePath} target="_blank" rel="noopener noreferrer">
                    <FaFilePdf className="text-red-500" />
                  </a>
                )}
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  task.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                  task.status === 'InProgress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => onDelete(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable