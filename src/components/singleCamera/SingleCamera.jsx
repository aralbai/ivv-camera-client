import styles from "./SingleCamera.module.scss";
import { useUserContext } from "@/context/UserContext";
import { names } from "@/data/data";
import { Popup } from "react-leaflet";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import LanguageIcon from "@mui/icons-material/Language";
import { AddCircle, Delete, Edit, Visibility } from "@mui/icons-material";
import DnsIcon from "@mui/icons-material/Dns";

export default function SingleCamera({
  camera,
  setEditModalOpen,
  setSelectedCamera,
  setEditableCamera,
  setDeleteModal,
  setDeletedCamereId,
  setViewCamera,
  setAddCameraIPModal,
}) {
  const { user } = useUserContext();

  return (
    <Popup>
      <div className={styles.singleCamera}>
        <h1>{names[camera.cameraType]}</h1>
        <p>
          <LocationPinIcon />
          <b>
            {camera.district}, {camera.mahalla}
          </b>
        </p>
        <p>
          <LanguageIcon /> Широта: <b>{camera.position[1]}</b>
        </p>
        <p>
          <LanguageIcon /> Долгота: <b>{camera.position[0]}</b>
        </p>
        <p>
          <DnsIcon /> IP: <b>{camera?.ip}</b>
        </p>

        {user?.role === "admin" && (
          <div>
            <button onClick={() => setViewCamera(true)}>
              <Visibility />
            </button>

            <button
              onClick={() => {
                setAddCameraIPModal(true);
                setEditableCamera({
                  _id: camera._id,
                  position: [camera.position[1], camera.position[0]],
                  cameraType: camera.cameraType,
                  ip: camera.ip,
                });
              }}
            >
              <AddCircle />
            </button>

            <button
              onClick={() => {
                setEditModalOpen(true);
                setSelectedCamera(false);
                setEditableCamera({
                  _id: camera._id,
                  position: [camera.position[1], camera.position[0]],
                  cameraType: camera.cameraType,
                });
              }}
            >
              <Edit />
            </button>

            <button
              onClick={() => {
                setDeleteModal(true);
                setSelectedCamera(false);
                setDeletedCamereId(camera._id);
              }}
            >
              <Delete />
            </button>
          </div>
        )}
      </div>
    </Popup>
  );
}
