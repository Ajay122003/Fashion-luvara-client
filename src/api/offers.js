
import publicClient from "./publicClient";

// PUBLIC – active offers list
export const fetchActiveOffers = () =>
  publicClient.get("/api/offers/");

// PUBLIC – single offer detail (slug based)
export const fetchOfferDetail = (slug) =>
  publicClient.get(`/api/offers/${slug}/`);

