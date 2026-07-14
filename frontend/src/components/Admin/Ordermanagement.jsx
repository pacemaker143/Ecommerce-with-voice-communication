import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  fetchAdminOrders,
  updateAdminOrder,
  deleteAdminOrder,
} from "../../Redux/slices/adminSlice";

const Ordermanagement = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateAdminOrder({ id: orderId, status: newStatus }))
      .unwrap()
      .then(() => toast.success("Order status updated"))
      .catch((err) => toast.error(err));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 font-body">
      <h2 className="comic-heading text-xl sm:text-2xl text-comic-dark mb-6 inline-block transform -rotate-1">📦 Order Management</h2>

      <div className="comic-panel overflow-x-auto">
        <table className="min-w-full text-left font-body text-sm">
          <thead>
            <tr className="bg-comic-yellow border-b-3 border-comic-dark">
              <th className="py-3 px-2 sm:px-4 font-comic text-comic-dark hidden sm:table-cell">Order ID</th>
              <th className="py-3 px-2 sm:px-4 font-comic text-comic-dark">User</th>
              <th className="py-3 px-2 sm:px-4 font-comic text-comic-dark">Total</th>
              <th className="py-3 px-2 sm:px-4 font-comic text-comic-dark">Status</th>
              <th className="py-3 px-2 sm:px-4 font-comic text-comic-dark hidden md:table-cell">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-4 px-4 text-center font-comic text-comic-dark">
                  ⏳ Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 px-4 text-center font-comic text-comic-dark">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b-2 border-comic-dark/10 hover:bg-comic-yellow/10 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-2 sm:px-4 font-mono text-xs text-comic-dark whitespace-nowrap hidden sm:table-cell">
                    {order._id}
                  </td>

                  <td className="p-2 sm:p-4">
                    <span className="font-bold text-sm">{order.user?.name || "N/A"}</span>
                    <br /><span className="text-xs text-gray-500 hidden sm:inline">({order.user?.email || "N/A"})</span>
                  </td>

                  <td className="p-2 sm:p-4 font-comic text-comic-green">
                    ${order.totalPrice?.toFixed(2)}
                  </td>

                  <td className="py-3 px-2 sm:px-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="comic-input py-1 px-2 text-xs sm:text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>

                  <td className="py-3 px-2 sm:px-4 hidden md:table-cell">
                    <button
                      onClick={() => handleStatusChange(order._id, "Delivered")}
                      className="comic-btn-primary px-3 py-1.5 text-xs sm:text-sm font-comic"
                    >
                      ✅ Mark Delivered
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ordermanagement;
