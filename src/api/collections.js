import apiClient from "./client";

// Get all collections (public)
export const fetchCollections = () =>
  apiClient.get("/api/collections/");

// Get products inside a single collection
export const fetchCollectionProducts = (slug) =>
  apiClient.get(`/api/collections/slug/${slug}/`);
