// src/api/category.js
import publicClient from "./publicClient";  //  no token client

export const getCategories = async () => {
  const res = await publicClient.get("/api/categories/");
  return res.data;
};


export const getCategoryDetail = (slug) =>
  publicClient.get(`/api/categories/slug/${slug}/`);
