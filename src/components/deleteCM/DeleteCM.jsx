import { Close } from "@mui/icons-material";
import styles from "./DeleteCM.module.scss";
import axios from "axios";
import { toast } from "react-toastify";

export default function DeleteCM({
  selectedCameraId,
  setSelectedCameraId,
  setDeleteModal,
}) {
  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/cameras/${selectedCameraId}`
      );

      setDeleteModal(false);
      setSelectedCameraId("");
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
              setDeleteModal(false);
              setSelectedCameraId("");
            }}
          >
            <Close />
          </button>
        </div>

        <div className={styles.bottom}>
          <button onClick={handleDelete}>Удалить</button>

          <button
            onClick={() => {
              setDeleteModal(false);
              setSelectedCameraId("");
            }}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
