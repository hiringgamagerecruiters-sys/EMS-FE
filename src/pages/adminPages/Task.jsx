import React, { useState } from 'react';
import { MdAssignment } from 'react-icons/md';
import TaskHistory from './TaskHistory';
import TaskForm from './TaskForm';
import TodayTasks from './TodayTasks';
import TaskCreated from './TaskCreated';

function TaskPage() {
  const [activeTab, setActiveTab] = useState('today');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTaskCreated = () => {
    // Refresh all task lists when a new task is created
    setRefreshTrigger(prev => prev + 1);
    setShowCreateForm(false);
    setActiveTab('today');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-16 py-6">
      <div className="max-w-8xl mx-auto">
        <div className="sticky top-15 z-10 bg-white p-4 rounded-lg shadow mb-4">
          <div className="flex justify-between items-center mb-4 w-full">
            <h1 className="text-3xl font-bold text-gray-800">Task Management</h1>
            <button
              onClick={() => {
                setShowCreateForm(!showCreateForm);
                setActiveTab(showCreateForm ? 'today' : 'create');
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center transition-colors"
            >
              <MdAssignment className="mr-2" />
              {showCreateForm ? 'Hide Form' : 'Create Task'}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setActiveTab('today');
                setShowCreateForm(false);
              }}
              className={`px-4 py-2 rounded transition-colors ${
                activeTab === 'today' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Today's Tasks
            </button>
            <button
              onClick={() => {
                setActiveTab('created');
                setShowCreateForm(false);
              }}
              className={`px-4 py-2 rounded transition-colors ${
                activeTab === 'created' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Created Tasks
            </button>
            <button
              onClick={() => {
                setActiveTab('history');
                setShowCreateForm(false);
              }}
              className={`px-4 py-2 rounded transition-colors ${
                activeTab === 'history' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Task History
            </button>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          {showCreateForm && <TaskForm onTaskCreated={handleTaskCreated} />}
          {!showCreateForm && activeTab === 'today' && (
            <TodayTasks refreshTrigger={refreshTrigger} />
          )}
          {!showCreateForm && activeTab === 'created' && (
            <TaskCreated refreshTrigger={refreshTrigger} />
          )}
          {!showCreateForm && activeTab === 'history' && (
            <TaskHistory refreshTrigger={refreshTrigger} />
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskPage;