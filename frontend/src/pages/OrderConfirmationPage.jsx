import React, { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;
  const invoiceRef = useRef();

  const handleDownloadInvoice = () => {
    const printContents = invoiceRef.current.innerHTML;
    const win = window.open("", "_blank", "width=800,height=900");
    win.document.write(`
      <html>
      <head>
        <title>Invoice - ${order._id}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; padding: 40px; background: #fff; }
          .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1a1a2e; padding-bottom: 20px; margin-bottom: 30px; }
          .invoice-header h1 { font-size: 32px; font-weight: 800; letter-spacing: 1px; }
          .invoice-header .store-name { font-size: 28px; font-weight: 800; color: #E63946; }
          .invoice-meta { text-align: right; font-size: 13px; line-height: 1.8; }
          .invoice-meta strong { display: inline-block; min-width: 100px; }
          .section { margin-bottom: 24px; }
          .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #555; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 6px; }
          .address-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
          .address-box { background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 6px; padding: 16px; font-size: 14px; line-height: 1.7; }
          .address-box h3 { font-size: 13px; font-weight: 700; text-transform: uppercase; color: #888; margin-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          thead th { background: #1a1a2e; color: #FFD60A; padding: 10px 14px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; text-align: left; }
          tbody td { padding: 12px 14px; border-bottom: 1px solid #eee; font-size: 14px; vertical-align: middle; }
          tbody tr:hover { background: #fafafa; }
          .text-right { text-align: right; }
          .totals-section { margin-top: 20px; display: flex; justify-content: flex-end; }
          .totals-box { width: 280px; }
          .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; border-bottom: 1px solid #eee; }
          .totals-row.total { font-size: 18px; font-weight: 800; border-top: 3px solid #1a1a2e; border-bottom: none; padding-top: 12px; }
          .status-badge { display: inline-block; padding: 3px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
          .status-paid { background: #d4edda; color: #155724; }
          .status-pending { background: #fff3cd; color: #856404; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 16px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>${printContents}</body>
      </html>
    `);
    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-comic-cream font-body">
        <div className="comic-panel p-10 text-center animate-pop-in">
          <p className="text-5xl mb-4">😕</p>
          <h1 className="comic-heading text-2xl mb-4 text-comic-dark">No order found</h1>
          <button
            onClick={() => navigate("/")}
            className="comic-btn-primary px-6 py-3 font-comic"
          >
            🛒 Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const isCOD = order.paymentMethod === "COD";

  return (
    <div className="min-h-screen bg-comic-cream py-8 px-4 font-body">
      <div className="max-w-4xl mx-auto comic-panel p-6 sm:p-8 animate-pop-in relative overflow-hidden">

        {/* Confetti decoration */}
        <div className="absolute top-2 left-4 text-2xl animate-wiggle">🎉</div>
        <div className="absolute top-2 right-4 text-2xl animate-float">🎊</div>
        <div className="absolute top-8 left-1/4 text-xl animate-bounce-slow">⭐</div>
        <div className="absolute top-8 right-1/4 text-xl animate-wiggle">🌟</div>

        {/* Header */}
        <h1 className="comic-heading text-3xl sm:text-4xl text-center text-comic-green mb-4 transform -rotate-1">
          🎉 Thank you for your order! 🎉
        </h1>

        <p className="text-center text-gray-600 mb-8 font-body text-sm">
          {isCOD
            ? "Your order has been placed. Please keep the amount ready for delivery."
            : "Your payment was successful. A confirmation has been sent to your email."}
        </p>

        {/* Order Info */}
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <div className="comic-card bg-comic-blue/5 p-4">
            <h2 className="font-comic text-lg text-comic-dark mb-2">📋 Order Details</h2>
            <div className="space-y-1 text-sm font-body">
              <p>Order ID: <span className="font-bold font-mono text-xs">{order._id}</span></p>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Status: <span className="comic-badge bg-comic-blue text-white text-xs px-2 py-0.5">{order.status}</span></p>
            </div>
          </div>

          <div className="comic-card bg-comic-green/5 p-4">
            <h2 className="font-comic text-lg text-comic-dark mb-2">💳 Payment Info</h2>
            <div className="space-y-1 text-sm font-body">
              <p>Method: <span className="font-bold">{order.paymentMethod === "COD" ? "Cash on Delivery" : "PayPal"}</span></p>
              <p>Payment: <span className={`comic-badge text-xs text-white px-2 py-0.5 ${order.isPaid ? "bg-comic-green" : "bg-comic-orange"}`}>
                {order.isPaid ? "Paid" : isCOD ? "Pay on Delivery" : "Pending"}
              </span></p>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="comic-card bg-comic-pink/5 p-4 mb-6">
          <h2 className="font-comic text-lg text-comic-dark mb-2">🚚 Shipping Address</h2>
          <div className="text-sm font-body space-y-0.5">
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city},{" "}
              {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>

        {/* Items Ordered */}
        <div className="comic-card bg-comic-yellow/10 p-4 mb-6">
          <h2 className="font-comic text-lg text-comic-dark mb-4">📦 Items Ordered</h2>

          {order.orderItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-2 border-dashed border-comic-dark/10 py-3 gap-3"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md border-2 border-comic-dark shadow-comic"
                />
                <div>
                  <h3 className="font-comic text-comic-dark">{item.name}</h3>
                  {item.size && (
                    <p className="text-xs text-gray-600 font-body">
                      Size: {item.size}{item.color ? ` | Color: ${item.color}` : ""}
                    </p>
                  )}
                  <p className="text-xs text-gray-600 font-body">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>

              <span className="font-comic font-bold text-comic-green text-lg">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="comic-card bg-comic-green/10 p-4 flex justify-between items-center mb-8 border-2 border-comic-green">
          <h2 className="font-comic text-lg text-comic-dark">
            {isCOD ? "💰 Total Due on Delivery" : "💰 Total Paid"}
          </h2>
          <p className="font-comic text-2xl font-bold text-comic-green">
            ${order.totalPrice?.toFixed(2)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="comic-btn-primary px-6 py-3 font-comic"
          >
            🛒 Continue Shopping
          </button>

          <button
            onClick={handleDownloadInvoice}
            className="comic-btn-dark px-6 py-3 font-comic"
          >
            🖨️ Download Invoice
          </button>
        </div>

      </div>

      {/* Hidden Invoice for printing */}
      <div style={{ display: "none" }}>
        <div ref={invoiceRef}>
          <div className="invoice-header">
            <div>
              <div className="store-name">🐰 RABBIT</div>
              <p style={{fontSize:"13px",color:"#666",marginTop:"4px"}}>Your favorite comic store</p>
            </div>
            <div className="invoice-meta">
              <h1>INVOICE</h1>
              <p><strong>Invoice #:</strong> {order._id}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
              <p><strong>Payment:</strong> {order.paymentMethod === "COD" ? "Cash on Delivery" : "PayPal"}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status-badge ${order.isPaid ? "status-paid" : "status-pending"}`}>
                  {order.isPaid ? "PAID" : isCOD ? "PAY ON DELIVERY" : "PENDING"}
                </span>
              </p>
            </div>
          </div>

          <div className="section">
            <div className="address-grid">
              <div className="address-box">
                <h3>Ship To</h3>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
              <div className="address-box">
                <h3>Order Info</h3>
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Placed:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="section-title">Items</div>
            <table>
              <thead>
                <tr>
                  <th style={{width:"5%"}}>#</th>
                  <th style={{width:"45%"}}>Product</th>
                  <th style={{width:"15%"}}>Price</th>
                  <th style={{width:"10%"}}>Qty</th>
                  <th style={{width:"25%"}} className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <strong>{item.name}</strong>
                      {(item.size || item.color) && (
                        <div style={{fontSize:"12px",color:"#888",marginTop:"2px"}}>
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.color && " | "}
                          {item.color && `Color: ${item.color}`}
                        </div>
                      )}
                    </td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td className="text-right">${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="totals-section">
            <div className="totals-box">
              <div className="totals-row">
                <span>Subtotal</span>
                <span>${order.totalPrice?.toFixed(2)}</span>
              </div>
              <div className="totals-row">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="totals-row total">
                <span>{isCOD ? "Amount Due" : "Total Paid"}</span>
                <span>${order.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="footer">
            <p>Thank you for shopping with Rabbit! 🐰</p>
            <p style={{marginTop:"4px"}}>If you have any questions about your order, please contact us.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
