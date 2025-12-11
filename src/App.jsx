import React, { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useDispatch } from "react-redux";
import { getCategories } from "./api/category";
import { setCategories } from "./features/category/categorySlice";

const App = () => {
  const dispatch = useDispatch();

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      dispatch(setCategories(res.data));
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return <AppRoutes />;
};

export default App;
