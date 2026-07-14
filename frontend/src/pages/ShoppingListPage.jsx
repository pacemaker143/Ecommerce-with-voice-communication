import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addShoppingItem,
  removeShoppingItem,
  updateShoppingItemQty,
  toggleShoppingItemChecked,
  clearCheckedItems,
  clearShoppingList,
} from "../Redux/slices/voiceSlice";
import useVoiceRecognition from "../hooks/useVoiceRecognition";
import SmartSuggestions from "../components/Voice/SmartSuggestions";
import { toast } from "sonner";
import { HiMicrophone } from "react-icons/hi2";
import { RiDeleteBin3Line } from "react-icons/ri";
import { FaPlus, FaMinus } from "react-icons/fa";
import { HiOutlineClipboardList } from "react-icons/hi";

const CATEGORY_COLORS = {
  Dairy:          "bg-comic-cyan/20   border-comic-cyan",
  Fruits:         "bg-comic-green/20  border-comic-green",
  Vegetables:     "bg-comic-green/30  border-comic-green",
  Bakery:         "bg-comic-orange/20 border-comic-orange",
  "Meat & Seafood": "bg-comic-red/20  border-comic-red",
  Beverages:      "bg-comic-blue/20   border-comic-blue",
  Snacks:         "bg-comic-yellow/30 border-comic-yellow",
  Clothing:       "bg-comic-pink/20   border-comic-pink",
  "Personal Care":"bg-comic-purple/20 border-comic-purple",
  Household:      "bg-gray-100        border-gray-300",
  Other:          "bg-white           border-comic-dark/20",
};

