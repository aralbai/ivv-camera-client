"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import axios from "axios";
import { format } from "date-fns";
import { Delete, Edit } from "@mui/icons-material";
import SaveToExcel from "@/components/saveToExcel/SaveToExcel";
import { useUserContext } from "@/context/UserContext";
import ProtectedRoutes from "@/components/protectedRoutes/ProtectedRoutes";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

export default function UsersPage() {
  const { user } = useUserContext();
  const [users, setUsers] = useState([]);

  const [addModal, setAddModal] = useState(true);

  const [editModal, setEditModal] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState("");

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCameraId, setSelectedCameraId] = useState("");

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users`);

        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCameras();
  }, [deleteModal, editModal]);

  return (
    <ProtectedRoutes allowedRoles={["admin", "user"]}>
      <div className={styles.cameras}>
        <div className={styles.title}>
          <h1>Все пользователи</h1>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.top}>
            <SaveToExcel />

            <button className={styles.addNew}>
              <PersonAddAlt1Icon /> Add new
            </button>
          </div>
          <table id="myTable">
            <thead>
              <tr>
                <td>Имя пользователя</td>
                <td>Роль</td>
                <td>Дата добавления</td>
                {user?.role === "admin" && <td></td>}
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.username}</td>
                  <td>{u.role}</td>
                  <td>
                    {u?.createdAt ? format(u?.createdAt, "dd.MM.yyyy") : ""}
                  </td>
                  {user?.role === "admin" && (
                    <td>
                      <div className={styles.action}>
                        <button
                          onClick={() => {
                            setEditModal(true);
                            setSelectedCamera(u);
                          }}
                        >
                          <Edit />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteModal(true);
                            setSelectedCameraId(u._id);
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
        </div>
      </div>
    </ProtectedRoutes>
  );
}
