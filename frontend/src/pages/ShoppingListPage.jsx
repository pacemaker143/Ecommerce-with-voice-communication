import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  addShoppingItem,
  removeShoppingItem,
  updateShoppingItemQty,
  toggleShoppingItemChecked,
  clearCheckedItems,
  clearShoppingList,
  markInCart,
  unmarkInCart,
} from "../Redux/slices/voiceSlice";
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from "../Redux/slices/cartSlice";
import useVoiceRecognition from "../hooks/useVoiceRecognition";
import SmartSuggestions from "../components/Voice/SmartSuggestions";
import { toast } from "sonner";
import { HiMicrophone } from "react-icons/hi2";
import { RiDeleteBin3Line } from "react-icons/ri";
import { FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import { HiOutlineClipboardList } from "react-icons/hi";

const CATEGORY_COLORS = {
  Dairy:            "bg-comic-cyan/20   border-comic-cyan",
  Fruits:           "bg-comic-green/20  border-comic-green",
  Vegetables:       "bg-comic-green/30  border-comic-green",
  Bakery:           "bg-comic-orange/20 border-comic-orange",
  "Meat & Seafood": "bg-comic-red/20    border-comic-red",
  Beverages:        "bg-comic-blue/20   border-comic-blue",
  Snacks:           "bg-comic-yellow/30 border-comic-yellow",
  Clothing:         "bg-comic-pink/20   border-comic-pink",
  "Personal Care":  "bg-comic-purple/20 border-comic-purple",
  Household:        "bg-gray-100        border-gray-300",
  Other:            "bg-white           border-comic-dark/20",
};

const ShoppingListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shoppingList, isListening, transcript } = useSelector((s) => s.voice);
  const { cart, loading: cartLoading } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);

  const cartProducts = cart?.products || [];
  const cartTotal = cart?.totalPrice || 0;

  const [manualName, setManualName] = useState("");
  const [manualQty, setManualQty] = useState(1);
  const [filterCat, setFilterCat] = useState("All");
  const [activeTab, setActiveTab] = useState("list"); // "list" | "suggestions"

  const { startListening, stopListening } = useVoiceRecognition();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // ── Derived state ──────────────────────────────────────────────────────
  const savedItems = shoppingList.filter((i) => !i.inCart);
  const categories = ["All", ...new Set(savedItems.map((i) => i.category))];
  const displayed =
    filterCat === "All"
      ? savedItems
      : savedItems.filter((i) => i.category === filterCat);

  const grouped = displayed.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const checkedCount = savedItems.filter((i) => i.checked).length;
  const totalItemCount = cartProducts.length + savedItems.length;

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!manualName.trim()) return;
    dispatch(addShoppingItem({ name: manualName.trim(), quantity: manualQty }));
    toast.success(`✅ Saved "${manualName.trim()}" to list`);
    setManualName("");
    setManualQty(1);
  };

  const handleQtyChange = (item, delta) => {
    const next = item.quantity + delta;
    if (next < 1) return;
    dispatch(updateShoppingItemQty({ name: item.name, quantity: next }));
  };

  // Move a saved list item → real cart (finds matching product in catalog by name)
  const handleMoveToCart = async (item) => {
    // Search the backend for a product matching this name
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
        toast.success(`🛒 "${item.name}" moved to cart!`);
      } else {
        // No matching product found — still mark it as "in cart" as a generic intent
        dispatch(markInCart(item.id));
        toast.info(`📋 "${item.name}" marked as in cart (search it to add the real product)`);
      }
    } catch {
      toast.error(`Failed to add "${item.name}" to cart`);
    }
  };

  // Move back from "in cart" to saved list
  const handleSaveForLater = (product) => {
    dispatch(
      removeFromCart({
        productId: product.product,
        size: product.size,
        color: product.color,
      })
    );
    dispatch(addShoppingItem({ name: product.name, quantity: product.quantity }));
    toast.info(`📋 "${product.name}" saved for later`);
  };

  const handleCartQtyChange = (product, delta) => {
    const newQty = product.quantity + delta;
    if (newQty < 1) return;
    dispatch(
      updateCartItem({
        productId: product.product,
        quantity: newQty,
        size: product.size,
        color: product.color,
      })
    );
  };

  const handleRemoveFromCart = (product) => {
    dispatch(
      removeFromCart({
        productId: product.product,
        size: product.size,
        color: product.color,
      })
    );
  };

  // Add all saved items to cart at once
  const handleAddAllToCart = async () => {
    if (savedItems.length === 0) return;
    let added = 0;
    for (const item of savedItems) {
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
          added++;
        }
      } catch {}
    }
    toast.success(`🛒 ${added} item${added !== 1 ? "s" : ""} added to cart!`);
    if (added < savedItems.length)
      toast.info(`${savedItems.length - added} item(s) not found in catalog — search to add manually`);
  };

  return (
    <div className="min-h-screen bg-comic-cream py-6 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-comic text-3xl text-comic-dark flex items-center gap-2">
              <HiOutlineClipboardList className="text-comic-yellow" />
              My Cart &amp; List
            </h1>
            <p className="text-sm font-body text-comic-dark/50 mt-1">
              {cartProducts.length} in cart · {savedItems.length} saved · {checkedCount} checked
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Voice button */}
            <button
              onClick={isListening ? stopListening : startListening}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-3 border-comic-dark font-comic text-sm shadow-comic transition-all hover:scale-105 ${
                isListening
                  ? "bg-comic-red text-white animate-pulse shadow-comic-red"
                  : "bg-comic-yellow text-comic-dark hover:bg-yellow-300"
              }`}
            >
              <HiMicrophone className="h-5 w-5" />
              {isListening ? "Stop" : "🎤 Voice"}
            </button>

            {/* Checkout */}
            {cartProducts.length > 0 && (
              <button
                onClick={() => {
                  if (!user) { navigate("/login"); return; }
                  navigate("/checkout");
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-3 border-comic-dark font-comic text-sm bg-comic-green text-white shadow-comic hover:scale-105 transition-all"
              >
                <FaShoppingCart className="h-4 w-4" />
                Checkout · ${cartTotal.toFixed(2)}
              </button>
            )}
          </div>
        </div>

        {/* ── Live transcript ─────────────────────────────────────────── */}
        {isListening && (
          <div className="mb-4 p-3 bg-comic-red/10 border-3 border-comic-red rounded-xl text-center font-comic text-comic-red animate-pulse text-sm">
            🎤 {transcript || "Say: 'Add 3 apples', 'Remove milk', 'Find cotton shirts under $50'"}
          </div>
        )}

        {/* ── Voice tips ──────────────────────────────────────────────── */}
        <div className="mb-5 p-3 bg-comic-yellow/20 border-2 border-comic-yellow rounded-xl text-xs font-body text-comic-dark/70 grid grid-cols-1 sm:grid-cols-2 gap-1">
          <span>🗣️ <strong>"Add 2 litres of milk"</strong> — save to list</span>
          <span>🗣️ <strong>"Remove bread from my list"</strong> — remove saved item</span>
          <span>🗣️ <strong>"Find cotton shirts under $50"</strong> — voice search</span>
          <span>🗣️ <strong>"I need 5 oranges"</strong> — natural language add</span>
        </div>

        {/* ── Tabs ────────────────────────────────────────────────────── */}
        <div className="flex gap-2 mb-5 border-b-3 border-comic-dark pb-2">
          <button
            onClick={() => setActiveTab("list")}
            className={`font-comic px-4 py-2 rounded-t-xl text-sm border-3 border-comic-dark transition-all ${
              activeTab === "list"
                ? "bg-comic-yellow text-comic-dark shadow-comic"
                : "bg-white text-comic-dark/60 hover:bg-comic-yellow/20"
            }`}
          >
            🛒 Cart &amp; List
            {totalItemCount > 0 && (
              <span className="ml-2 comic-badge bg-comic-dark text-comic-yellow text-xs px-1.5 py-0.5">
                {totalItemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("suggestions")}
            className={`font-comic px-4 py-2 rounded-t-xl text-sm border-3 border-comic-dark transition-all ${
              activeTab === "suggestions"
                ? "bg-comic-cyan text-comic-dark shadow-comic"
                : "bg-white text-comic-dark/60 hover:bg-comic-cyan/20"
            }`}
          >
            💡 Suggestions
          </button>
        </div>

        {activeTab === "suggestions" ? (
          <SmartSuggestions />
        ) : (
          <>
            {/* ══════════════════════════════════════════════════════════
                SECTION 1 — REAL CART (backend-synced, ready to checkout)
            ═══════════════════════════════════════════════════════════ */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-comic text-xl text-comic-dark flex items-center gap-2">
                  🛒 <span>In Cart</span>
                  <span className="comic-badge bg-comic-dark text-comic-yellow text-xs">
                    {cartProducts.length}
                  </span>
                </h2>
                {cartProducts.length > 0 && (
                  <span className="font-comic text-comic-green text-lg">
                    Total: <strong>${cartTotal.toFixed(2)}</strong>
                  </span>
                )}
              </div>

              {cartProducts.length === 0 ? (
                <div className="comic-panel p-6 text-center">
                  <p className="text-3xl mb-2">🛒</p>
                  <p className="font-comic text-comic-dark/60 text-sm">
                    Cart is empty — save items below then move them to cart, or{" "}
                    <Link to="/collections/all" className="text-comic-blue underline">browse products</Link>
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartProducts.map((product, i) => (
                    <div
                      key={i}
                      className="comic-card flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-white animate-slide-right"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      {/* Image */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full sm:w-16 h-32 sm:h-16 object-cover rounded-lg border-2 border-comic-dark shadow-comic flex-shrink-0"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-comic text-comic-dark text-sm truncate">{product.name}</h3>
                        <p className="text-xs text-gray-500 font-body">
                          📏 {product.size} · 🎨 {product.color}
                        </p>
                        <p className="font-comic text-comic-green text-sm mt-0.5">
                          ${(product.price * product.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Qty controls */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border-2 border-comic-dark rounded-lg overflow-hidden">
                          <button
                            onClick={() => handleCartQtyChange(product, -1)}
                            className="w-8 h-8 bg-comic-yellow hover:bg-yellow-300 flex items-center justify-center font-bold text-comic-dark"
                          >
                            <FaMinus className="h-2.5 w-2.5" />
                          </button>
                          <span className="w-8 h-8 flex items-center justify-center font-comic text-sm bg-white border-x border-comic-dark/20">
                            {product.quantity}
                          </span>
                          <button
                            onClick={() => handleCartQtyChange(product, 1)}
                            className="w-8 h-8 bg-comic-yellow hover:bg-yellow-300 flex items-center justify-center font-bold text-comic-dark"
                          >
                            <FaPlus className="h-2.5 w-2.5" />
                          </button>
                        </div>

                        {/* Save for later */}
                        <button
                          onClick={() => handleSaveForLater(product)}
                          title="Save for later"
                          className="px-2 py-1.5 text-xs font-comic border-2 border-comic-dark/30 rounded-lg hover:border-comic-yellow hover:bg-comic-yellow/20 transition-all text-comic-dark/70"
                        >
                          💾 Save
                        </button>

                        {/* Remove */}
                        <button
                          onClick={() => handleRemoveFromCart(product)}
                          className="p-1.5 rounded-full hover:bg-comic-red/10 transition-all group"
                        >
                          <RiDeleteBin3Line className="h-4 w-4 text-gray-400 group-hover:text-comic-red" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Cart total + checkout */}
                  <div className="comic-panel bg-comic-green/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-2 border-comic-green">
                    <p className="font-comic text-lg text-comic-dark">
                      Cart Total: <span className="text-comic-green font-bold">${cartTotal.toFixed(2)}</span>
                    </p>
                    <button
                      onClick={() => {
                        if (!user) { navigate("/login"); return; }
                        navigate("/checkout");
                      }}
                      className="comic-btn-primary px-6 py-2 font-comic text-sm"
                    >
                      💥 Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ══════════════════════════════════════════════════════════
                SECTION 2 — SAVED LIST (voice/manual, not yet in cart)
            ═══════════════════════════════════════════════════════════ */}
            <div>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <h2 className="font-comic text-xl text-comic-dark flex items-center gap-2">
                  📋 <span>Saved for Later</span>
                  <span className="comic-badge bg-comic-dark text-comic-yellow text-xs">
                    {savedItems.length}
                  </span>
                </h2>
                {savedItems.length > 0 && (
                  <button
                    onClick={handleAddAllToCart}
                    disabled={cartLoading}
                    className="comic-btn bg-comic-cyan text-comic-dark border-2 border-comic-dark px-3 py-1.5 text-xs font-comic rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
                  >
                    🛒 Add All to Cart
                  </button>
                )}
              </div>

              {/* Manual add form */}
              <form
                onSubmit={handleManualAdd}
                className="comic-panel p-4 mb-5 flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="text"
                  placeholder="Save an item for later..."
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="comic-input flex-1"
                />
                <div className="flex items-center border-3 border-comic-dark rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setManualQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-10 bg-comic-yellow hover:bg-yellow-300 flex items-center justify-center text-comic-dark font-bold"
                  >
                    <FaMinus className="h-3 w-3" />
                  </button>
                  <span className="w-10 h-10 flex items-center justify-center bg-white font-comic text-comic-dark border-x-2 border-comic-dark">
                    {manualQty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setManualQty((q) => q + 1)}
                    className="w-9 h-10 bg-comic-yellow hover:bg-yellow-300 flex items-center justify-center text-comic-dark font-bold"
                  >
                    <FaPlus className="h-3 w-3" />
                  </button>
                </div>
                <button type="submit" className="comic-btn-primary px-5 py-2 font-comic text-sm">
                  ➕ Save
                </button>
              </form>

              {/* Category filter pills */}
              {categories.length > 2 && (
                <div className="flex gap-2 flex-wrap mb-4">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilterCat(cat)}
                      className={`comic-badge text-xs cursor-pointer transition-all hover:scale-105 ${
                        filterCat === cat
                          ? "bg-comic-dark text-comic-yellow border-comic-dark"
                          : "bg-white text-comic-dark border-comic-dark/30 hover:border-comic-dark"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {/* Bulk actions */}
              {savedItems.length > 0 && (
                <div className="flex gap-2 mb-4 flex-wrap">
                  {checkedCount > 0 && (
                    <button
                      onClick={() => dispatch(clearCheckedItems())}
                      className="comic-btn bg-comic-red text-white border-2 border-comic-dark px-3 py-1.5 text-xs font-comic rounded-lg hover:scale-105 transition-transform"
                    >
                      🗑️ Remove Checked ({checkedCount})
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (window.confirm("Clear saved list?")) dispatch(clearShoppingList());
                    }}
                    className="comic-btn bg-white text-comic-dark border-2 border-comic-dark/30 px-3 py-1.5 text-xs font-comic rounded-lg hover:border-comic-red hover:text-comic-red transition-all"
                  >
                    🚮 Clear All
                  </button>
                </div>
              )}

              {/* Empty saved list */}
              {savedItems.length === 0 && (
                <div className="comic-panel p-8 text-center animate-pop-in">
                  <p className="text-4xl mb-2">📋</p>
                  <p className="font-comic text-comic-dark/60 text-sm">
                    No saved items — type above or use 🎤 voice to save items
                  </p>
                </div>
              )}

              {/* Grouped saved items */}
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="mb-5">
                  <h3 className="font-comic text-xs text-comic-dark/50 uppercase tracking-widest mb-2 px-1">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                          CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other
                        } ${item.checked ? "opacity-50" : ""}`}
                      >
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => dispatch(toggleShoppingItemChecked(item.id))}
                          className="w-5 h-5 rounded accent-comic-green cursor-pointer flex-shrink-0"
                        />

                        {/* Name */}
                        <span
                          className={`font-comic text-comic-dark flex-1 text-sm min-w-0 truncate ${
                            item.checked ? "line-through" : ""
                          }`}
                        >
                          {item.name}
                        </span>

                        {/* Qty controls */}
                        <div className="flex items-center border-2 border-comic-dark/30 rounded-lg overflow-hidden flex-shrink-0">
                          <button
                            onClick={() => handleQtyChange(item, -1)}
                            className="w-7 h-7 bg-comic-yellow/60 hover:bg-comic-yellow flex items-center justify-center font-bold text-comic-dark"
                          >
                            <FaMinus className="h-2.5 w-2.5" />
                          </button>
                          <span className="w-8 h-7 flex items-center justify-center font-comic text-sm bg-white border-x border-comic-dark/20">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQtyChange(item, 1)}
                            className="w-7 h-7 bg-comic-yellow/60 hover:bg-comic-yellow flex items-center justify-center font-bold text-comic-dark"
                          >
                            <FaPlus className="h-2.5 w-2.5" />
                          </button>
                        </div>

                        {/* Add to Cart button */}
                        <button
                          onClick={() => handleMoveToCart(item)}
                          disabled={cartLoading}
                          title="Move to cart"
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-comic-dark text-comic-yellow text-xs font-comic rounded-lg border-2 border-comic-dark hover:bg-gray-800 transition-all flex-shrink-0 disabled:opacity-50"
                        >
                          <FaShoppingCart className="h-3 w-3" />
                          <span className="hidden sm:inline">Add to Cart</span>
                        </button>

                        {/* Remove */}
                        <button
                          onClick={() => dispatch(removeShoppingItem(item.id))}
                          className="p-1.5 rounded-full hover:bg-comic-red/10 transition-all group flex-shrink-0"
                        >
                          <RiDeleteBin3Line className="h-4 w-4 text-gray-400 group-hover:text-comic-red" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShoppingListPage;
