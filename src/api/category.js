import api from "./client";

export const getCategories = () => api.get("/api/categories/");

export const getCategoryDetail = (slug) =>
  api.get(`/api/categories/slug/${slug}/`);
