import { Close } from "@mui/icons-material";
import styles from "./DeleteModal.module.scss";
import axios from "axios";
import { toast } from "react-toastify";

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
      toast.success("Камера добавлена!");
    } catch (err) {
      console.log(err);
      toast.error("Ошибка сервера!");
    }
  };

  return (
    <div className={styles.deleteContainer}>
      <div className={styles.deleteModal}>
        <div className={styles.top}>
          <h1>Вы уверены, что хотите удалить этот элемент?</h1>
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
          <button onClick={handleDelete}>Удалить</button>

          <button
            onClick={() => {
              setDeleteModalOpen(false);
              setSelectedCamera(true);
              setDeletedCamereId("");
            }}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
