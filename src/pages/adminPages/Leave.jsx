import React, { useState } from 'react';
import LeaveHistoryTable from './LeaveHistory';
import LeaveRequestsTable from './LeaveRequests';
import OnLeaveTable from './OnLeave';

function LeaveManagement() {
  const [activeTab, setActiveTab] = useState('');

  return (
    <div className='h-full py-6 px-16'>
      {/* Navigation Tabs */}
      <div className='grid grid-cols-3 gap-3 mb-2'>
        <button 
          onClick={() => setActiveTab('onLeave')}  
          className={`rounded-xl py-3 px-4 shadow-lg transition-all duration-300
            ${activeTab === 'onLeave' 
              ? 'bg-gray-300 text-black shadow-sm' 
              : 'bg-[#0A96A6] text-white hover:bg-[#02454C]'}`}
        >
          <span className='text-sm md:text-base'>On Leave</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('requests')}  
          className={`rounded-xl py-3 px-4 shadow-lg transition-all duration-300
            ${activeTab === 'requests' 
              ? 'bg-gray-300 text-black shadow-sm' 
              : 'bg-[#0A96A6] text-white hover:bg-[#02454C]'}`}
        >
          <span className='text-sm md:text-base'>Leave Requests</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('history')}  
          className={`rounded-xl py-3 px-4 shadow-lg transition-all duration-300
            ${activeTab === 'history' 
              ? 'bg-gray-300 text-black shadow-sm' 
              : 'bg-[#0A96A6] text-white hover:bg-[#02454C]'}`}
        >
          <span className='text-sm md:text-base'>Leave History</span>
        </button>
      </div>

      {/* Tab Content - Static with fixed height */}
      <div className='bg-white rounded-xl shadow-xl p-2 md:p-2 h-[80vh] overflow-hidden'>
        {activeTab === 'onLeave' && (
          <div className='h-full overflow-hidden'>
            <OnLeaveTable />
          </div>
        )}
        {activeTab === 'requests' && (
          <div className='h-full overflow-hidden'>
            <LeaveRequestsTable />
          </div>
        )}
        {activeTab === 'history' && (
          <div className='h-full overflow-hidden'>
            <LeaveHistoryTable />
          </div>
        )}
        
        {/* Default Dashboard View */}
        {!activeTab && (
          <div className='flex flex-col md:flex-row items-center justify-between h-full'>
            <div className='md:w-1/2 mb-6 md:mb-0'>
              <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
                Manage All <span className='text-[#0A96A6]'>Leave Applications</span>
              </h2>
              <p className='text-xl text-gray-600 mb-6'>
                A relaxed employee is a performing employee.
              </p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setActiveTab('onLeave')}
                  className='bg-[#0A96A6] hover:bg-[#02454C] text-white py-3 px-6 rounded-lg shadow-md transition-colors duration-300'
                >
                  View On Leave
                </button>
                <button 
                  onClick={() => setActiveTab('requests')}
                  className='bg-[#0A96A6] hover:bg-[#02454C] text-white py-3 px-6 rounded-lg shadow-md transition-colors duration-300'
                >
                  View Requests
                </button>
              </div>
            </div>
            
            <div className='md:w-1/2 flex justify-center mt-10'>
              <img 
                src="/src/assets/Leave.png" 
                alt="Leave Management Illustration" 
                className='max-w-full h-auto rounded-lg'
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaveManagement;