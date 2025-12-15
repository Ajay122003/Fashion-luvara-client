import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMyOrders } from "../../api/order";

/* ================= FETCH ORDERS ================= */
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async () => {
    const res = await getMyOrders();
    return res.data;
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    items: [],
    status: "idle", // idle | loading | succeeded | failed
  },
  reducers: {
    clearOrders: (state) => {
      state.items = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchOrders.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
