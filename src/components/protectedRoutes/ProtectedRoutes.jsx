"use client";

import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoutes({ children, allowedRoles = [] }) {
  const { user, loading } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!allowedRoles.includes(user?.role)) {
        router.push("/unauthorized");
      }
    }
  }, [user, loading]);

  if (loading || !user)
    return (
      <div
        style={{
          position: "fixed",
          top: "0px",
          left: "0px",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Загрузка...</h1>
      </div>
    );
  if (!allowedRoles.includes(user?.role))
    return (
      <div
        style={{
          position: "fixed",
          top: "0px",
          left: "0px",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Перенаправление...</h1>
      </div>
    );

  return children;
}
