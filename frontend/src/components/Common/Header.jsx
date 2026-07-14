import React from "react";
import Topbar from "../Layout/Topbar";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className="border-b-3 border-comic-dark bg-comic-cream sticky top-0 z-40">
      {/*topbar*/}
      <Topbar />
      {/*navbar*/}
      <Navbar />
      {/*Cart Drawer*/}
    </header>
  );
};

export default Header;
