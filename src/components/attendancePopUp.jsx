import React from 'react';

function AttendancedPopUp({ onCancel, handleMakeAttendance }) {
  const now = new Date();

  const formattedDate = now.toLocaleDateString('en-GB');
  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="bg-gradient-to-br from-white/50 via-white/10 to-white/50 border border-white/30 rounded-3xl shadow-xl backdrop-blur-xl p-8 max-w-md mx-auto text-white hover:bg-sky-100">
      <h2 className="text-3xl text-gray-500 font-semibold text-center mb-6 tracking-wide">Mark Attendance</h2>

      <div className="space-y-4 text-lg">
        <p className='text-gray-500 '><span className="font-bold text-gray-500 ">Date:</span> {formattedDate}</p>
        <p className='text-gray-500 '><span className="font-bold text-gray-500 ">Time:</span> {formattedTime}</p>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xl font-medium text-gray-500 ">Attendance Status</p>
        <div className="bg-gradient-to-r from-green-300 via-green-400 to-green-500 hover:from-indigo-500 hover:to-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg backdrop-blur-md transition-all duration-300 border border-white/20">
          Attended
        </div>
      </div>

      <p className="text-center mt-6 leading-relaxed text-gray-500 ">
        Are you sure you want <br />
        to mark your attendance for today?
      </p>

      <div className="flex justify-center gap-4 mt-8">
  <button
    onClick={handleMakeAttendance}
    className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-500 hover:from-indigo-500 hover:to-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg backdrop-blur-md transition-all duration-300 border border-white/20"
  >
   Confirm
  </button>
  <button
    onClick={onCancel}
    className="bg-gradient-to-r from-red-500 via-red-600 to-pink-500 hover:from-pink-500 hover:to-red-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg backdrop-blur-md transition-all duration-300 border border-white/20"
  >
    Cancel
  </button>
</div>
    </div>
  );
}

export default AttendancedPopUp;
