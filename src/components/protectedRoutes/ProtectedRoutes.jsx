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

  if (loading || !user) return <div>Loading...</div>;
  if (!allowedRoles.includes(user?.role)) return <div>Redirecting...</div>;

  return children;
}
