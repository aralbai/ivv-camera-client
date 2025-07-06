import { Close } from "@mui/icons-material";
import styles from "./DeleteUserModal.module.scss";
import axios from "axios";
import { toast } from "react-toastify";

export default function DeleteUserModal({
  selectedUserId,
  setSelectedUserId,
  setDeleteModal,
  users,
  setUsers,
}) {
  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/users/${selectedUserId}`
      );

      const newUsers = users.filter((user) => user._id !== selectedUserId);

      setUsers(newUsers);
      setSelectedUserId(null);
      setDeleteModal(false);
      toast.success(res.data?.message);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  return (
    <div className={styles.deleteContainer}>
      <div className={styles.deleteModal}>
        <div className={styles.top}>
          <h1>Вы уверены, что хотите удалить этот элемент?</h1>
          <button
            onClick={() => {
              setSelectedUserId(null);
              setDeleteModal(false);
            }}
          >
            <Close />
          </button>
        </div>

        <div className={styles.bottom}>
          <button onClick={handleDelete}>Удалить</button>

          <button
            onClick={() => {
              setSelectedUserId(null);
              setDeleteModal(false);
            }}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
