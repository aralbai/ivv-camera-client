"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import axios from "axios";
import { format } from "date-fns";
import { Delete, Edit, Menu } from "@mui/icons-material";
import FilterModal from "@/components/filterModal/FilterModal";
import SaveToExcel from "@/components/saveToExcel/SaveToExcel";
import Paginatin from "@/components/pagination/Paginatin";
import EditCamera from "@/components/editCamera/EditCamera";
import DeleteModal from "@/components/deleteModal/DeleteModal";
import DeleteCM from "@/components/deleteCM/DeleteCM";
import { useUserContext } from "@/context/UserContext";
import ProtectedRoutes from "@/components/protectedRoutes/ProtectedRoutes";
import { useMenuContext } from "@/context/MenuContext";

const names = {
  ptz: "ПТЗ камера",
  obz: "Обзорний камера",
  lis: " Распознавание лиц",
  avto: "Распознавание авто номер",
  radar: "Радар",
};

export default function CamerasPage() {
  const { user } = useUserContext();
  const { menuOpen, setMenuOpen } = useMenuContext();
  const [cameras, setCameras] = useState([]);
  const [filters, setFilters] = useState({
    cameraType: "all",
    startDate: new Date("2025-01-01"),
    endDate: new Date(),
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCameras, setTotalCameras] = useState(0);

  const [editModal, setEditModal] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState("");

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCameraId, setSelectedCameraId] = useState("");

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cameras?cameraType=${filters.cameraType}&startDate=${filters.startDate}&endDate=${filters.endDate}&page=${page}`
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
  }, [filters, page, deleteModal, editModal]);

  return (
    <ProtectedRoutes allowedRoles={["admin", "user"]}>
      <div className={styles.cameras}>
        <div className={styles.title}>
          <button className={styles.menu}>
            <Menu onClick={() => setMenuOpen(true)} />
          </button>

          <h1>Все камеры</h1>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.top}>
            <FilterModal
              filters={filters}
              setFilters={setFilters}
              totalCameras={totalCameras}
            />

            <SaveToExcel />
          </div>
          <table id="myTable">
            <thead>
              <tr>
                <td>Икона</td>
                <td>Тип камеры</td>
                <td>Адрес</td>
                <td>Широта</td>
                <td>Долгота</td>
                <td>Дата добавления</td>
                {user?.role === "admin" && <td></td>}
              </tr>
            </thead>

            <tbody>
              {cameras.map((camera) => (
                <tr key={camera._id}>
                  <td>
                    <img
                      src={
                        camera.cameraType === "obz"
                          ? `/ptz.png`
                          : `/${camera.cameraType}.png`
                      }
                      alt=""
                    />
                  </td>
                  <td>{`${names[camera.cameraType]}`}</td>
                  <td>{camera.address}</td>
                  <td>{camera.position[1]}</td>
                  <td>{camera.position[0]}</td>
                  <td>{format(camera.createdAt, "dd.MM.yyyy")}</td>
                  {user?.role === "admin" && (
                    <td>
                      <div className={styles.action}>
                        <button
                          onClick={() => {
                            setEditModal(true);
                            setSelectedCamera(camera);
                          }}
                        >
                          <Edit />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteModal(true);
                            setSelectedCameraId(camera._id);
                          }}
                        >
                          <Delete />
                        </button>
                      </div>
                    </td>
                  )}
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

          {editModal && (
            <EditCamera
              setEditModal={setEditModal}
              selectedCamera={selectedCamera}
              setSelectedCamera={setSelectedCamera}
            />
          )}

          {deleteModal && (
            <DeleteCM
              selectedCameraId={selectedCameraId}
              setSelectedCameraId={setSelectedCameraId}
              setDeleteModal={setDeleteModal}
            />
          )}
        </div>
      </div>
    </ProtectedRoutes>
  );
}
