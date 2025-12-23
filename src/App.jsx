import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "./routes/AppRoutes";

import { getCategories } from "./api/category";
import { fetchCollections } from "./api/collections";
import { getMe } from "./api/auth";

import { fetchCart } from "./features/cart/cartSlice";
import { setCategories } from "./features/category/categorySlice";
import { setCollections } from "./features/collections/collectionSlice";
import { setUser } from "./features/auth/authSlice";
import { initAuth } from "./features/auth/authSlice";
import storage from "./utils/storage";

const App = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const userToken = storage.getUserToken();

  /* ================= LOAD PUBLIC DATA ================= */
  const loadPublicData = async () => {
    try {
      const categories = await getCategories();
      dispatch(setCategories(categories.data ?? categories));

      const collections = await fetchCollections();
      dispatch(setCollections(collections.data ?? collections));
    } catch (err) {
      console.error("Failed to load public data", err);
    }
  };

  /* ================= RESTORE USER SESSION ================= */
  const restoreUserSession = async () => {
    if (!userToken || user) return;

    try {
      const me = await getMe();
      dispatch(setUser(me));
      dispatch(fetchCart());
    } catch {
      // token invalid → clear only user token
      storage.clearUserToken();
    }
  };

  useEffect(() => {
    loadPublicData();
    restoreUserSession();
  }, []);

  
  useEffect(() => {
    dispatch(initAuth()); // 
  }, [dispatch]);

  return <AppRoutes />;
};

export default App;
