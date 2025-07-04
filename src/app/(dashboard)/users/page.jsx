import ProtectedRoutes from "@/components/protectedRoutes/ProtectedRoutes";
import React from "react";

export default function UsersPage() {
  return (
    <ProtectedRoutes allowedRoles={["admin"]}>
      <div>
        <h1>Users page</h1>
      </div>
    </ProtectedRoutes>
  );
}
