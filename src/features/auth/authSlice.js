import { createSlice } from "@reduxjs/toolkit";
import storage from "../../utils/storage";

const token = storage.getUserToken();

const initialState = {
  user: null,
  token: token || null,
  loading: false,
  initialized: false, // 🔥 VERY IMPORTANT
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initAuth(state) {
      state.token = storage.getUserToken();
      state.initialized = true;
    },

    setToken(state, action) {
      const { access, refresh } = action.payload;
      state.token = access;
      storage.saveUserToken(access, refresh);
    },

    setUser(state, action) {
      state.user = action.payload;
    },

    logout(state) {
      state.token = null;
      state.user = null;
      storage.clearUserToken();
    },
  },
});

export const { setToken, setUser, logout, initAuth } = authSlice.actions;
export default authSlice.reducer;
