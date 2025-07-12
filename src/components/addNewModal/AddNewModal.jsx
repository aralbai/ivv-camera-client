import { useState } from "react";
import styles from "./AddNewModal.module.scss";
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

export default function AddNewModal({
  setAddNewModalOpen,
  onPreviewMarker,
  setTempMarker,
}) {
  const [cameraType, setCameraType] = useState("");
  const [coordinates, setCoordinates] = useState({
    latitude: "",
    longitude: "",
  });
  const [error, setError] = useState("");

  const [closing, setClosing] = useState(false);

  const handleChange = (e) => {
    const splitted = e.target.value.split(",");
    setCoordinates({
      latitude: splitted[0],
      longitude: splitted[1],
    });
  };

  // CHECK LATITUDE AND LONGITUDE HERE
  const handleError = (lat, long) => {
    let newErrors = "";
    let hasError = false;

    if (isNaN(long)) {
      newErrors = "Долгота должна быть числом.";
      hasError = true;
    } else if (long < 55 || long > 74.5) {
      newErrors =
        "Долгота должна быть только в пределах Узбекистана (55–74,5).";
      hasError = true;
    }

    if (isNaN(lat)) {
      newErrors = "Широта должна быть числом.";
      hasError = true;
    } else if (lat < 37 || lat > 46.5) {
      newErrors = "Широта должна быть только в пределах Узбекистана (37–46,5).";
      hasError = true;
    }

    setError(newErrors);
    if (hasError) return true;
  };

  const handleShow = (e) => {
    const lat = parseFloat(coordinates.latitude);
    const long = parseFloat(coordinates.longitude);

    const resultError = handleError(lat, long);
    if (resultError) return;

    const newCamera = {
      position: [lat, long],
      cameraType,
    };

    onPreviewMarker(newCamera);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const lat = parseFloat(coordinates.latitude);
    const long = parseFloat(coordinates.longitude);

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

      setAddNewModalOpen(false);
      setTempMarker(null);
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
              setAddNewModalOpen(false);
              setTempMarker(null);
            }}
          >
            <Close />
          </button>
        </div>

        {/* OPENENING AND CLOSING THIS MODAL FROM HERE  */}
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
            <label htmlFor="">Координаты</label>
            <input type="text" onChange={(e) => handleChange(e)} required />
          </div>

          {/* ERRORS WILL SHOW HERE  */}
          <p>{error}</p>

          {/* BUTTON FOR DEMONSTRATING CURRENT LOCATION  */}
          <button type="button" onClick={handleShow}>
            Показать на карте
          </button>

          <button>Сохранять</button>
        </form>
      </div>
    </div>
  );
}
