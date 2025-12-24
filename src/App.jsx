import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import AppRoutes from "./routes/AppRoutes";

// API
import { getCategories } from "./api/category";
import { fetchCollections } from "./api/collections";
import { getMe } from "./api/auth";

// Redux
import { fetchCart } from "./features/cart/cartSlice";
import { setCategories } from "./features/category/categorySlice";
import { setCollections } from "./features/collections/collectionSlice";
import { setUser, logout, initAuth } from "./features/auth/authSlice";

// Utils
import storage from "./utils/storage";

const App = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  const user = useSelector((state) => state.auth.user);
  const token = storage.getUserToken();

  //  Prevent multiple public API calls (429 FIX)
  const hasLoadedPublicData = useRef(false);

  /* ================= LOAD PUBLIC DATA (ONCE) ================= */
  useEffect(() => {
    if (hasLoadedPublicData.current) return;
    hasLoadedPublicData.current = true;

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

    loadPublicData();
  }, [dispatch]);

  /* ================= INIT AUTH (ONCE) ================= */
  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  /* ================= RESTORE USER SESSION ================= */
  useEffect(() => {
    if (!token || user) return;

    const restoreUserSession = async () => {
      try {
        const res = await getMe();
        dispatch(setUser(res.data ?? res));
        dispatch(fetchCart());
      } catch {
        storage.clearUserToken();
        dispatch(logout());
      }
    };

    restoreUserSession();
  }, [dispatch, token, user]);
  
  
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <AppRoutes />;
};

export default App;
