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
import { Delete, Edit } from "@mui/icons-material";
import EditCameraModal from "../editCameraModal/EditCameraModal";
import DeleteModal from "../deleteModal/DeleteModal";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import LanguageIcon from "@mui/icons-material/Language";

const names = {
  ptz: "ПТЗ камера",
  obz: "Обзорний камера",
  lis: " Распознавание лиц",
  avto: "Распознавание авто номер",
  radar: "Радар",
};

export default function MapView() {
  const [addNewModalOpen, setAddNewModalOpen] = useState(false);
  const [addNewClickOpen, setAddNewClickOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [selectedCamera, setSelectedCamera] = useState(true);

  const [tempMarker, setTempMarker] = useState(null);
  const [tempMarkerClick, setTempMarkerClick] = useState(null);

  const [cameras, setCameras] = useState([]);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  const [editableCamera, setEditableCamera] = useState();

  const [deleteModal, setDeleteModal] = useState(false);
  const [deletedCameraId, setDeletedCamereId] = useState("");

  const [filters, setFilters] = useState({
    cameraType: "all",
    startDate: new Date("2025-01-01"),
    endDate: new Date(),
  });
  const mapRef = useRef(null);

  const handlePreviewMarker = (marker) => {
    setTempMarker(marker);

    if (mapRef.current) {
      console.log(mapRef);
      mapRef.current.flyTo(marker.position, 15, {
        duration: 1,
      });
    }
  };

  const handleEditPreviewMarker = (marker) => {
    setEditableCamera(marker);

    if (mapRef.current) {
      mapRef.current.flyTo(marker.position, 15, {
        duration: 1,
      });
    }
  };

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/cameras?cameraType=${filters.cameraType}&startDate=${filters.startDate}&endDate=${filters.endDate}`
        );

        setCameras(res.data?.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCameras();
  }, [filters, addNewModalOpen, addNewClickOpen, editModalOpen]);

  const getCameraIcon = (type) => {
    let iconUrl = "/icons/camera.png";

    if (type === "ptz") iconUrl = "/ptz.png";
    if (type === "obz") iconUrl = "/ptz.png";
    if (type === "radar") iconUrl = "/radar.png";
    if (type === "lis") iconUrl = "/lis.png";
    if (type === "avto") iconUrl = "/avto.png";

    return L.icon({
      iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  return (
    <div
      className={styles.mapView}
      style={{ height: "100vh", width: "100%", pointerEvents: "auto" }}
    >
      <Navbar
        setAddNewModalOpen={setAddNewModalOpen}
        filters={filters}
        setFilters={setFilters}
      />

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
            {selectedCamera && (
              <Popup>
                <div className={styles.cameraOption}>
                  <h1>{names[camera.cameraType]}</h1>
                  <p>
                    <LocationPinIcon /> <b>{camera.address}</b>
                  </p>
                  <p>
                    <LanguageIcon /> Широта: <b>{camera.position[1]}</b>
                  </p>
                  <p>
                    <LanguageIcon /> Долгота: <b>{camera.position[0]}</b>
                  </p>

                  <div>
                    <button
                      onClick={() => {
                        setEditModalOpen(!editModalOpen);
                        setSelectedCamera(false);
                        setEditableCamera({
                          _id: camera._id,
                          position: [camera.position[1], camera.position[0]],
                          cameraType: camera.cameraType,
                          address: camera.address,
                        });
                      }}
                    >
                      {/* <Edit /> */}
                      Редактировать
                    </button>

                    <button
                      onClick={() => {
                        setDeleteModal(!deleteModal);
                        setSelectedCamera(false);
                        setDeletedCamereId(camera._id);
                      }}
                    >
                      {/* <Delete /> */}
                      Удалить
                    </button>
                  </div>
                </div>
              </Popup>
            )}
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
              <strong>Новое место</strong>
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

        {/* MARKER FOR EDIT CAMERA 1 */}
        {editableCamera && (
          <Marker
            position={editableCamera.position}
            icon={L.icon({
              iconUrl: "/editCamera.png", // vaqtinchalik marker uchun alohida rasm
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
          setTempMarker={setTempMarker}
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

      {editModalOpen && (
        <EditCameraModal
          setEditModalOpen={setEditModalOpen}
          editableCamera={editableCamera}
          setEditableCamera={setEditableCamera}
          onPreviewMarker={handleEditPreviewMarker}
          setSelectedCamera={setSelectedCamera}
        />
      )}

      {deleteModal && (
        <DeleteModal
          deletedCameraId={deletedCameraId}
          setDeleteModalOpen={setDeleteModal}
          cameras={cameras}
          setCameras={setCameras}
          setSelectedCamera={setSelectedCamera}
          setDeletedCamereId={setDeletedCamereId}
        />
      )}
    </div>
  );
}
