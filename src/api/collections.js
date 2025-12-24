// src/api/collections.js
import publicClient from "./publicClient";  //  no token

// Get all collections (public)
export const fetchCollections = () =>
  publicClient.get("/api/collections/");

// Get products inside a single collection
export const fetchCollectionProducts = (slug) =>
  publicClient.get(`/api/collections/slug/${slug}/`);