const ShoppingListPage = () => {
  const dispatch = useDispatch();
  const { shoppingList, isListening, transcript, language } = useSelector((s) => s.voice);
  const [manualName, setManualName] = useState("");
  const [manualQty, setManualQty] = useState(1);
  const [filterCat, setFilterCat] = useState("All");
  const [activeTab, setActiveTab] = useState("list"); // "list" | "suggestions"

  const { startListening, stopListening } = useVoiceRecognition();

  // Group by category
  const categories = ["All", ...new Set(shoppingList.map((i) => i.category))];
  const displayed =
    filterCat === "All"
      ? shoppingList
      : shoppingList.filter((i) => i.category === filterCat);

  const grouped = displayed.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const checkedCount = shoppingList.filter((i) => i.checked).length;

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!manualName.trim()) return;
    dispatch(addShoppingItem({ name: manualName.trim(), quantity: manualQty }));
    toast.success(`✅ Added "${manualName.trim()}"`);
    setManualName("");
    setManualQty(1);
  };

  const handleQtyChange = (item, delta) => {
    const next = item.quantity + delta;
    if (next < 1) return;
    dispatch(updateShoppingItemQty({ name: item.name, quantity: next }));
  };

  return (
    <div className="min-h-screen bg-comic-cream py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-comic text-3xl text-comic-dark flex items-center gap-2">
              <HiOutlineClipboardList className="text-comic-yellow" />
              Shopping List
            </h1>
            <p className="text-sm font-body text-comic-dark/50 mt-1">
              {shoppingList.length} item{shoppingList.length !== 1 ? "s" : ""} ·{" "}
              {checkedCount} checked
            </p>
          </div>

          {/* Voice button */}
          <button
            onClick={isListening ? stopListening : startListening}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border-3 border-comic-dark font-comic text-sm shadow-comic transition-all hover:scale-105 ${
              isListening
                ? "bg-comic-red text-white animate-pulse shadow-comic-red"
                : "bg-comic-yellow text-comic-dark hover:bg-yellow-300"
            }`}
          >
            <HiMicrophone className="h-5 w-5" />
            {isListening ? "Stop Listening" : "🎤 Voice Command"}
          </button>
        </div>

        {/* Live transcript */}
        {isListening && (
          <div className="mb-4 p-3 bg-comic-red/10 border-3 border-comic-red rounded-xl text-center font-comic text-comic-red animate-pulse text-sm">
            🎤 {transcript || "Say something... e.g. 'Add 3 apples' or 'Remove milk'"}
          </div>
        )}

        {/* Voice command tips */}
        <div className="mb-5 p-3 bg-comic-yellow/20 border-2 border-comic-yellow rounded-xl text-xs font-body text-comic-dark/70 grid grid-cols-1 sm:grid-cols-2 gap-1">
          <span>🗣️ <strong>"Add 2 litres of milk"</strong> — add item with quantity</span>
          <span>🗣️ <strong>"Remove bread from my list"</strong> — remove item</span>
          <span>🗣️ <strong>"Find cotton shirts under $50"</strong> — voice search</span>
          <span>🗣️ <strong>"I need 5 oranges"</strong> — natural language add</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 border-b-3 border-comic-dark pb-2">
          <button
            onClick={() => setActiveTab("list")}
            className={`font-comic px-4 py-2 rounded-t-xl text-sm border-3 border-comic-dark transition-all ${
              activeTab === "list"
                ? "bg-comic-yellow text-comic-dark shadow-comic"
                : "bg-white text-comic-dark/60 hover:bg-comic-yellow/20"
            }`}
          >
            📋 My List ({shoppingList.length})
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
            {/* Manual add form */}
            <form
              onSubmit={handleManualAdd}
              className="comic-panel p-4 mb-5 flex flex-col sm:flex-row gap-3"
            >
              <input
                type="text"
                placeholder="Add item manually..."
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                className="comic-input flex-1"
              />
              <div className="flex items-center border-3 border-comic-dark rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setManualQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-10 bg-comic-yellow hover:bg-yellow-300 flex items-center justify-center text-comic-dark font-bold transition-colors"
                >
                  <FaMinus className="h-3 w-3" />
                </button>
                <span className="w-10 h-10 flex items-center justify-center bg-white font-comic text-comic-dark border-x-2 border-comic-dark">
                  {manualQty}
                </span>
                <button
                  type="button"
                  onClick={() => setManualQty((q) => q + 1)}
                  className="w-9 h-10 bg-comic-yellow hover:bg-yellow-300 flex items-center justify-center text-comic-dark font-bold transition-colors"
                >
                  <FaPlus className="h-3 w-3" />
                </button>
              </div>
              <button type="submit" className="comic-btn-primary px-5 py-2 font-comic text-sm">
                ➕ Add
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
            {shoppingList.length > 0 && (
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
                    if (window.confirm("Clear entire shopping list?"))
                      dispatch(clearShoppingList());
                  }}
                  className="comic-btn bg-white text-comic-dark border-2 border-comic-dark/30 px-3 py-1.5 text-xs font-comic rounded-lg hover:border-comic-red hover:text-comic-red transition-all"
                >
                  🚮 Clear All
                </button>
              </div>
            )}

            {/* Empty state */}
            {shoppingList.length === 0 && (
              <div className="comic-panel p-10 text-center animate-pop-in">
                <p className="text-5xl mb-3">🛒</p>
                <p className="font-comic text-xl text-comic-dark mb-2">Your list is empty!</p>
                <p className="font-body text-sm text-comic-dark/50 mb-4">
                  Add items manually above or use the 🎤 voice button
                </p>
              </div>
            )}

            {/* Grouped list */}
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-5">
                <h3 className="font-comic text-sm text-comic-dark/60 uppercase tracking-widest mb-2 px-1">
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
                        className={`font-comic text-comic-dark flex-1 text-sm ${
                          item.checked ? "line-through" : ""
                        }`}
                      >
                        {item.name}
                      </span>

                      {/* Quantity controls */}
                      <div className="flex items-center border-2 border-comic-dark/30 rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleQtyChange(item, -1)}
                          className="w-7 h-7 bg-comic-yellow/60 hover:bg-comic-yellow flex items-center justify-center font-bold text-comic-dark transition-colors"
                        >
                          <FaMinus className="h-2.5 w-2.5" />
                        </button>
                        <span className="w-8 h-7 flex items-center justify-center font-comic text-sm bg-white text-comic-dark border-x border-comic-dark/20">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQtyChange(item, 1)}
                          className="w-7 h-7 bg-comic-yellow/60 hover:bg-comic-yellow flex items-center justify-center font-bold text-comic-dark transition-colors"
                        >
                          <FaPlus className="h-2.5 w-2.5" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => dispatch(removeShoppingItem(item.id))}
                        className="p-1.5 rounded-full hover:bg-comic-red/10 hover:text-comic-red text-comic-dark/40 transition-all group flex-shrink-0"
                      >
                        <RiDeleteBin3Line className="h-4 w-4 group-hover:text-comic-red" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ShoppingListPage;
