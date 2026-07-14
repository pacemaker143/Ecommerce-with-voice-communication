import React from "react";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-comic-cream font-body">
      {/* HEADER */}
      <Header />
      {/* MAIN CONTENT */}
      <main className="flex-grow">
        <Outlet />

      </main>
      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default UserLayout;
