"use client";

import { createContext, useState, useEffect, useContext } from "react";
import axios from "@/lib/axios";
import { refreshAccessToken } from "@/lib/refresh";

const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      // 1. Refresh access token
      const token = await refreshAccessToken();
      if (!token) {
        setUser(null);
        setAccessToken(null);
        return;
      }

      setAccessToken(token);

      // 2. Get user data
      const res = await axios.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
    } catch (err) {
      console.error("Fetch user error:", err);
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  // `useEffect` bu yerda `accessToken` o'zgarganda axios headersini yangilash uchun ishlatiladi
  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
  }, [accessToken]);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        setAccessToken,
        loading,
        refreshAccessToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
