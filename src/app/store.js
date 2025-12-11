import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../features/admin/adminSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import authReducer from "../features/auth/authSlice";
import categoryReducer from "../features/category/categorySlice"; // ENABLED

const store = configureStore({
  reducer: {
    admin: adminReducer,
    dashboard: dashboardReducer,
    auth: authReducer,
    category: categoryReducer,   // MUST HAVE
  },
});

export default store;

