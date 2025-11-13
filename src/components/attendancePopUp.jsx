// src/components/attendancePopUp.jsx
import React from "react";
import { FiClock, FiCheck, FiX } from "react-icons/fi";

const AttendancedPopUp = ({ onCancel, handleMakeAttendance, isEarly, isLate }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiClock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Mark Attendance</h2>
              <p className="text-gray-500 text-sm">
                {isEarly ? "You're on time! 🎉" : 
                 isLate ? "You're marking late attendance" : 
                 "Confirm your attendance"}
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-xl hover:bg-gray-100"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiClock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">Current Time</p>
                  <p className="text-lg font-semibold text-blue-900">
                    {new Date().toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </p>
                </div>
              </div>
            </div>

            {isLate && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <FiClock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-800">Late Arrival</p>
                    <p className="text-sm text-amber-700">
                      This will be recorded as a late attendance.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Attendance Rules</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• <strong>On Time:</strong> 8:00 AM - 8:15 AM</li>
                <li>• <strong>Late:</strong> After 8:15 AM</li>
                <li>• Attendance can only be marked once per day</li>
                <li>• Available until 5:30 PM</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleMakeAttendance}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <FiCheck className="w-4 h-4" />
            Confirm Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendancedPopUp;