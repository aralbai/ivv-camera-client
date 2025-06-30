import { useState } from "react";
import styles from "./AddNewClick.module.scss";
import axios from "axios";

export default function AddNewClick({
  setAddNewClickOpen,
  latitude,
  longitude,
  setTempMarkerClick,
}) {
  const [cameraType, setCameraType] = useState("");
  const [address, setAddress] = useState("");

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
          <button
            onClick={() => {
              setAddNewClickOpen(false);
              setTempMarkerClick(null);
            }}
          >
            X
          </button>
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
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="">Lat</label>
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              disabled
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="">Long</label>
            <input
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              disabled
            />
          </div>

          <button>Save</button>
        </form>
      </div>
    </div>
  );
}
