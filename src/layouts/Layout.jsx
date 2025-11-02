import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNavbar from '../components/ui/webNavBar/TopNavbar';

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed TopNavbar */}
      <TopNavbar />
      
      {/* Scrollable Content Area */}
      <main className="flex-grow pt-16"> {/* Add padding-top to account for fixed navbar */}
        <Outlet />
      </main>
      
      {/* Footer would go here */}
    </div>
  );
}

export default Layout;