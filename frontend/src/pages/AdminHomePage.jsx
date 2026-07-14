import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminOrders, fetchAdminProducts } from "../Redux/slices/adminSlice";

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const { orders, products, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminOrders());
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 font-body">
      <h1 className="comic-heading text-2xl sm:text-3xl text-comic-dark mb-6 inline-block transform -rotate-1">⚡ Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Revenue Card */}
        <div className="comic-panel p-6 bg-comic-green/10 animate-pop-in">
          <h2 className="font-comic text-lg text-comic-dark">💰 Revenue</h2>
          <p className="font-comic text-3xl text-comic-green mt-2">${totalRevenue.toFixed(2)}</p>
        </div>

        {/* Total Orders Card */}
        <div className="comic-panel p-6 bg-comic-cyan/10 animate-pop-in" style={{animationDelay:"0.1s"}}>
          <h2 className="font-comic text-lg text-comic-dark">📦 Total Orders</h2>
          <p className="font-comic text-3xl text-comic-cyan mt-2">{totalOrders}</p>
          <Link
            to="/admin/orders"
            className="text-comic-blue font-comic text-sm mt-2 inline-block hover:text-comic-red transition-colors"
          >
            Manage Orders →
          </Link>
        </div>

        {/* Total Products Card */}
        <div className="comic-panel p-6 bg-comic-pink/10 animate-pop-in" style={{animationDelay:"0.2s"}}>
          <h2 className="font-comic text-lg text-comic-dark">🏷️ Total Products</h2>
          <p className="font-comic text-3xl text-comic-pink mt-2">{totalProducts}</p>
            <Link
              to="/admin/products"
              className="text-comic-blue font-comic text-sm mt-2 inline-block hover:text-comic-red transition-colors"
            >
              Manage Products →
            </Link>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="comic-panel p-3 sm:p-4 mt-4 sm:mt-6">
        <h2 className="font-comic text-lg sm:text-xl text-comic-dark mb-4">📋 Recent Orders</h2>
        <div className="overflow-x-auto">
        <table className="w-full table-auto font-body text-sm">
          <thead>
            <tr className="bg-comic-yellow border-b-3 border-comic-dark">
              <th className="px-2 sm:px-4 py-2 text-left font-comic text-comic-dark text-xs sm:text-sm">Order ID</th>
              <th className="px-2 sm:px-4 py-2 text-left font-comic text-comic-dark text-xs sm:text-sm hidden sm:table-cell">Customer</th>
              <th className="px-2 sm:px-4 py-2 text-left font-comic text-comic-dark text-xs sm:text-sm">Total</th>
              <th className="px-2 sm:px-4 py-2 text-left font-comic text-comic-dark text-xs sm:text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="px-4 py-2 text-center font-comic">⏳ Loading...</td></tr>
            ) : recentOrders.length === 0 ? (
              <tr><td colSpan="4" className="px-4 py-2 text-center font-comic">No orders yet</td></tr>
            ) : (
              recentOrders.map((order) => (
                <tr key={order._id} className="border-b-2 border-comic-dark/10 hover:bg-comic-yellow/10 transition-colors">
                  <td className="px-2 sm:px-4 py-2 text-xs font-mono truncate max-w-[80px] sm:max-w-none">{order._id}</td>
                  <td className="px-2 sm:px-4 py-2 hidden sm:table-cell">{order.user?.name || "N/A"}</td>
                  <td className="px-2 sm:px-4 py-2 font-comic text-comic-green">{'$' + (order.totalPrice || 0).toFixed(2)}</td>
                  <td className="px-2 sm:px-4 py-2"><span className="comic-badge text-xs bg-comic-cyan text-white">{order.status}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
