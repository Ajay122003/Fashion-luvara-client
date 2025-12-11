import apiClient from "./client";

export const fetchCollections = () => apiClient.get("/api/collections/");

export const fetchCollectionProducts = (slug, params = {}) =>
  apiClient.get(`/api/collections/${slug}/`, { params });
