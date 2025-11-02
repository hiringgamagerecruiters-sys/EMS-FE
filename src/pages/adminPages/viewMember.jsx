import React, { useState } from 'react'
import WorkMemeber from './workMemeber';
import AllMembers from './allMembers';

function ViewMember() {
     const [activeTab, setActiveTab] = useState('workMember');
  return (
   <div className='h-full py-4 px-16 sticky top-15 z-10'>
    <h2 className="text-3xl font-bold text-center mb-8 text-teal-700" >Manage All Employee Section</h2>
      <div className='grid grid-cols-2 gap-3 mb-4 '>
        <button 
          onClick={() => setActiveTab('workMember')}  
          className={`rounded-xl py-3 px-4 shadow-lg transition-all duration-300
            ${activeTab === 'workMember' 
              ? 'bg-gray-300 text-black shadow-sm' 
              : 'bg-[#0A96A6] text-white hover:bg-[#02454C]'}`}
        >
          <span className='text-sm md:text-base'>Work Memebers</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('allMember')}  
          className={`rounded-xl py-3 px-4 shadow-lg transition-all duration-300
            ${activeTab === 'allMember' 
              ? 'bg-gray-300 text-black shadow-sm' 
              : 'bg-[#0A96A6] text-white hover:bg-[#02454C]'}`}
        >
          <span className='text-sm md:text-base'>All Memebers</span>
        </button>
        
 
      </div>
      <div className='bg-white rounded-xl shadow-xl p-2 md:p-2 min-h-[80vh]'>
        {activeTab === 'workMember' && <WorkMemeber />}
        {activeTab === 'allMember' && <AllMembers />}
    
        
       
      </div>
    </div>
  );
  
}

export default ViewMember
