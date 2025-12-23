import { createSlice } from "@reduxjs/toolkit";
import storage from "../../utils/storage";

const initialState = {
  user: null,
  token: null,
  loading: false,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initAuth(state) {
      const token = storage.getUserToken();
      state.token = token || null;
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
      state.initialized = true;
      storage.clearUserToken();
    },
  },
});

export const { setToken, setUser, logout, initAuth } = authSlice.actions;
export default authSlice.reducer;
