import React from 'react';
import { FaArrowAltCircleDown } from "react-icons/fa";

function LeaveHistory() {
  const leaveData = [
    {
      name: "abebe gemechu ",
      duration: "5 days",
      state: "Approved",
      endDate: "28/04/2022",
      type: "Sick",
      reason: "Personal",
    },
    {
      name: "Jane Smith",
      duration: "2 days",
      state: "Pending",
      endDate: "30/04/2022",
      type: "Casual",
      reason: "Personal",
    },
    {
      name: "Ali Khan",
      duration: "3 days",
      state: "Rejected",
      endDate: "28/06/2022",
      type: "Emergency",
      reason: "Personal",
    },
  ];

  return (
    <>
      <div className='px-3 py-2 md:mt-4'>
        <div className='bg-sky-100 flex flex-col gap-4 w-full px-3 py-8 rounded-2xl shadow-xl shadow-slate-500 text-white'>
          {/* Header */}
          <div className='flex  items-center justify-between'>
            <div className='text-black font-bold text-2xl md:ml-3 '>Leave History</div>
           <div className='flex flex-row items-center justify-center text-center bg-green-300 md:px-16   px-4 py-2 text-white font-bold rounded-2xl gap-2 md:mr-2'>
             <button className=''>Export</button>
              <div> <FaArrowAltCircleDown /></div>
           </div>
          </div>

          {/* Table Header */}
          <div className='bg-slate-500  grid grid-cols-7 gap-2 px-4 py-3 rounded-2xl font-semibold text-center items-center text-[10px] md:text-xl'>
            <div>Name(s)</div>
            <div>Duration</div>
            <div>Status</div>
            <div>End Date</div>
            <div>Type</div>
            <div>Reason</div>
            <div>Actions</div>
          </div>

          {/* Table Rows */}
          {leaveData.map((leave, index) => (
            <div
              key={index}
              className={`grid grid-cols-7 gap-2 px-6 py-6  rounded-xl items-center text-black text-center text-[10px] md:text-xl ${
                index % 2 === 0 ? 'bg-sky-200' : 'bg-white'
              }`}
            >
              <div>{leave.name}</div>
              <div>{leave.duration}</div>
              <div>{leave.state}</div>
              <div>{leave.endDate}</div>
              <div>{leave.type}</div>
              <div>{leave.reason}</div>
              <div className='flex flex-row items-center justify-center text-center  bg-sky-800   text-white  font-medium px-8 py-2  md:px-2 md:py-2 rounded-xl gap-1 md:gap-2'>
                <button className='sm:text-xs md:text-[15px]'>Actions</button>
                 <div> <FaArrowAltCircleDown /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default LeaveHistory;
