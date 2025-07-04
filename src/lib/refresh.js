import axios from "@/lib/axios";

export const refreshAccessToken = async () => {
  try {
    const res = await axios.post("/auth/refresh");

    return res.data.accessToken;
  } catch (err) {
    console.log("Refresh token error", err);
    return null;
  }
};
