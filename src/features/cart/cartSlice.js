import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/client";

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const res = await apiClient.get("/api/cart/");
  return res.data;
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },

  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const { setCartItems } = cartSlice.actions;

export default cartSlice.reducer;
