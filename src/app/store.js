import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../features/admin/adminSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";

const store = configureStore({
  reducer: {
    admin: adminReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
