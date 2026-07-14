import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative bg-comic-cream font-body">
      {/* mobile toggle button */}
      <div className="flex md:hidden p-4 bg-comic-dark text-comic-yellow z-20 border-b-3 border-comic-yellow">
        <button onClick={toggleSidebar} className="text-2xl hover:text-white transition-colors">
          <FaBars size={24} />
        </button>
        <h1 className="ml-4 text-xl font-comic">⚡ Admin Dashboard</h1>
      </div>

      <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* main content */}
      <div className="flex-1 p-6 bg-comic-cream overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
