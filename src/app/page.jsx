"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import Loading from "@/components/loading/Loading";

export default function Home() {
  const { user, loading } = useUserContext();
  const router = useRouter();

  console.log(loading);

  useEffect(() => {
    if (loading) return;

    if (user) {
      if (user.role === "admin" || user.role === "user") {
        router.push("/map");
      } else {
        router.push("/unauthorized");
      }
    } else {
      router.push("/login");
    }
  }, [user, loading, router]);

  return <Loading />;
}
