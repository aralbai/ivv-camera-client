import { Close } from "@mui/icons-material";
import styles from "./DeleteModal.module.scss";
import axios from "axios";

export default function DeleteModal({
  deletedCameraId,
  setDeleteModalOpen,
  cameras,
  setCameras,
  setSelectedCamera,
  setDeletedCamereId,
}) {
  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/cameras/${deletedCameraId}`
      );

      const newCameras = cameras.filter(
        (camera) => camera._id !== deletedCameraId
      );

      setCameras(newCameras);
      setDeleteModalOpen(false);
      setSelectedCamera(true);
      setDeletedCamereId("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.deleteContainer}>
      <div className={styles.deleteModal}>
        <div className={styles.top}>
          <h1>Element will be delete?</h1>
          <button
            onClick={() => {
              setDeleteModalOpen(false);
              setSelectedCamera(true);
              setDeletedCamereId("");
            }}
          >
            <Close />
          </button>
        </div>

        <div className={styles.bottom}>
          <button onClick={handleDelete}>Delete</button>

          <button
            onClick={() => {
              setDeleteModalOpen(false);
              setSelectedCamera(true);
              setDeletedCamereId("");
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
