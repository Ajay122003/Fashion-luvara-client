
import publicClient from "./publicClient";


// ---------------- PUBLIC ----------------
// ---------------- PUBLIC ----------------
;

// PUBLIC – active offers
export const fetchActiveOffers = () =>
  publicClient.get("/api/offers/");

