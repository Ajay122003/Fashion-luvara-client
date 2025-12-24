import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getWishlist } from "../../api/wishlist";

/* ================= FETCH WISHLIST ================= */
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async () => {
    return await getWishlist(); // ✅ FIXED
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState: {
    items: [],
    status: "idle",
  },

  reducers: {
    toggleLocalWishlist: (state, action) => {
      const productId = action.payload;

      const index = state.items.findIndex(
        (item) => item.product_id === productId
      );

      if (index !== -1) {
        state.items.splice(index, 1);
      } else {
        state.items.unshift({ product_id: productId });
      }
    },
  },

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

export const { toggleLocalWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

