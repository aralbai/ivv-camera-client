import { useEffect, useState } from "react";
import styles from "./AddCameraIP.module.scss";
import axios from "axios";
import { Close } from "@mui/icons-material";
import { toast } from "react-toastify";

export default function AddCameraIP({
  editableCamera,
  setEditableCamera,
  setAddCameraIPModal,
}) {
  const [cameraIP, setCameraIP] = useState("");
  const [cameraId, setCameraId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(cameraIP, cameraId);

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cameras/ip/${cameraId}`,
        { ip: cameraIP }
      );

      setAddCameraIPModal(false);
      setEditableCamera(null);
      toast.success(res.data?.message);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    setCameraId(editableCamera?._id);
    setCameraIP(editableCamera?.ip);
  }, [editableCamera]);

  return (
    <div className={styles.addNewModal}>
      <div className={styles.card}>
        <div className={styles.top}>
          <h1>Редактировать камеру</h1>
          <button
            onClick={() => {
              setAddCameraIPModal(false);
              setEditableCamera(null);
            }}
          >
            <Close />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="">Координаты</label>
            <input type="text" onChange={(e) => setCameraIP(e.target.value)} />
          </div>

          <button>Сохранять</button>
        </form>
      </div>
    </div>
  );
}
