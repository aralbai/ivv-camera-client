import { useState } from "react";
import styles from "./AddUserModal.module.scss";
import axios from "axios";
import { Close, Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";

export default function AddUserModal({ setAddModal }) {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [repeatpassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password || repeatpassword) {
      if (password.length < 6 || repeatpassword.length < 6) {
        return setError("Пароль должен быть длиной не менее 6 символов.");
      }

      if (password !== repeatpassword) {
        return setError("Пароли не совпадают.");
      }
    }

    const data = {
      username,
      password,
      role,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        data
      );

      toast.success(res.data?.message);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  return (
    <div className={styles.addNewModal}>
      <div className={styles.card}>
        <div className={styles.top}>
          <h1>Добавить нового пользователя</h1>
          <button
            onClick={() => {
              setAddModal(false);
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
              required={true}
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
                required
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
                required
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
