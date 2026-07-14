import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../Redux/slices/authSlice";
import { clearCart } from "../Redux/slices/cartSlice";
import MyOrdersPage from "./MyOrdersPage";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-comic-cream font-body">
      <div className="flex-grow container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {/* Left section - Profile Card */}
          <div className="w-full md:w-1/3 lg:w-1/4 comic-panel p-6 animate-slide-right">
            <div className="text-center mb-4">
              <div className="text-5xl mb-3 animate-float">🦸</div>
              <h1 className="comic-heading text-2xl md:text-3xl mb-2 text-comic-dark">
                {user?.name || "User"}
              </h1>
              <p className="text-base text-gray-600 font-body">
                {user?.email || ""}
              </p>
            </div>
            <div className="border-t-2 border-dashed border-comic-dark/20 pt-4 mt-4">
              <button
                onClick={handleLogout}
                className="comic-btn-danger w-full py-2 px-4 font-comic"
              >
                🚪 Logout
              </button>
            </div>
          </div>

          {/* Right section - Orders */}
          <div className="w-full md:w-2/3 lg:w-3/4 animate-slide-up">
            <MyOrdersPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
