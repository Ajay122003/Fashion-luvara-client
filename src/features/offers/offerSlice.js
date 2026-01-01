import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAdminOffers } from "../../api/admin";

/* ================= ASYNC THUNK ================= */
export const loadOffers = createAsyncThunk(
  "offers/loadOffers",
  async () => {
    const data = await fetchAdminOffers();

    // handle both paginated & non-paginated
    return data.results ? data.results : data;
  }
);

/* ================= SLICE ================= */
const offerSlice = createSlice({
  name: "offers",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadOffers.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default offerSlice.reducer;
