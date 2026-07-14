import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  HiOutlineUser,
  HiBars3BottomRight,
  HiOutlineShoppingBag,
} from "react-icons/hi2"; // ✅ correct icon pack
import SearchBar from "./SearchBar";
import VoiceSearchBar from "./VoiceSearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { IoMdClose } from "react-icons/io";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = React.useState(false);

  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const cartItemCount = cart?.products?.length || 0;

  const toggleCartDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const toggleNavDrawer = () => {
    setNavDrawerOpen((prev) => !prev);
  };

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-3 sm:py-4 px-4 sm:px-6">
        {/* Left Logo */}
        <Link to="/" className="text-2xl sm:text-3xl font-comic text-comic-dark hover:text-comic-red transition-colors tracking-widest">
          🐰 RABBIT
        </Link>

        {/* Center Navigation */}
        <div className="hidden md:flex space-x-2">
          {[
            { to: "/collections/men", label: "Men" },
            { to: "/collections/women", label: "Women" },
            { to: "/collections/top-wear", label: "Top Wear" },
            { to: "/collections/bottom-wear", label: "Bottom Wear" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="font-comic text-sm uppercase px-3 py-1 border-2 border-transparent rounded-lg hover:border-comic-dark hover:bg-comic-yellow/30 hover:shadow-comic transition-all duration-200 text-comic-dark"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {user?.role === "admin" && (
            <Link to="/admin" className="comic-badge bg-comic-red text-white border-comic-dark hover:scale-110 transition-transform">Admin</Link>
          )}
          <Link to={user ? "/profile" : "/login"} className="hover:text-comic-cyan transition-colors hover:scale-110">
            <HiOutlineUser className="h-6 w-6 text-comic-dark" />
          </Link>

          <button
            onClick={toggleCartDrawer}
            className="relative hover:text-comic-cyan transition-all hover:scale-110"
          >
            <HiOutlineShoppingBag className="h-6 w-6 text-comic-dark" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-comic-red text-white text-xs font-comic rounded-full w-5 h-5 flex items-center justify-center border-2 border-comic-dark animate-bounce-slow">
                {cartItemCount}
              </span>
            )}
          </button>
          {/* search */}
          <div className="overflow-hidden">
            <VoiceSearchBar onToggleCart={toggleCartDrawer} />
          </div>

          {/* Mobile Menu */}
          <button
            onClick={toggleNavDrawer}
            className="block md:hidden hover:text-comic-red transition-colors"
          >
            <HiBars3BottomRight className="h-6 w-6 text-comic-dark" />
          </button>
        </div>
      </nav>
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />
      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-comic-cream shadow-comic-xl border-r-3 border-comic-dark transform transition-transform duration-300 z-50 ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer} className="hover:rotate-90 transition-transform">
            <IoMdClose className="h-6 w-6 text-comic-dark" />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-2xl font-comic text-comic-dark mb-4">🐰 Menu</h2>
          <nav className="space-y-3">
            {[
              { to: "/collections/men", label: "👔 Men" },
              { to: "/collections/women", label: "👗 Women" },
              { to: "/collections/top-wear", label: "👕 Top Wear" },
              { to: "/collections/bottom-wear", label: "👖 Bottom Wear" },
              { to: "/shopping-list", label: "📋 Shopping List" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={toggleNavDrawer}
                className="block font-comic text-lg text-comic-dark hover:text-comic-red hover:translate-x-2 transition-all py-2 border-b-2 border-comic-dark/10"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
