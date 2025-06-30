"use client";

import styles from "./MapView.module.scss";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import Navbar from "../navbar/Navbar";
import AddNewModal from "../addNewModal/AddNewModal";
import axios from "axios";
import DblClickHandler from "../dblClickHandler/DblClickHandler";
import AddNewClick from "../addNewClick/AddNewClick";

export default function MapView() {
  const [addNewModalOpen, setAddNewModalOpen] = useState(false);
  const [addNewClickOpen, setAddNewClickOpen] = useState(false);
  const [tempMarker, setTempMarker] = useState(null);
  const [tempMarkerClick, setTempMarkerClick] = useState(null);
  const [cameras, setCameras] = useState([]);
  const mapRef = useRef(null);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  const handlePreviewMarker = (marker) => {
    setTempMarker(marker);

    if (mapRef.current) {
      console.log(mapRef);
      mapRef.current.flyTo(marker.position, 15, {
        duration: 1,
      });
    }
  };

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cameras");

        setCameras(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCameras();
  }, []);

  const getCameraIcon = (type) => {
    let iconUrl = "/icons/camera.png";

    if (type === "ptz") iconUrl = "/ptz.png";
    if (type === "radar") iconUrl = "/radar.png";
    if (type === "lis") iconUrl = "/lis.png";

    return L.icon({
      iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  console.log(addNewClickOpen);

  return (
    <div style={{ height: "100vh", width: "100%", pointerEvents: "auto" }}>
      <Navbar setAddNewModalOpen={setAddNewModalOpen} />

      <MapContainer
        ref={mapRef}
        center={[42.453, 59.6075]}
        zoom={12}
        // maxZoom={19}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
          console.log("✅ Map loaded:", mapInstance);
        }}
        doubleClickZoom={false}
      >
        <DblClickHandler
          onDblClick={(e) => {
            const { lat, lng } = e.latlng;
            console.log("📍 DblClick:", lat, lng); // endi bu ishlaydi
            setLatitude(lat.toFixed(6));
            setLongitude(lng.toFixed(6));
            setTempMarkerClick([lat, lng]);
            setAddNewClickOpen(true);
          }}
        />
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cameras.map((camera, i) => (
          <Marker
            key={i}
            position={[camera.position[1], camera.position[0]]} // [lat, lon]
            icon={getCameraIcon(camera.cameraType)}
          >
            <Popup>
              <b>{camera.cameraType.toUpperCase()}</b>
              <br />
              {camera.address}
            </Popup>
          </Marker>
        ))}

        {tempMarker && (
          <Marker
            position={tempMarker.position}
            icon={L.icon({
              iconUrl: "/newCamera.png", // vaqtinchalik marker uchun alohida rasm
              iconSize: [40, 40],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32],
            })}
          >
            <Popup>
              <strong>Yangi joy</strong>
              <br />
              {tempMarker.address}
            </Popup>
          </Marker>
        )}

        {tempMarkerClick && (
          <Marker
            position={tempMarkerClick}
            icon={L.icon({
              iconUrl: "/newCamera.png", // vaqtinchalik marker uchun alohida rasm
              iconSize: [40, 40],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32],
            })}
          >
            <Popup>
              <strong>Yangi joy</strong>
              <br />
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {addNewModalOpen && (
        <AddNewModal
          setAddNewModalOpen={setAddNewModalOpen}
          onPreviewMarker={handlePreviewMarker}
        />
      )}

      {addNewClickOpen && (
        <AddNewClick
          setAddNewClickOpen={setAddNewClickOpen}
          latitude={latitude}
          longitude={longitude}
          setTempMarkerClick={setTempMarkerClick}
        />
      )}
    </div>
  );
}
