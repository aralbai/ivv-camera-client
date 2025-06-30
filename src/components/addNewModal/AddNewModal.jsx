import { useState } from "react";
import styles from "./AddNewModal.module.scss";
import axios from "axios";

export default function AddNewModal({ setAddNewModalOpen, onPreviewMarker }) {
  const [cameraType, setCameraType] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [error, setError] = useState("");

  const handleError = (lat, long) => {
    let newErrors = "";
    let hasError = false;

    if (isNaN(long)) {
      newErrors = "Longgitude raqam bo‘lishi kerak.";
      hasError = true;
    } else if (long < 55 || long > 74.5) {
      newErrors =
        "Longitude faqat O‘zbekiston hududida bo‘lishi kerak (55–74.5).";
      hasError = true;
    }

    if (isNaN(lat)) {
      newErrors = "Latitude raqam bo‘lishi kerak.";
      hasError = true;
    } else if (lat < 37 || lat > 46.5) {
      newErrors =
        "Latitude faqat O‘zbekiston hududida bo‘lishi kerak (37–46.5).";
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
    // e.preventDefault();
    const lat = parseFloat(latitude);
    const long = parseFloat(longitude);

    const data = {
      cameraType: cameraType,
      address: address,
      longitude: long,
      latitude: lat,
    };

    try {
      const res = await axios.post("http://localhost:5000/api/cameras", data);

      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.addNewModal}>
      <div className={styles.card}>
        <div className={styles.top}>
          <h1>Add New Camera</h1>
          <button onClick={() => setAddNewModalOpen(false)}>X</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="">Camera type</label>
            <select
              value={cameraType}
              onChange={(e) => setCameraType(e.target.value)}
              required
            >
              <option value="ptz">PTZ</option>
              <option value="radar">Radar</option>
              <option value="lis">Lis</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="">Adress</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="">Lat</label>
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="">Long</label>
            <input
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
            />
          </div>

          <p>{error}</p>

          <button type="button" onClick={handleShow}>
            Show in map
          </button>

          <button>Save</button>
        </form>
      </div>
    </div>
  );
}
