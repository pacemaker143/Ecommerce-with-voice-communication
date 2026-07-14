import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api";

// Create checkout session
export const createCheckout = createAsyncThunk(
  "checkout/createCheckout",
  async ({ checkoutItems, shippingAddress, paymentMethod, totalPrice }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/api/checkout", {
        checkoutItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Pay for checkout
export const payCheckout = createAsyncThunk(
  "checkout/payCheckout",
  async ({ id, paymentStatus, paymentDetails }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/api/checkout/${id}/pay`, {
        paymentStatus,
        paymentDetails,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCheckout: (state) => {
      state.checkout = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(payCheckout.pending, (state) => {
        state.loading = true;
      })
      .addCase(payCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = null;
      })
      .addCase(payCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
