import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminLoginStep1, adminLoginVerifyOTP } from "../../api/admin";
import storage from "../../utils/storage";

/* =======================
   THUNKS
======================= */

export const adminLogin = createAsyncThunk(
  "admin/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await adminLoginStep1(email, password);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
        err.response?.data ||
        "Login failed"
      );
    }
  }
);

export const adminVerifyOTP = createAsyncThunk(
  "admin/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      return await adminLoginVerifyOTP(email, otp);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
        err.response?.data ||
        "OTP verification failed"
      );
    }
  }
);

/* =======================
   INITIAL STATE
======================= */

const initialState = {
  isAuthenticated: false,   // 🔥 redux-only
  loading: false,
  error: null,
  step: 1,                 // 1 = login, 2 = otp
  pendingEmail: "",
};

/* =======================
   SLICE
======================= */

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    adminLogout: (state) => {
      state.isAuthenticated = false;
      state.step = 1;
      state.pendingEmail = "";
      storage.clearAdminToken(); // ✅ allowed here
    },
  },
  extraReducers: (builder) => {
    builder
      /* LOGIN STEP 1 */
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
        state.error = action.payload;
      })

      /* OTP VERIFY */
      .addCase(adminVerifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminVerifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.step = 1;

        const { access, refresh } = action.payload.tokens;
        storage.saveAdminToken(access, refresh); // ✅ OK in thunk flow
      })
      .addCase(adminVerifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { adminLogout } = adminSlice.actions;
export default adminSlice.reducer;

