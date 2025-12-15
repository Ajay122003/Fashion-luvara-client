// src/features/wishlist/wishlistSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getWishlist } from "../../api/wishlist";

/* ================= FETCH WISHLIST ================= */
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async () => {
    const res = await getWishlist();
    return res.data;
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState: {
    items: [],
    status: "idle", // idle | loading | succeeded | failed
  },

  /* ================= LOCAL (OPTIMISTIC) REDUCERS ================= */
  reducers: {
    // 🔥 Optional: Optimistic toggle (NO fetch)
    toggleLocalWishlist: (state, action) => {
      const productId = action.payload;

      const index = state.items.findIndex(
        (item) => item.product_id === productId
      );

      if (index !== -1) {
        // remove from wishlist
        state.items.splice(index, 1);
      }
    },
  },

  /* ================= ASYNC REDUCERS ================= */
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchWishlist.rejected, (state) => {
        state.status = "failed";
      });
  },
});

/* ================= EXPORTS ================= */
export const { toggleLocalWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
