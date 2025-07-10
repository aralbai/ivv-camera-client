"use client";

import DatePicker from "react-datepicker";
import styles from "./FilterModal.module.scss";
import FilterListIcon from "@mui/icons-material/FilterList";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";
import { qoraqalpogiston } from "@/data/data";

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
    name: "Распознавание авто",
  },
  {
    type: "radar",
    name: "Радар",
  },
];

const cameraTypes = {
  all: "Все",
  ptz: "ПТЗ камера",
  obz: "Обзорний камера",
  lis: " Распознавание лиц",
  avto: "Распознавание авто",
  radar: "Радар",
};

export default function FilterModal({ filters, setFilters, totalCameras }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [filteredMahalla, setFilteredMahalla] = useState([]);

  useEffect(() => {
    if (filters.district === "all") {
      setFilteredMahalla([]);
    } else {
      const current = qoraqalpogiston.find(
        (one) => one.district === filters.district
      );
      setFilteredMahalla(current);
    }
  }, [filters]);

  return (
    <div className={styles.filterModal}>
      <div className={styles.filter} onClick={() => setModalOpen(!modalOpen)}>
        <FilterListIcon />
        <p>
          {cameraTypes[filters.cameraType]}: {totalCameras}
        </p>
      </div>

      {modalOpen && (
        <ul className={styles.main}>
          <li>
            <label htmlFor="">Тип камеры</label>
            <select
              name="cameraType"
              value={filters.cameraType}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  cameraType: e.target.value,
                }))
              }
            >
              <option value="all">Все</option>

              {names.map((name) => (
                <option key={name.type} value={name.type}>
                  {name.name}
                </option>
              ))}
            </select>
          </li>

          <li>
            <label htmlFor="">Район</label>
            <select
              name="district"
              value={filters.district}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  district: e.target.value,
                  mahalla: "all",
                }))
              }
            >
              <option value="all">Все</option>

              {qoraqalpogiston.map((name) => (
                <option key={name.district} value={name.district}>
                  {name.district}
                </option>
              ))}
            </select>
          </li>

          <li>
            <label htmlFor="">МПЖ</label>
            <select
              name="mahalla"
              value={filters.mahalla}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  mahalla: e.target.value,
                }))
              }
            >
              <option value="all">Все</option>

              {filteredMahalla?.mahalla?.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </li>

          <li>
            <label htmlFor="">Дата начала</label>

            <DatePicker
              selected={new Date(filters.startDate)}
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
            <label htmlFor="">Дата окончания</label>

            <DatePicker
              selected={new Date(filters.endDate)}
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
