import React, { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useDispatch } from "react-redux";

import apiClient from "./api/client";
import { getCategories } from "./api/category";
import { fetchCollections } from "./api/collections";

import { fetchCart } from "./features/cart/cartSlice"; 
import { setCategories } from "./features/category/categorySlice";
import { setCollections } from "./features/collections/collectionSlice";

const App = () => {
  const dispatch = useDispatch();

  const loadInitialData = async () => {
    try {
      // Load Categories
      const catRes = await getCategories();
      dispatch(setCategories(catRes.data));

      // Load Collections
      const colRes = await fetchCollections();
      dispatch(setCollections(colRes.data));

      // Load Cart Items Count
      dispatch(fetchCart());

    } catch (err) {
      console.error("Failed to load initial data", err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  return <AppRoutes />;
};

export default App;
