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
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [error, setError] = useState("");

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
    e.preventDefault();
    const lat = parseFloat(latitude);
    const long = parseFloat(longitude);

    const resultError = handleError(lat, long);
    if (resultError) return;

    const newCamera = {
      position: [lat, long],
      cameraType,
      address,
    };

    onPreviewMarker(newCamera);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lat = parseFloat(latitude);
    const long = parseFloat(longitude);

    const data = {
      cameraType: cameraType,
      address: address,
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
    <div className={styles.addNewModal}>
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

        <form onSubmit={handleSubmit}>
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

          <div className={styles.inputGroup}>
            <label htmlFor="">Адрес</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="">Широта</label>
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="">Долгота</label>
            <input
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
            />
          </div>

          <p>{error}</p>

          <button type="button" onClick={handleShow}>
            Показать на карте
          </button>

          <button>Сохранять</button>
        </form>
      </div>
    </div>
  );
}
