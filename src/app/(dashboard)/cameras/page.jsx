"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import axios from "axios";
import { format } from "date-fns";
import { Delete, Edit } from "@mui/icons-material";
import FilterModal from "@/components/filterModal/FilterModal";
import SaveToExcel from "@/components/saveToExcel/SaveToExcel";
import Paginatin from "@/components/pagination/Paginatin";

const names = {
  ptz: "ПТЗ камера",
  obz: "Обзорний камера",
  lis: " Распознавание лиц",
  avto: "Распознавание авто номер",
  radar: "Радар",
};

export default function CamerasPage() {
  const [cameras, setCameras] = useState([]);
  const [filters, setFilters] = useState({
    cameraType: "all",
    startDate: new Date("2025-01-01"),
    endDate: new Date(),
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCameras, setTotalCameras] = useState(0);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/cameras?cameraType=${filters.cameraType}&startDate=${filters.startDate}&endDate=${filters.endDate}&page=${page}`
        );

        setCameras(res.data?.data);
        setTotalCameras(res.data?.totalItems);
        setPage(res.data?.currentPage);
        setTotalPages(res.data?.totalPages);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCameras();
  }, [filters, page]);

  return (
    <div className={styles.cameras}>
      <div className={styles.title}>
        <h1>Cameras</h1>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.top}>
          <FilterModal filters={filters} setFilters={setFilters} />

          <SaveToExcel />
        </div>
        <table id="myTable">
          <thead>
            <tr>
              <td>Image</td>
              <td>Camer type</td>
              <td>Address</td>
              <td>Latitude</td>
              <td>Longitude</td>
              <td>Date</td>
              <td></td>
            </tr>
          </thead>

          <tbody>
            {cameras.map((camera) => (
              <tr key={camera._id}>
                <td>
                  <img src={`/${camera.cameraType}.png`} alt="" />
                </td>
                <td>{`${names[camera.cameraType]}`}</td>
                <td>{camera.address}</td>
                <td>{camera.position[1]}</td>
                <td>{camera.position[0]}</td>
                <td>{format(camera.createdAt, "dd.MM.yyyy")}</td>
                <td>
                  <div className={styles.action}>
                    <button>
                      <Edit />
                    </button>
                    <button>
                      <Delete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Paginatin
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          totalCameras={totalCameras}
        />
      </div>
    </div>
  );
}
