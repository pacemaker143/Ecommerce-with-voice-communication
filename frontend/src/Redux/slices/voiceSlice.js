import { createSlice } from "@reduxjs/toolkit";

// Auto-categorize an item name into a shopping category
const categorizeItem = (name) => {
  const lower = name.toLowerCase();
  if (/milk|cheese|yogurt|butter|cream|dairy/.test(lower)) return "Dairy";
  if (/apple|banana|orange|grape|berry|fruit|mango|peach|plum|lemon|lime/.test(lower)) return "Fruits";
  if (/carrot|spinach|tomato|onion|garlic|pepper|lettuce|broccoli|vegetable|veggie/.test(lower)) return "Vegetables";
  if (/bread|bagel|muffin|croissant|roll|bun|loaf|bake/.test(lower)) return "Bakery";
  if (/chicken|beef|pork|lamb|turkey|fish|salmon|tuna|shrimp|meat|seafood/.test(lower)) return "Meat & Seafood";
  if (/water|juice|soda|coffee|tea|drink|beverage|cola|beer|wine/.test(lower)) return "Beverages";
  if (/chips|cookie|candy|chocolate|snack|popcorn|cracker|pretzel/.test(lower)) return "Snacks";
  if (/shirt|pants|jeans|jacket|dress|shoes|socks|hat|coat|top|bottom|wear/.test(lower)) return "Clothing";
  if (/toothpaste|shampoo|soap|lotion|deodorant|razor|sanitizer/.test(lower)) return "Personal Care";
  if (/detergent|cleaner|sponge|tissue|towel|toilet/.test(lower)) return "Household";
  return "Other";
};

// Load persisted list from localStorage
const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem("voiceShoppingList");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (items) => {
  try {
    localStorage.setItem("voiceShoppingList", JSON.stringify(items));
  } catch {}
};

const voiceSlice = createSlice({
  name: "voice",
  initialState: {
    shoppingList: loadFromStorage(),
    isListening: false,
    transcript: "",
    language: "en-US",
    lastCommand: null,
    suggestions: [],
  },
  reducers: {
    // Shopping list management
    addShoppingItem: (state, action) => {
      const { name, quantity = 1, note = "" } = action.payload;
      const existing = state.shoppingList.find(
        (i) => i.name.toLowerCase() === name.toLowerCase()
      );
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.shoppingList.push({
          id: `item_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          name,
          quantity,
          category: categorizeItem(name),
          checked: false,
          note,
          addedAt: new Date().toISOString(),
        });
      }
      saveToStorage(state.shoppingList);
    },

    removeShoppingItem: (state, action) => {
      const nameOrId = action.payload.toLowerCase();
      state.shoppingList = state.shoppingList.filter(
        (i) =>
          i.id !== action.payload &&
          i.name.toLowerCase() !== nameOrId
      );
      saveToStorage(state.shoppingList);
    },

    updateShoppingItemQty: (state, action) => {
      const { name, quantity } = action.payload;
      const item = state.shoppingList.find(
        (i) => i.name.toLowerCase() === name.toLowerCase()
      );
      if (item) {
        item.quantity = Math.max(1, quantity);
        saveToStorage(state.shoppingList);
      }
    },

    toggleShoppingItemChecked: (state, action) => {
      const item = state.shoppingList.find((i) => i.id === action.payload);
      if (item) {
        item.checked = !item.checked;
        saveToStorage(state.shoppingList);
      }
    },

    clearCheckedItems: (state) => {
      state.shoppingList = state.shoppingList.filter((i) => !i.checked);
      saveToStorage(state.shoppingList);
    },

    clearShoppingList: (state) => {
      state.shoppingList = [];
      saveToStorage([]);
    },

    // Voice state management
    setListening: (state, action) => {
      state.isListening = action.payload;
    },

    setTranscript: (state, action) => {
      state.transcript = action.payload;
    },

    setLanguage: (state, action) => {
      state.language = action.payload;
    },

    setLastCommand: (state, action) => {
      state.lastCommand = action.payload;
    },

    setSuggestions: (state, action) => {
      state.suggestions = action.payload;
    },
  },
});

export const {
  addShoppingItem,
  removeShoppingItem,
  updateShoppingItemQty,
  toggleShoppingItemChecked,
  clearCheckedItems,
  clearShoppingList,
  setListening,
  setTranscript,
  setLanguage,
  setLastCommand,
  setSuggestions,
} = voiceSlice.actions;

export default voiceSlice.reducer;
