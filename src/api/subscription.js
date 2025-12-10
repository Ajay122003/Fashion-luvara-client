import apiClient from "./client";

export const subscribeEmail = async (email) => {
  return apiClient.post("/api/subscribe/", { email });
};
