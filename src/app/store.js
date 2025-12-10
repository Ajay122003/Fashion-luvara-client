import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../features/admin/adminSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";

import authReducer from "../features/auth/authSlice";       // ADD
// import cartReducer from "../features/cart/cartSlice";       // ADD
// import wishlistReducer from "../features/wishlist/wishlistSlice"; // ADD
// import categoryReducer from "../features/category/categorySlice"; // ADD

const store = configureStore({
  reducer: {
    admin: adminReducer,
    dashboard: dashboardReducer,

    auth: authReducer,         // FIX #1
    // cart: cartReducer,         // FIX #2
    // wishlist: wishlistReducer, // FIX #3
    // category: categoryReducer, // FIX #4
  },
});

export default store;
