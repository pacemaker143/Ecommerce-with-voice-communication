import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../Redux/slices/orderSlice";

const MyOrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const handleRowClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="comic-heading text-xl sm:text-2xl mb-6 text-comic-dark flex items-center gap-2">
        📦 My Orders
      </h2>

      {/* Mobile card view */}
      <div className="space-y-4 sm:hidden">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order._id}
              onClick={() => handleRowClick(order._id)}
              className="comic-card p-4 cursor-pointer hover:bg-comic-yellow/10 transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={order.orderItems[0].image}
                  alt={order.orderItems[0].name}
                  className="w-14 h-14 object-cover rounded-lg border-2 border-comic-dark shadow-comic flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-comic text-xs text-comic-dark/60 truncate">#{order._id}</p>
                  <p className="font-body text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="font-body text-xs text-gray-500">{order.shippingAddress.city}, {order.shippingAddress.country}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-comic font-bold text-comic-green">${order.totalPrice}</span>
                <span className="comic-badge text-xs font-comic bg-comic-blue text-white">{order.orderItems.length} item{order.orderItems.length !== 1 ? "s" : ""}</span>
                <span className={`comic-badge text-xs font-comic ${order.isPaid ? "bg-comic-green text-white" : "bg-comic-orange text-white"}`}>
                  {order.isPaid ? "✅ Paid" : order.paymentMethod === "COD" ? "💵 COD" : "⏳ Pending"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-8 font-comic text-comic-dark text-lg">
            {loading ? "⚡ Loading orders..." : "📭 No orders found."}
          </p>
        )}
      </div>

      {/* Desktop table view */}
      <div className="hidden sm:block comic-panel overflow-x-auto">
        <table className="min-w-full text-left font-body">
          <thead className="bg-comic-yellow border-b-3 border-comic-dark">
            <tr>
              <th className="py-3 px-4 font-comic text-comic-dark text-xs uppercase">Image</th>
              <th className="py-3 px-4 font-comic text-comic-dark text-xs uppercase">Order Id</th>
              <th className="py-3 px-4 font-comic text-comic-dark text-xs uppercase hidden md:table-cell">Created</th>
              <th className="py-3 px-4 font-comic text-comic-dark text-xs uppercase hidden md:table-cell">Shipping Address</th>
              <th className="py-3 px-4 font-comic text-comic-dark text-xs uppercase">Items</th>
              <th className="py-3 px-4 font-comic text-comic-dark text-xs uppercase">Price</th>
              <th className="py-3 px-4 font-comic text-comic-dark text-xs uppercase">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => handleRowClick(order._id)}
                  className="border-b-2 border-comic-dark/10 hover:bg-comic-yellow/20 transition cursor-pointer"
                >
                  <td className="py-2 px-2 sm:px-4">
                    <img
                      src={order.orderItems[0].image}
                      alt={order.orderItems[0].name}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg border-2 border-comic-dark shadow-comic"
                    />
                  </td>

                  <td className="p-4 font-bold text-comic-dark font-body text-sm max-w-[120px] truncate">
                    {order._id}
                  </td>

                  <td className="p-4 font-body text-sm hidden md:table-cell">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-4 font-body text-sm hidden md:table-cell">
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.country}
                  </td>

                  <td className="p-4 text-center">
                    <span className="comic-badge bg-comic-blue text-white px-2 py-1 text-xs">
                      {order.orderItems.length}
                    </span>
                  </td>

                  <td className="p-4 font-comic font-bold text-comic-green">
                    ${order.totalPrice}
                  </td>

                  <td className="p-4">
                    <span
                      className={`comic-badge text-xs font-comic ${order.isPaid ? "bg-comic-green text-white" : "bg-comic-orange text-white"}`}
                    >
                      {order.isPaid
                        ? "✅ Paid"
                        : order.paymentMethod === "COD"
                        ? "💵 Pay on Delivery"
                        : "⏳ Pending"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-8 font-comic text-comic-dark text-lg"
                >
                  {loading ? "⚡ Loading orders..." : "📭 No orders found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrdersPage;
