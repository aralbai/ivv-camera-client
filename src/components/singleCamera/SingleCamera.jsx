import styles from "./SingleCamera.module.scss";
import { useUserContext } from "@/context/UserContext";
import { names } from "@/data/data";
import { Popup } from "react-leaflet";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import LanguageIcon from "@mui/icons-material/Language";

export default function SingleCamera({
  camera,
  setEditModalOpen,
  setSelectedCamera,
  setEditableCamera,
  setDeleteModal,
  setDeletedCamereId,
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

        {user?.role === "admin" && (
          <div>
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
              Редактировать
            </button>

            <button
              onClick={() => {
                setDeleteModal(true);
                setSelectedCamera(false);
                setDeletedCamereId(camera._id);
              }}
            >
              Удалить
            </button>
          </div>
        )}
      </div>
    </Popup>
  );
}
