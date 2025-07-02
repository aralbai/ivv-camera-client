"use client";

import DatePicker from "react-datepicker";
import styles from "./FilterModal.module.scss";
import FilterListIcon from "@mui/icons-material/FilterList";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { Close } from "@mui/icons-material";

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

export default function FilterModal({ filters, setFilters }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className={styles.filterModal}>
      <div className={styles.filter} onClick={() => setModalOpen(!modalOpen)}>
        <FilterListIcon />
        <p>Фильтр</p>
      </div>

      {modalOpen && (
        <ul className={styles.main}>
          <li>
            <label htmlFor="">Тип камеры</label>
            <select
              name="product"
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
