import { useEffect, useState } from "react";
import styles from "./EditUserModal.module.scss";
import axios from "axios";
import { Close, Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";

export default function EditUserModal({
  setEditModal,
  setSelectedUser,
  selectedUser,
}) {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [repeatpassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);

  useEffect(() => {
    setUserId(selectedUser._id);
    setUsername(selectedUser.username);
    setRole(selectedUser.role);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      username,
      role,
    };

    if (password) {
      if (password.length < 6) {
        return setError("Passport kishi 6");
      }

      if (repeatpassword !== password) {
        return setError("Passport dont match");
      }

      data.password = password;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        data
      );
      setEditModal(false);
      setSelectedUser(null);
      toast.success(res.data?.message);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  return (
    <div className={styles.addNewModal}>
      <div className={styles.card}>
        <div className={styles.top}>
          <h1>Изменить пользователя</h1>
          <button
            onClick={() => {
              setEditModal(false);
              setSelectedUser(null);
            }}
          >
            <Close />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="">Имя пользователя</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="">Роль пользователя</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="" hidden>
                Выберите один
              </option>
              <option value="user">Пользователь</option>
              <option value="admin">Админ</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="">Пароль</label>
            <div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {showPassword ? (
                <VisibilityOff onClick={() => setShowPassword(false)} />
              ) : (
                <Visibility onClick={() => setShowPassword(true)} />
              )}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="">Повторите пароль</label>
            <div>
              <input
                type={showPasswordRepeat ? "text" : "password"}
                value={repeatpassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
              {showPasswordRepeat ? (
                <VisibilityOff onClick={() => setShowPasswordRepeat(false)} />
              ) : (
                <Visibility onClick={() => setShowPasswordRepeat(true)} />
              )}
            </div>
          </div>

          <p>{error}</p>

          <button>Сохранять</button>
        </form>
      </div>
    </div>
  );
}
