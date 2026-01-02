import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/client";
import storage from "../../utils/storage";

/* ================= FETCH CART ================= */
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    const token = storage.getUserToken();

    //  DO NOT CALL API IF NOT LOGGED IN
    if (!token) {
      return rejectWithValue("User not logged in");
    }

    try {
      const res = await apiClient.get("/api/cart/");
      return res.data; // { items, summary }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to load cart"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    summary: {
      subtotal: "0.00",
      total_items: 0,
      total_quantity: 0,
    },
    status: "idle",
    error: null,
  },

  reducers: {
    clearCart(state) {
      state.items = [];
      state.summary = {
        subtotal: "0.00",
        total_items: 0,
        total_quantity: 0,
      };
      state.status = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ===== FETCH CART ===== */
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })

      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.summary = action.payload.summary || {
          subtotal: "0.00",
          total_items: 0,
          total_quantity: 0,
        };
        state.status = "succeeded";
        state.error = null;
      })

      .addCase(fetchCart.rejected, (state, action) => {
        // 🔥 USER NOT LOGGED IN → SILENT RESET
        if (action.payload === "User not logged in") {
          state.items = [];
          state.summary = {
            subtotal: "0.00",
            total_items: 0,
            total_quantity: 0,
          };
          state.status = "idle";
          state.error = null;
        } else {
          state.status = "failed";
          state.error = action.payload;
        }
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
