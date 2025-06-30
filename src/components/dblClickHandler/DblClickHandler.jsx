"use client";
import { useMapEvents } from "react-leaflet";

export default function DblClickHandler({ onDblClick }) {
  useMapEvents({
    dblclick(e) {
      onDblClick(e); // lat/lng eventni parentga uzatadi
    },
  });

  return null; // hech narsa chizmaydi
}
