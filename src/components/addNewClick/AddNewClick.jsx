import { useState } from "react";
import styles from "./AddNewClick.module.scss";
import axios from "axios";
import { Close } from "@mui/icons-material";
import { toast } from "react-toastify";

const names = [
  {
    type: "ptz",
    name: "ПТЗ камера",
  },
  {
    type: "obz",
    name: "Обзорний камера",
  },
  {
    type: "lis",
    name: " Распознавание лиц",
  },
  {
    type: "avto",
    name: "Распознавание авто номер",
  },
  {
    type: "radar",
    name: "Радар",
  },
];

export default function AddNewClick({
  setAddNewClickOpen,
  latitude,
  longitude,
  setTempMarkerClick,
}) {
  const [cameraType, setCameraType] = useState("");

  // STATE FOR CLOSING AND OPENING THIS MODAL
  const [closing, setClosing] = useState(false);

  // HANDLE SUBMIT FOR ADDING NEW CAMERA WITH DOUBLE CLICK
  const handleSubmit = async (e) => {
    e.preventDefault();
    const lat = parseFloat(latitude);
    const long = parseFloat(longitude);

    const data = {
      cameraType: cameraType,
      longitude: long,
      latitude: lat,
    };

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cameras`,
        data
      );

      setAddNewClickOpen(false);
      setTempMarkerClick(null);
      toast.success(res.data?.message);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  return (
    <div
      className={
        closing ? `${styles.addNewModalClosing}` : `${styles.addNewModal}`
      }
    >
      <div className={styles.card}>
        <div className={styles.top}>
          <h1>Добавить новую камеру</h1>
          <button
            onClick={() => {
              setAddNewClickOpen(false);
              setTempMarkerClick(null);
            }}
          >
            <Close />
          </button>
        </div>

        <div className={styles.closer} onClick={() => setClosing(!closing)}>
          <p></p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* INPUT GROUP FOR CAMERA TYPE SELECT  */}
          <div className={styles.inputGroup}>
            <label htmlFor="">Тип камеры</label>
            <select
              value={cameraType}
              onChange={(e) => setCameraType(e.target.value)}
              required={true}
            >
              <option value="" hidden>
                Выберите один
              </option>
              {names.map((name) => (
                <option key={name.type} value={name.type}>
                  {name.name}
                </option>
              ))}
            </select>
          </div>

          {/* INPUT GROUP FOR LATITUDE  */}
          <div className={styles.inputGroup}>
            <label htmlFor="">Координаты </label>
            <input type="text" value={`${latitude}, ${longitude}`} disabled />
          </div>

          <button>Сохранять</button>
        </form>
      </div>
    </div>
  );
}
