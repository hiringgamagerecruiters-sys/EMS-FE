import React, { useState } from 'react'
import SubmitDiaries from './submitDiaries';
import SubmitDiariesHistory from './submitDiariesHistory';

function InternDailyDiaries() {
     const [activeTab, setActiveTab] = useState('workMember');
  return (
   <div className='h-full sticky z-10 px-10 py-2'>

    <div className='bg-white  sticky top-12 z-20 px-2 py-4 '>
      <h2 className="text-3xl font-bold text-center mb-4 text-teal-700" >Manage All submitted Daily Diaries </h2>
            <div className='grid grid-cols-2 gap-3 '>
        <button 
          onClick={() => setActiveTab('workMember')}  
          className={`rounded-xl py-3 px-4 shadow-lg transition-all duration-300
            ${activeTab === 'workMember' 
              ? 'bg-gray-300 text-black shadow-sm' 
              : 'bg-[#0A96A6] text-white hover:bg-[#02454C]'}`}
        >
          <span className='text-sm md:text-base'>Submitted Daily Diaries</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('allMember')}  
          className={`rounded-xl py-3 px-4 shadow-lg transition-all duration-300
            ${activeTab === 'allMember' 
              ? 'bg-gray-300 text-black shadow-sm' 
              : 'bg-[#0A96A6] text-white hover:bg-[#02454C]'}`}
        >
          <span className='text-sm md:text-base'>Daily Diaries History</span>
        </button>
        
 
      </div>
    </div>
    

      <div className='bg-white rounded-xl shadow-xl p-2 md:p-2 min-h-[80vh]'>
        {activeTab === 'workMember' && <SubmitDiaries />}
        {activeTab === 'allMember' && <SubmitDiariesHistory />}

      </div>
    </div>
  );
  
}

export default InternDailyDiaries;
