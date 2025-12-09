import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminLoginStep1, adminLoginVerifyOTP } from "../../api/admin";
import { saveAdminToken, clearAdminToken } from "../../utils/storage";

export const adminLogin = createAsyncThunk(
  "admin/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await adminLoginStep1(email, password);
      return data; // {message, admin_email}
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail || err.response?.data || "Login failed"
      );
    }
  }
);

export const adminVerifyOTP = createAsyncThunk(
  "admin/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const data = await adminLoginVerifyOTP(email, otp);
      return data; // {tokens}
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail || err.response?.data || "OTP verify failed"
      );
    }
  }
);

const initialState = {
  isAuthenticated: !!localStorage.getItem("admin_access_token"),
  loading: false,
  error: null,
  step: 1, // 1 = login, 2 = otp
  pendingEmail: "", // email for OTP step
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    adminLogout: (state) => {
      state.isAuthenticated = false;
      state.step = 1;
      state.pendingEmail = "";
      clearAdminToken();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.step = 2;
        state.pendingEmail = action.payload.admin_email;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(adminVerifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminVerifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.step = 1;
        const tokens = action.payload.tokens;
        saveAdminToken(tokens.access, tokens.refresh);
      })
      .addCase(adminVerifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "OTP verify failed";
      });
  },
});

export const { adminLogout } = adminSlice.actions;
export default adminSlice.reducer;
