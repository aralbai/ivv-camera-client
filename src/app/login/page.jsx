"use client";

import styles from "./page.module.scss";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import axios from "@/lib/axios";
import { useState } from "react";

export default function page() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { setUser, setAccessToken } = useUserContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/auth/login", { username, password });

      setUser(res.data.user);
      setAccessToken(res.data.accessToken);

      const roleRoutes = {
        admin: "/map",
        user: "/map",
      };

      router.push(roleRoutes[res.data.user.role] || "/unauthorized");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.card}>
        <div className={styles.box}>
          <img src="/login.svg" alt="" />
        </div>

        <form className={styles.box} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="">Password</label>
            <div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {showPassword ? (
                <VisibilityOffIcon onClick={() => setShowPassword(false)} />
              ) : (
                <VisibilityIcon onClick={() => setShowPassword(true)} />
              )}
            </div>
          </div>

          <button>Login</button>
        </form>
      </div>
    </div>
  );
}
