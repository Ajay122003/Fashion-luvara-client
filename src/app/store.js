import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../features/admin/adminSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import authReducer from "../features/auth/authSlice";
import categoryReducer from "../features/category/categorySlice";
import collectionReducer from "../features/collections/collectionSlice";
import cartReducer from "../features/cart/cartSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import orderReducer from "../features/order/orderSlice";

const store = configureStore({
  reducer: {
    admin: adminReducer,
    dashboard: dashboardReducer,
    auth: authReducer,
    cart: cartReducer,
    categories: categoryReducer,   //  Updated (plural + stable)
    collections: collectionReducer, 
    wishlist: wishlistReducer,
    orders: orderReducer,
  },
});

export default store;


