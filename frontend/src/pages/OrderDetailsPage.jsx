import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderById, clearSelectedOrder } from "../Redux/slices/orderSlice";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedOrder: orderDetails, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderById(id));
    return () => {
      dispatch(clearSelectedOrder());
    };
  }, [dispatch, id]);

  if (!orderDetails) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center font-comic text-comic-dark text-lg">
        {loading ? "⚡ Loading order details..." : "😕 Order not found"}
      </div>
    );
  }

  const totalAmount = orderDetails.totalPrice;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-comic-cream min-h-screen font-body">
      <h1 className="comic-heading text-3xl text-center text-comic-dark mb-8 transform -rotate-1">
        📋 Order Details
      </h1>

      <div className="comic-panel p-6 space-y-8 animate-pop-in">
        {/* Order Info + Shipping */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {/* Order Information */}
          <div>
            <h2 className="font-comic text-xl text-comic-dark mb-4 border-b-3 border-comic-yellow pb-2">
              📄 Order Information
            </h2>

            <div className="space-y-2 text-sm font-body">
              <p>
                <span className="font-bold">Order ID:</span>{" "}
                {orderDetails._id}
              </p>
              <p>
                <span className="font-bold">Date:</span>{" "}
                {new Date(orderDetails.createdAt).toLocaleDateString()}
              </p>
              <p>
                <span className="font-bold">Payment Method:</span>{" "}
                {orderDetails.paymentMethod}
              </p>

              <p>
                <span className="font-bold">Payment Status:</span>{" "}
                <span className={`comic-badge text-xs font-comic ${orderDetails.isPaid ? "bg-comic-green text-white" : "bg-comic-orange text-white"}`}>
                  {orderDetails.isPaid
                    ? "✅ Paid"
                    : orderDetails.paymentMethod === "COD"
                    ? "💵 Pay on Delivery"
                    : "⏳ Pending"}
                </span>
              </p>

              <p>
                <span className="font-bold">Order Status:</span>{" "}
                <span className="comic-badge text-xs font-comic bg-comic-blue text-white">
                  {orderDetails.status}
                </span>
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h2 className="font-comic text-xl text-comic-dark mb-4 border-b-3 border-comic-pink pb-2">
              🚚 Shipping Address
            </h2>

            <address className="not-italic text-sm space-y-1 font-body text-gray-700">
              <p>{orderDetails.shippingAddress.address}</p>
              <p>
                {orderDetails.shippingAddress.city},{" "}
                {orderDetails.shippingAddress.postalCode}
              </p>
              <p>{orderDetails.shippingAddress.country}</p>
            </address>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h2 className="font-comic text-xl text-comic-dark mb-4 border-b-3 border-comic-cyan pb-2">
            📦 Items in Order
          </h2>

          <div className="space-y-4">
            {orderDetails.orderItems.map((item, index) => (
              <div
                key={index}
                className="comic-card flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 hover:bg-comic-yellow/10 transition-colors gap-3"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md border-2 border-comic-dark shadow-comic flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-comic text-comic-dark text-sm sm:text-base">{item.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 font-body">
                      ${item.price} × {item.quantity}
                    </p>
                  </div>
                </div>

                <p className="font-comic font-bold text-comic-green text-base sm:text-lg self-end sm:self-auto">
                  ${item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t-3 border-comic-dark pt-6 flex justify-end">
          <div className="w-full sm:w-1/2 lg:w-1/3 space-y-2 text-sm">
            <div className="comic-card bg-comic-green/10 p-4 flex justify-between items-center border-2 border-comic-green">
              <span className="font-comic text-comic-dark">💰 Total Amount:</span>
              <span className="font-comic text-xl text-comic-green font-bold">${totalAmount}</span>
            </div>
          </div>
        </div>

        <Link to="/my-orders" className="inline-flex items-center gap-1 font-comic text-comic-blue hover:text-comic-red transition-colors">
          👈 Back to Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
