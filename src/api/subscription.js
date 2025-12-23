import publicClient from "./publicClient";

export const subscribeEmail = async (email) => {
  const res = await publicClient.post("/api/subscribe/", { email });
  return res.data;
};
