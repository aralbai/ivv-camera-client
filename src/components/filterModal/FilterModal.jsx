import DatePicker from "react-datepicker";
import styles from "./FilterModal.module.scss";
import FilterListIcon from "@mui/icons-material/FilterList";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";
import axios from "axios";

const names = {
  ptz: "ПТЗ камера",
  obz: "Обзорний камера",
  lis: " Распознавание лиц",
  avto: "Распознавание авто номер",
  radar: "Радар",
};

export default function FilterModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    const fetchCameras = async () => {
      const res = await axios.get("http://localhost:5000/api/cameras");

      setCameras(res.data);
    };

    fetchCameras();
  }, []);

  return (
    <div className={styles.filterModal}>
      <div className={styles.filter} onClick={() => setModalOpen(!modalOpen)}>
        <FilterListIcon />
        <p>Filter</p>
      </div>

      {modalOpen && (
        <ul className={styles.main}>
          <li>
            <label htmlFor="">Camera type</label>
            <select name="product">
              <option value="all">Все</option>

              {cameras.map((camera) => (
                <option key={camera._id}>{names[camera.cameraType]}</option>
              ))}
            </select>
          </li>

          <li>
            <label htmlFor="">Басланыўы</label>

            <DatePicker
              selected={new Date()}
              onChange={(date) =>
                setFilters((prev) => ({
                  ...prev,
                  startDate: new Date(date),
                }))
              }
              dateFormat="dd.MM.yyyy"
              className={styles.dateInput}
              wrapperClassName={styles.wrappedDateInput}
            />
          </li>
          <li>
            <label htmlFor="">Тамамланыўы</label>

            <DatePicker
              selected={new Date()}
              onChange={(date) =>
                setFilters((prev) => ({
                  ...prev,
                  endDate: new Date(date),
                }))
              }
              dateFormat="dd.MM.yyyy"
              className={styles.dateInput}
              wrapperClassName={styles.wrappedDateInput}
            />
          </li>
          <li className={styles.close} onClick={() => setModalOpen(false)}>
            <Close />
          </li>
        </ul>
      )}
    </div>
  );
}
