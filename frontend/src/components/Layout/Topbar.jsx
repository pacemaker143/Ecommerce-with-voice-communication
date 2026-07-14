import React from "react";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io5";
import { RiTwitterXLine } from "react-icons/ri";

const Topbar = () => {
  return (
    <div className="bg-comic-dark text-comic-yellow">
      <div className="container mx-auto flex justify-between items-center h-10 px-4">

        {/* Social Icons (hidden on mobile) */}
        <div className="hidden md:flex items-center space-x-4">
          <a href="#" className="hover:text-comic-cyan transition-colors">
            <TbBrandMeta className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-comic-cyan transition-colors">
            <IoLogoInstagram className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-comic-cyan transition-colors">
            <RiTwitterXLine className="h-4 w-4" />
          </a>
        </div>

        {/* Center Text (always visible) */}
        <div className="text-sm text-center flex-1 md:flex-none font-comic tracking-wider animate-pulse">
          <span>⚡ WE SHIP WORLDWIDE - Fast & Reliable ⚡</span>
        </div>

        {/* Phone Number (hidden on mobile) */}
        <div className="hidden md:block text-sm font-body">
          <a href="tel:+1234567890" className="hover:text-comic-cyan transition-colors">
            📞 +1 234 567 890
          </a>
        </div>

      </div>
    </div>
  );
};


export default Topbar;
