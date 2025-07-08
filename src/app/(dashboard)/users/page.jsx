"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import axios from "axios";
import { format } from "date-fns";
import { Delete, Edit, Menu } from "@mui/icons-material";
import SaveToExcel from "@/components/saveToExcel/SaveToExcel";
import { useUserContext } from "@/context/UserContext";
import ProtectedRoutes from "@/components/protectedRoutes/ProtectedRoutes";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import AddUserModal from "@/components/users/addUserModal/AddUserModal";
import DeleteUserModal from "@/components/users/deleteUserModal/DeleteUserModal";
import EditUserModal from "@/components/users/editUserModal/EditUserModal";
import { useMenuContext } from "@/context/MenuContext";

export default function UsersPage() {
  const { user } = useUserContext();
  const { menuOpen, setMenuOpen } = useMenuContext();
  const [users, setUsers] = useState([]);

  const [addModal, setAddModal] = useState(false);

  const [editModal, setEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users`
        );

        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCameras();
  }, [addModal, deleteModal, editModal]);

  return (
    <ProtectedRoutes allowedRoles={["admin", "user"]}>
      <div className={styles.cameras}>
        <div className={styles.title}>
          <button className={styles.menu}>
            <Menu onClick={() => setMenuOpen(true)} />
          </button>

          <h1>Все пользователи</h1>
        </div>

        <div className={styles.container}>
          <div className={styles.top}>
            <SaveToExcel />

            <button className={styles.addNew} onClick={() => setAddModal(true)}>
              <PersonAddAlt1Icon /> <p>Add new</p>
            </button>
          </div>

          <div className={styles.tableContainer}>
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
                              setSelectedUser(u);
                            }}
                          >
                            <Edit />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteModal(true);
                              setSelectedUserId(u._id);
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

          {addModal && <AddUserModal setAddModal={setAddModal} />}

          {deleteModal && (
            <DeleteUserModal
              selectedUserId={selectedUserId}
              setSelectedUserId={setSelectedUserId}
              setDeleteModal={setDeleteModal}
              users={users}
              setUsers={setUsers}
            />
          )}

          {editModal && (
            <EditUserModal
              setEditModal={setEditModal}
              setSelectedUser={setSelectedUser}
              selectedUser={selectedUser}
            />
          )}
        </div>
      </div>
    </ProtectedRoutes>
  );
}
