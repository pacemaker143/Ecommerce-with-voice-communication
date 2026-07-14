import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api";

// Helper to get guestId
const getGuestId = () => localStorage.getItem("guestId") || `guest_${Date.now()}`;

// Fetch cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const userId = auth.user?._id;
      const guestId = auth.guestId;
      const params = userId ? { userId } : { guestId };
      const { data } = await API.get("/api/cart", { params });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Add to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity, size, color }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const userId = auth.user?._id;
      const guestId = auth.guestId || getGuestId();
      const { data } = await API.post("/api/cart", {
        productId,
        quantity,
        size,
        color,
        userId,
        guestId,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update cart item quantity
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity, size, color }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const userId = auth.user?._id;
      const guestId = auth.guestId;
      const { data } = await API.put("/api/cart", {
        productId,
        quantity,
        size,
        color,
        userId,
        guestId,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Remove from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, size, color }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const userId = auth.user?._id;
      const guestId = auth.guestId;
      const { data } = await API.delete("/api/cart", {
        data: { productId, size, color, userId, guestId },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Merge guest cart into user cart
export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const guestId = auth.guestId;
      const { data } = await API.post("/api/cart/merge", { guestId });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // addToCart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateCartItem
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      // removeFromCart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      // mergeCart
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
