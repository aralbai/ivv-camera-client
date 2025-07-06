"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";

export default function Home() {
  const { user } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role === "admin" || user.role === "user") {
        router.push("/map");
      } else {
        router.push("/unauthorized");
      }
    } else {
      router.push("/login");
    }
  }, [user, router]);

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
}
