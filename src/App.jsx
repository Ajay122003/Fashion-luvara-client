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
import { setUser } from "./features/auth/authSlice";

// Utils
import storage from "./utils/storage";

const App = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const userToken = storage.getUserToken();

  // 🔒 Prevent multiple public API calls (429 FIX)
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

  /* ================= RESTORE USER SESSION ================= */
  useEffect(() => {
    if (!userToken || user) return;

    const restoreUserSession = async () => {
      try {
        const res = await getMe();
        dispatch(setUser(res.data));   // ✅ CORRECT
        dispatch(fetchCart());         // load cart after auth
      } catch (err) {
        // ❌ Token expired / invalid
        storage.clearUserToken();
      }
    };

    restoreUserSession();
  }, [dispatch, userToken, user]);

  return <AppRoutes />;
};

export default App;
