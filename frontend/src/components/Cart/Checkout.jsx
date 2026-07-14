import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { fetchCart } from "../../Redux/slices/cartSlice";
import { createCheckout, payCheckout } from "../../Redux/slices/checkoutSlice";
import { FaTruck, FaMoneyBillWave, FaShieldAlt, FaCreditCard } from "react-icons/fa";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { checkout, loading: checkoutLoading } = useSelector((state) => state.checkout);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [checkoutId, setCheckoutId] = useState(null);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const cartProducts = cart?.products || [];
  const totalPrice = cart?.totalPrice || 0;

  const validateForm = () => {
    if (cartProducts.length === 0) {
      toast.error("Your cart is empty!");
      return false;
    }
    const { firstName, lastName, address, city, postalCode, country, phone } = shippingAddress;
    if (!firstName || !lastName || !address || !city || !postalCode || !country || !phone) {
      toast.error("Please fill in all shipping details");
      return false;
    }
    return true;
  };

  const getCheckoutItems = () =>
    cartProducts.map((item) => ({
      product: item.product,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));

  // === COD Flow ===
  const handlePlaceCOD = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setPlacingOrder(true);
      const checkoutResult = await dispatch(
        createCheckout({
          checkoutItems: getCheckoutItems(),
          shippingAddress,
          paymentMethod: "COD",
          totalPrice,
        })
      ).unwrap();

      const result = await dispatch(
        payCheckout({
          id: checkoutResult._id,
          paymentStatus: "Pending",
          paymentDetails: { method: "Cash on Delivery" },
        })
      ).unwrap();

      toast.success("Order placed successfully! Pay on delivery.");
      navigate("/order-confirmation", { state: { order: result.order } });
    } catch (err) {
      toast.error(err || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  // === PayPal Flow — Step 1: Create checkout before PayPal buttons appear ===
  const handlePreparePayPal = async () => {
    if (!validateForm()) return;
    try {
      setPlacingOrder(true);
      const checkoutResult = await dispatch(
        createCheckout({
          checkoutItems: getCheckoutItems(),
          shippingAddress,
          paymentMethod: "PayPal",
          totalPrice,
        })
      ).unwrap();
      setCheckoutId(checkoutResult._id);
      toast.info("Review and pay with PayPal below");
    } catch (err) {
      toast.error(err || "Failed to prepare checkout");
    } finally {
      setPlacingOrder(false);
    }
  };

  // === PayPal Flow — Step 2: After PayPal approval ===
  const handlePayPalSuccess = useCallback(
    async (details) => {
      if (!checkoutId) return;
      try {
        const result = await dispatch(
          payCheckout({
            id: checkoutId,
            paymentStatus: "Completed",
            paymentDetails: {
              method: "PayPal",
              transactionId: details.id,
              payer: details.payer,
              paidAt: new Date().toISOString(),
            },
          })
        ).unwrap();
        toast.success("Payment successful! 🎉");
        navigate("/order-confirmation", { state: { order: result.order } });
      } catch (err) {
        toast.error(err || "Failed to finalize order");
      }
    },
    [checkoutId, dispatch, navigate]
  );

  return (
    <div className="min-h-screen bg-comic-cream py-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-7xl mx-auto">

        {/* LEFT SIDE - Form */}
        <div className="comic-panel animate-slide-right">
          <h2 className="text-2xl sm:text-3xl font-comic text-comic-dark mb-2">Checkout</h2>
          <div className="w-20 h-1 bg-comic-yellow rounded mb-6"></div>

          <form onSubmit={paymentMethod === "COD" ? handlePlaceCOD : (e) => { e.preventDefault(); handlePreparePayPal(); }}>
            <h3 className="text-lg font-comic text-comic-blue mb-4">
              📍 Delivery Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="First Name"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, firstName: e.target.value })
                }
                className="comic-input"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, lastName: e.target.value })
                }
                className="comic-input"
                required
              />
            </div>

            <input
              type="text"
              placeholder="Address"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, address: e.target.value })
              }
              className="comic-input mb-4"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="City"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, city: e.target.value })
                }
                className="comic-input"
                required
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                }
                className="comic-input"
                required
              />
            </div>

            <input
              type="text"
              placeholder="Country"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, country: e.target.value })
              }
              className="comic-input mb-4"
              required
            />

            <input
              type="text"
              placeholder="Phone"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, phone: e.target.value })
              }
              className="comic-input mb-6"
              required
            />

            {/* Payment Method Selection */}
            <div className="bg-comic-yellow/20 border-3 border-comic-dark rounded-xl p-4 mb-6">
              <h3 className="text-lg font-comic text-comic-dark mb-3">
                💰 Payment Method
              </h3>

              {/* COD Option */}
              <label
                className={`flex items-center gap-3 border-2 rounded-lg p-3 mb-3 cursor-pointer transition-all ${
                  paymentMethod === "COD"
                    ? "border-comic-green bg-comic-green/10 shadow-comic"
                    : "border-comic-dark/30 bg-white hover:border-comic-green/50"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => { setPaymentMethod("COD"); setCheckoutId(null); }}
                  className="hidden"
                />
                <div className={`w-5 h-5 rounded-full border-3 flex items-center justify-center ${paymentMethod === "COD" ? "border-comic-green" : "border-comic-dark/40"}`}>
                  {paymentMethod === "COD" && <div className="w-3 h-3 rounded-full bg-comic-green"></div>}
                </div>
                <FaMoneyBillWave className="text-comic-green text-xl" />
                <div>
                  <span className="font-comic text-lg">Cash on Delivery</span>
                  <p className="text-xs text-comic-dark/60 font-body">Pay when your order arrives</p>
                </div>
              </label>

              {/* PayPal Option */}
              <label
                className={`flex items-center gap-3 border-2 rounded-lg p-3 cursor-pointer transition-all ${
                  paymentMethod === "PayPal"
                    ? "border-comic-blue bg-comic-blue/10 shadow-comic"
                    : "border-comic-dark/30 bg-white hover:border-comic-blue/50"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === "PayPal"}
                  onChange={() => { setPaymentMethod("PayPal"); setCheckoutId(null); }}
                  className="hidden"
                />
                <div className={`w-5 h-5 rounded-full border-3 flex items-center justify-center ${paymentMethod === "PayPal" ? "border-comic-blue" : "border-comic-dark/40"}`}>
                  {paymentMethod === "PayPal" && <div className="w-3 h-3 rounded-full bg-comic-blue"></div>}
                </div>
                <FaCreditCard className="text-comic-blue text-xl" />
                <div>
                  <span className="font-comic text-lg">PayPal</span>
                  <p className="text-xs text-comic-dark/60 font-body">Pay securely with PayPal</p>
                </div>
              </label>
            </div>

            {/* Trust Badges */}
            <div className="flex gap-4 mb-6 justify-center">
              <div className="flex items-center gap-2 text-comic-dark/70">
                <FaTruck className="text-comic-cyan" />
                <span className="text-xs font-body">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-comic-dark/70">
                <FaShieldAlt className="text-comic-green" />
                <span className="text-xs font-body">Secure Order</span>
              </div>
            </div>

            {/* COD Button */}
            {paymentMethod === "COD" && (
              <button
                type="submit"
                disabled={placingOrder || checkoutLoading || cartProducts.length === 0}
                className="comic-btn-primary w-full text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placingOrder ? "Placing Order..." : "🛒 Place Order (Cash on Delivery)"}
              </button>
            )}

            {/* PayPal Step 1: Prepare checkout */}
            {paymentMethod === "PayPal" && !checkoutId && (
              <button
                type="submit"
                disabled={placingOrder || checkoutLoading || cartProducts.length === 0}
                className="comic-btn-dark w-full text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placingOrder ? "Preparing..." : "💳 Proceed to PayPal"}
              </button>
            )}
          </form>

          {/* PayPal Step 2: Show PayPal buttons after checkout created */}
          {paymentMethod === "PayPal" && checkoutId && (
            <div className="mt-6 p-4 bg-white border-3 border-comic-blue rounded-xl">
              <p className="text-center font-comic text-comic-blue mb-4">Complete your payment below</p>
              <PayPalScriptProvider
                options={{
                  "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
                }}
              >
                <PayPalButtons
                  style={{ layout: "vertical" }}
                  createOrder={(data, actions) =>
                    actions.order.create({
                      purchase_units: [{ amount: { value: totalPrice.toString() } }],
                    })
                  }
                  onApprove={async (data, actions) => {
                    const details = await actions.order.capture();
                    handlePayPalSuccess(details);
                  }}
                  onError={(err) => {
                    console.error("PayPal Error:", err);
                    toast.error("PayPal payment failed. Please try again.");
                  }}
                />
              </PayPalScriptProvider>
            </div>
          )}
        </div>

        {/* RIGHT SIDE - Order Summary */}
        <div className="comic-panel animate-slide-up">
          <h2 className="text-2xl sm:text-3xl font-comic text-comic-dark mb-2">
            Order Summary
          </h2>
          <div className="w-20 h-1 bg-comic-cyan rounded mb-6"></div>

          {cartProducts.length === 0 ? (
            <p className="text-center text-comic-dark/50 py-4 font-body">Your cart is empty</p>
          ) : (
            cartProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center gap-4 mb-4 border-b-2 border-comic-dark/10 pb-4"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg border-2 border-comic-dark"
                />
                <div className="flex-1">
                  <h3 className="font-comic text-sm">
                    {product.name}
                  </h3>
                  <p className="text-xs text-comic-dark/60 font-body">
                    Size: {product.size} | Color: {product.color}
                  </p>
                  <p className="text-xs text-comic-dark/60 font-body">
                    Qty: {product.quantity}
                  </p>
                  <p className="font-comic text-comic-blue mt-1">
                    ${(product.price * product.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}

          <div className="pt-4 flex justify-between text-xl font-comic border-t-3 border-comic-dark mt-4">
            <span>Total</span>
            <span className="text-comic-red">${totalPrice.toLocaleString()}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
