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

  return <div>Redirecting...</div>;
}
