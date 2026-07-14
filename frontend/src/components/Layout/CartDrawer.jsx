import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import CartContent from "../Cart/CartContent";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, addToCart } from "../../Redux/slices/cartSlice";
import { markInCart } from "../../Redux/slices/voiceSlice";
import { HiOutlineClipboardList } from "react-icons/hi";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "sonner";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { shoppingList } = useSelector((state) => state.voice);

  useEffect(() => {
    if (drawerOpen) dispatch(fetchCart());
  }, [drawerOpen, dispatch]);

  const cartItemCount = cart?.products?.length || 0;
  const totalPrice = cart?.totalPrice || 0;

  // Only show saved (not yet in cart) items in the drawer preview — max 3
  const savedItems = shoppingList.filter((i) => !i.inCart).slice(0, 3);
  const savedTotal = shoppingList.filter((i) => !i.inCart).length;

  const handleCheckout = () => {
    toggleCartDrawer();
    navigate("/checkout");
  };

  const handleMoveToCart = async (item) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/products?search=${encodeURIComponent(item.name)}&limit=1`
      );
      const data = await res.json();
      const match = Array.isArray(data) ? data[0] : null;
      if (match) {
        await dispatch(
          addToCart({
            productId: match._id,
            quantity: item.quantity,
            size: match.sizes?.[0] || "M",
            color: match.colors?.[0] || "Default",
          })
        ).unwrap();
        dispatch(markInCart(item.id));
        toast.success(`🛒 "${item.name}" added to cart!`);
      } else {
        toast.info(`"${item.name}" not found in catalog — search to add manually`);
      }
    } catch {
      toast.error(`Failed to add "${item.name}" to cart`);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-comic-cream shadow-comic-xl transform transition-transform duration-300 flex flex-col z-50 border-l-4 border-comic-dark ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-comic-yellow border-b-3 border-comic-dark">
        <h2 className="font-comic text-xl text-comic-dark flex items-center gap-2">
          🛒 Cart ({cartItemCount})
        </h2>
        <button
          onClick={toggleCartDrawer}
          className="comic-btn p-1.5 rounded-full bg-comic-red text-white border-2 border-comic-dark hover:scale-110 transition-transform"
        >
          <IoMdClose className="h-5 w-5" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-grow overflow-y-auto">
        {/* Real cart items */}
        <div className="p-4">
          <CartContent />
        </div>

        {/* Saved for later section */}
        {savedTotal > 0 && (
          <div className="px-4 pb-4 border-t-2 border-comic-dark/10 pt-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-comic text-sm text-comic-dark/70 flex items-center gap-1">
                <HiOutlineClipboardList className="h-4 w-4" />
                Saved for Later
                <span className="comic-badge bg-comic-dark/20 text-comic-dark text-xs px-1.5 py-0.5 ml-1">
                  {savedTotal}
                </span>
              </h3>
              <Link
                to="/shopping-list"
                onClick={toggleCartDrawer}
                className="text-xs font-comic text-comic-blue hover:text-comic-red transition-colors"
              >
                View All →
              </Link>
            </div>

            <div className="space-y-2">
              {savedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 bg-white rounded-xl border-2 border-comic-dark/10 hover:border-comic-yellow/50 transition-colors"
                >
                  <span className="font-comic text-comic-dark text-xs flex-1 truncate">
                    {item.name}
                    <span className="text-comic-dark/40 ml-1">×{item.quantity}</span>
                  </span>
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="flex items-center gap-1 px-2 py-1 bg-comic-dark text-comic-yellow text-xs font-comic rounded-lg hover:bg-gray-800 transition-all flex-shrink-0"
                  >
                    <FaShoppingCart className="h-2.5 w-2.5" />
                    Add
                  </button>
                </div>
              ))}

              {savedTotal > 3 && (
                <Link
                  to="/shopping-list"
                  onClick={toggleCartDrawer}
                  className="block text-center text-xs font-comic text-comic-dark/50 hover:text-comic-blue transition-colors py-1"
                >
                  +{savedTotal - 3} more saved items →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-white border-t-3 border-comic-dark">
        {totalPrice > 0 && (
          <div className="comic-card bg-comic-green/10 p-3 mb-3 text-right">
            <p className="font-comic text-lg text-comic-dark">
              Subtotal:{" "}
              <span className="text-comic-green font-bold text-xl">
                ${totalPrice.toLocaleString()}
              </span>
            </p>
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={cartItemCount === 0}
          className="comic-btn-primary w-full py-3 text-lg font-comic tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
        >
          💥 Proceed to Checkout!
        </button>

        <p className="text-xs font-body text-gray-500 mt-2 text-center">
          Shipping &amp; taxes calculated at checkout
        </p>

        {/* Full list link */}
        <Link
          to="/shopping-list"
          onClick={toggleCartDrawer}
          className="mt-3 flex items-center justify-between w-full px-4 py-2.5 bg-comic-yellow/20 border-2 border-comic-yellow rounded-xl hover:bg-comic-yellow/40 transition-colors"
        >
          <span className="flex items-center gap-2 font-comic text-comic-dark text-sm">
            <HiOutlineClipboardList className="h-4 w-4" />
            My Cart &amp; List
          </span>
          <span className="comic-badge bg-comic-dark text-comic-yellow text-xs px-2 py-0.5">
            {cartItemCount + savedTotal} total
          </span>
        </Link>
      </div>
    </div>
  );
};

export default CartDrawer;
