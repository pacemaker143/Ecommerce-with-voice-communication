import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaClipboardList,
  FaUsers,
  FaStore,
  FaSignOutAlt,
} from "react-icons/fa";
import { logout } from "../../Redux/slices/authSlice";
import { clearCart } from "../../Redux/slices/cartSlice";

const navItems = [
  { label: "Dashboard", to: "/admin", icon: FaTachometerAlt },
  { label: "Users", to: "/admin/users", icon: FaUsers },
  { label: "Products", to: "/admin/products", icon: FaBoxOpen },
  { label: "Orders", to: "/admin/orders", icon: FaClipboardList },
  { label: "Shop", to: "/", icon: FaStore },
];

const AdminSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-30 top-0 left-0 h-full w-64 bg-comic-dark text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:translate-x-0 flex flex-col justify-between border-r-4 border-comic-yellow`}
      >
        {/* Top Section */}
        <div>
          <div className="p-4 font-comic text-xl text-comic-yellow border-b-3 border-comic-yellow/40 flex items-center gap-2">
            ⚡ Admin Panel
          </div>

          <nav className="p-4">
            <ul>
              {navItems.map((item) => (
                <li key={item.label} className="mb-3">
                  <NavLink
                    to={item.to}
                    end={item.to === "/admin"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 py-2.5 px-4 rounded-lg font-comic tracking-wide transition-all ${
                        isActive
                          ? "bg-comic-yellow text-comic-dark border-2 border-comic-dark shadow-comic"
                          : "hover:bg-comic-blue/40 hover:translate-x-1 border-2 border-transparent"
                      }`
                    }
                    onClick={onClose}
                  >
                    <item.icon className="text-lg" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t-3 border-comic-yellow/40">
          <button
            onClick={handleLogout}
            className="comic-btn-danger w-full py-2.5 px-4 flex items-center justify-center gap-2 font-comic"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
