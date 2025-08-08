"use client";

import styles from "./MapView.module.scss";
import { MapContainer, TileLayer, Marker, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import Navbar from "../navbar/Navbar";
import AddNewModal from "../addNewModal/AddNewModal";
import axios from "axios";
import DblClickHandler from "../dblClickHandler/DblClickHandler";
import AddNewClick from "../addNewClick/AddNewClick";
import EditCameraModal from "../editCameraModal/EditCameraModal";
import DeleteModal from "../deleteModal/DeleteModal";
import { useUserContext } from "@/context/UserContext";
import RefreshIcon from "@mui/icons-material/Refresh";
import SingleCamera from "../singleCamera/SingleCamera";
import LayersIcon from "@mui/icons-material/Layers";
import LayersClearIcon from "@mui/icons-material/LayersClear";
import AddCameraIP from "../addCameraIP/AddCameraIP";
import StreamPage from "../streem/Streem";

export default function MapView() {
  const { user } = useUserContext();
  const [addNewModalOpen, setAddNewModalOpen] = useState(false);
  const [addNewClickOpen, setAddNewClickOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [selectedCamera, setSelectedCamera] = useState(true);

  const [tempMarker, setTempMarker] = useState(null);
  const [tempMarkerClick, setTempMarkerClick] = useState(null);

  const [cameras, setCameras] = useState([]);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [totalCameras, setTotalCameras] = useState(0);

  const [editableCamera, setEditableCamera] = useState();

  const [deleteModal, setDeleteModal] = useState(false);
  const [deletedCameraId, setDeletedCamereId] = useState("");

  const [viewCamera, setViewCamera] = useState(false);
  const [addCameraIPModal, setAddCameraIPModal] = useState(false);

  const [streemCamera, setStreemCamera] = useState(null)

  const [filters, setFilters] = useState({
    cameraType: "all",
    district: "all",
    mahalla: "all",
    startDate: new Date("2025-01-01"),
    endDate: new Date(),
  });

  // STATE FOR GEOJSON
  const [geojsonData, setGeojsonData] = useState(null);
  const [geojsonLayer, setGeojsonLayer] = useState(false);

  const mapRef = useRef(null);

  useEffect(() => {
    fetch("/data/qoraqalpogiston.geojson")
      .then((res) => res.json())
      .then((data) => setGeojsonData(data));
  }, []);

  const filteredGeojson = useMemo(() => {
    if (!geojsonData) return null;

    const filteredFeatures = geojsonData.features.filter((feature) => {
      const props = feature.properties;

      const districtMatch =
        filters.district !== "all" ? props.district === filters.district : true;

      const mahallaMatch =
        filters.mahalla !== "all" ? props.mahalla_no === filters.mahalla : true;

      return districtMatch && mahallaMatch;
    });

    return {
      ...geojsonData,
      features: filteredFeatures,
    };
  }, [geojsonData, filters, filters]);

  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.mahalla_no) {
      layer.bindTooltip(feature.properties.mahalla_no, {
        permanent: true,
        direction: "center",
        className: "mahalla-label",
      });
    }
  };

  const handlePreviewMarker = (marker) => {
    setTempMarker(marker);

    if (mapRef.current) {
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/cameras?cameraType=${filters.cameraType}&district=${filters.district}&mahalla=${filters.mahalla}&startDate=${filters.startDate}&endDate=${filters.endDate}`
        );

        setCameras(res.data?.data);
        setTotalCameras(res.data?.totalItems);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCameras();
  }, [
    filters,
    addNewModalOpen,
    addNewClickOpen,
    editModalOpen,
    deleteModal,
    addCameraIPModal,
  ]);

  const handleRefreshPage = () => {
    window.location.reload();
  };

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


  console.log(tempMarkerClick);


  return (
    <div
      className={styles.mapView}
      style={{ height: "100vh", width: "100%", pointerEvents: "auto" }}
    >
      <Navbar
        setAddNewModalOpen={setAddNewModalOpen}
        filters={filters}
        setFilters={setFilters}
        setAddNewClickOpen={setAddNewClickOpen}
        setTempMarkerClick={setTempMarkerClick}
        totalCameras={totalCameras}
      />

      <MapContainer
        ref={mapRef}
        center={[42.453, 59.6075]}
        zoom={12}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
        doubleClickZoom={false}
      >
        {user?.role === "admin" && (
          <DblClickHandler
            onDblClick={(e) => {
              const { lat, lng } = e.latlng;
              setLatitude(lat.toFixed(6));
              setLongitude(lng.toFixed(6));
              setTempMarkerClick([lat, lng]);
              setAddNewClickOpen(true);
              setAddNewModalOpen(false);
              setTempMarker(null);
            }}
          />
        )}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* SEPARATION MAHALLAS WITH GEOJSON FILE  */}
        {geojsonLayer && filteredGeojson && (
          <GeoJSON
            key={JSON.stringify(filters)}
            data={filteredGeojson}
            onEachFeature={onEachFeature}
          />
        )}

        {/* CAMERA MARKERS FOR ALL CAMERAS WITH ICONS  */}
        {cameras.map((camera) => (
          <Marker
            key={camera._id}
            position={[camera.position[1], camera.position[0]]} // [lat, lon]
            icon={getCameraIcon(camera.cameraType)}
          >
            {selectedCamera && (
              <SingleCamera
                camera={camera}
                setEditModalOpen={setEditModalOpen}
                editModalOpen={editModalOpen}
                setSelectedCamera={setSelectedCamera}
                setEditableCamera={setEditableCamera}
                setDeleteModal={setDeleteModal}
                setDeletedCamereId={setDeletedCamereId}
                setViewCamera={setViewCamera}
                setAddCameraIPModal={setAddCameraIPModal}
                setStreemCamera={setStreemCamera}
              />
            )}
          </Marker>
        ))}
        {/* BLUE LOCATION MARKER FOR  SHOWING NEW CAMERA'S LOCATION  */}
        {/* ADDING WITH ADD BUTTON  */}
        {tempMarker && (
          <Marker
            position={tempMarker.position}
            icon={L.icon({
              iconUrl: "/newCamera.png",
              iconSize: [40, 40],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32],
            })}
          ></Marker>
        )}
        {/* BLUE LOCATION MARKER FOR  SHOWING NEW CAMERA'S LOCATION  */}
        {/* ADDING WITH DOUBLE CLICK  */}
        {tempMarkerClick && (
          <Marker
            position={tempMarkerClick}
            icon={L.icon({
              iconUrl: "/newCamera.png",
              iconSize: [40, 40],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32],
            })}
          ></Marker>
        )}
        {/* RED LOCATION MARKER FOR SHOWING EDITABLE CAMERA'S NEW LOCATION */}
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
            {/* <Popup>
              <strong>Yangi joy</strong>
              <br />
            </Popup> */}
          </Marker>
        )}
      </MapContainer>

      {/* TURN ON/OFF GEOJSON  */}
      <div className={styles.geojsonLayer}>
        <button onClick={() => setGeojsonLayer(!geojsonLayer)}>
          {geojsonLayer ? <LayersClearIcon /> : <LayersIcon />}
        </button>
      </div>

      {/* REFRESH ICON FOR REFRESH THIS PAGE  */}
      <div className={styles.refresh}>
        <button onClick={handleRefreshPage}>
          <RefreshIcon />
        </button>
      </div>

      {/* ADD MODAL FOR ADD NEW BUTTON AND INPUTS  */}
      {addNewModalOpen && (
        <AddNewModal
          setAddNewModalOpen={setAddNewModalOpen}
          onPreviewMarker={handlePreviewMarker}
          setTempMarker={setTempMarker}
        />
      )}

      {/* ADD MODAL FOR DOUBLE CLICK  */}
      {addNewClickOpen && (
        <AddNewClick
          setAddNewClickOpen={setAddNewClickOpen}
          latitude={latitude}
          longitude={longitude}
          setTempMarkerClick={setTempMarkerClick}
        />
      )}

      {/* OPEN EDIT MODAL FOR EDITING CAMERA FROM HERE  */}
      {editModalOpen && (
        <EditCameraModal
          setEditModalOpen={setEditModalOpen}
          editableCamera={editableCamera}
          setEditableCamera={setEditableCamera}
          onPreviewMarker={handleEditPreviewMarker}
          setSelectedCamera={setSelectedCamera}
        />
      )}

      {/* OPEN DELETE MODAL FOR DELETING CAMERA FROM HERE */}
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

      {/* OPEN VIEW CAMERA IFRAME  */}
      {/* {viewCamera && <ViewCamera setViewCamera={setViewCamera} />} */}
      {viewCamera && <StreamPage setViewCamera={setViewCamera} streemCamera={streemCamera} setStreemCamera={setStreemCamera} />}

      {/* OPEN ADD CAMERA IP MODAL  */}
      {addCameraIPModal && (
        <AddCameraIP
          editableCamera={editableCamera}
          setEditableCamera={setEditableCamera}
          setAddCameraIPModal={setAddCameraIPModal}
        />
      )}
    </div>
  );
}
