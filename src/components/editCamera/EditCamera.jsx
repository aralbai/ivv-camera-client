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
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const lat = parseFloat(latitude);
    const long = parseFloat(longitude);

    const err = handleError(lat, long);
    if (err) return;

    const data = {
      cameraType: cameraType,
      address: address,
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
    setAddress(selectedCamera?.address);
    setLatitude(parseFloat(selectedCamera?.position[1]));
    setLongitude(parseFloat(selectedCamera?.position[0]));
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

          <button>Сохранять</button>
        </form>
      </div>
    </div>
  );
}
