"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const MapView = dynamic(() => import("@/components/mapView/MapView"), {
  ssr: false,
});

export default function MapPage() {
  return (
    <div>
      <MapView />
    </div>
  );
}
