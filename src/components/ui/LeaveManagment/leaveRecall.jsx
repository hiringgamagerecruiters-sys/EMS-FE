import React from 'react';
import { FaArrowAltCircleDown } from "react-icons/fa";


function LeaveRecall() {
     const leaveApplication = [
    {
      name: "abebe gemechu ",
      duration: "5 days",
      startDate: "22/04/2022",
      endDate: "28/04/2022",
      type: "Casual",
      reason: "Personal",
    },
    {
      name: "Jane Smith",
      duration: "2 days",
      startDate: "22/04/2022",
      endDate: "30/04/2022",
      type: "Casual",
      reason: "Personal",
    },
    {
      name: "Ali Khan",
      duration: "3 days",
      startDate: "22/04/2022",
      endDate: "28/06/2022",
      type: "Casual",
      reason: "Personal",
    },
  ];
  return (
  
       <>
           <div className='px-3 py-2 md:mt-4'>
             <div className='bg-sky-100 flex flex-col gap-4 w-full px-3 py-8 rounded-2xl shadow-xl shadow-slate-500 text-white'>
               {/* Header */}
               <div className='flex  items-center justify-between'>
                 <div className='text-black font-bold text-2xl md:ml-3 '>Ongoing Leave Applications</div>
                
               </div>
     
               {/* Table Header */}
               <div className='bg-slate-500  grid grid-cols-7 gap-2 px-4 py-3 rounded-2xl font-semibold text-center items-center text-[10px] md:text-xl'>
                 <div>Name(s)</div>
                 <div>Duration</div>
                 <div>Start Date</div>
                 <div>End Date</div>
                 <div>Type</div>
                 <div>Reason</div>
                 <div>Actions</div>
               </div>
     
               {/* Table Rows */}
               {leaveApplication.map((leaveApp, index) => (
                 <div
                   key={index}
                   className={`grid grid-cols-7 gap-4 px-6 py-6  rounded-xl items-center text-black text-center text-[10px] md:text-xl ${
                     index % 2 === 0 ? 'bg-sky-200' : 'bg-white'
                   }`}
                 >
                   <div>{leaveApp.name}</div>
                   <div>{leaveApp.duration}</div>
                   <div>{leaveApp.startDate}</div>
                   <div>{leaveApp.endDate}</div>
                   <div>{leaveApp.type}</div>
                   <div>{leaveApp.reason}</div>
                   <div className='flex flex-row items-center justify-center text-center  bg-sky-800   text-white  text-[10px] px-8 py-2  md:px-2 md:py-2 rounded-xl gap-2'>
                     <button className='text-[10px] md:text-[15px]'>Recall</button>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         </>

  );
}

export default LeaveRecall;
