"use client";
import { useMapEvents } from "react-leaflet";

export default function DblClickHandler({ onDblClick }) {
  useMapEvents({
    dblclick(e) {
      onDblClick(e);
    },
  });

  return null;
}
