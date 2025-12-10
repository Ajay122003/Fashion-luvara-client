import { createSlice } from "@reduxjs/toolkit";
import storage from "../../utils/storage";

const token = storage.getToken();

const initialState = {
  user: null,
  token: token || null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      const { access, refresh } = action.payload;
      state.token = access;
      storage.saveToken(access, refresh);
    },

    setUser(state, action) {
      state.user = action.payload;
    },

    logout(state) {
      state.token = null;
      state.user = null;
      storage.removeToken();
    },
  },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
