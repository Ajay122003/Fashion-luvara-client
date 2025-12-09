import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAdminDashboardStats } from "../../api/admin";

export const loadDashboardStats = createAsyncThunk(
  "dashboard/loadStats",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchAdminDashboardStats();
      return data;
    } catch (err) {
      return rejectWithValue("Failed to load dashboard stats");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    loading: false,
    error: null,
    stats: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(loadDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
