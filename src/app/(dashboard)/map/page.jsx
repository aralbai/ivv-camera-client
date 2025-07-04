"use client";

import ProtectedRoutes from "@/components/protectedRoutes/ProtectedRoutes";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/mapView/MapView"), {
  ssr: false,
});

export default function MapPage() {
  return (
    <ProtectedRoutes allowedRoles={["admin", "user"]}>
      <div>
        <MapView />
      </div>
    </ProtectedRoutes>
  );
}
