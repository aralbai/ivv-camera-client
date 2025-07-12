import { useEffect, useState } from "react";
import styles from "./EditCamera.module.scss";
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

export default function EditCamera({
  setEditModal,
  selectedCamera,
  setSelectedCamera,
}) {
  const [cameraType, setCameraType] = useState("");
  const [cameraId, setCameraId] = useState("");
  const [coordinates, setCoordinates] = useState({
    latitude: "",
    longitude: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const splitted = e.target.value.split(",").map((s) => s.trim());

    setCoordinates({
      latitude: splitted[0],
      longitude: splitted[1],
    });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const lat = parseFloat(coordinates.latitude);
    const long = parseFloat(coordinates.longitude);

    const err = handleError(lat, long);
    if (err) return;

    const data = {
      cameraType: cameraType,
      longitude: long,
      latitude: lat,
    };

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cameras/${cameraId}`,
        data
      );

      setEditModal(false);
      setSelectedCamera(null);
      toast.success(res.data?.message);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    setCameraId(selectedCamera?._id);
    setCameraType(selectedCamera?.cameraType);
    setCoordinates({
      latitude: selectedCamera?.position[1],
      longitude: selectedCamera?.position[0],
    });
  }, [selectedCamera]);

  return (
    <div className={styles.addNewModal}>
      <div className={styles.card}>
        <div className={styles.top}>
          <h1>Редактировать камеру</h1>
          <button
            onClick={() => {
              setEditModal(false);
              setSelectedCamera(null);
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
            <label htmlFor="">Координаты</label>
            <input type="text" onChange={(e) => handleChange(e)} />
          </div>

          <p>{error}</p>

          <button>Сохранять</button>
        </form>
      </div>
    </div>
  );
}
