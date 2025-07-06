import Link from "next/link";
import styles from "./Sidebar.module.scss";
import { usePathname } from "next/navigation";
import MapIcon from "@mui/icons-material/Map";
import VideocamIcon from "@mui/icons-material/Videocam";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import axios from "@/lib/axios";
import { useUserContext } from "@/context/UserContext";
import { toast } from "react-toastify";

export default function Sidebar() {
  const { user } = useUserContext();
  const pathname = usePathname();
  const { setUser, setAccessToken } = useUserContext();

  const handleLogout = async () => {
    const res = await axios.post("/auth/logout");

    toast.success(res.data);

    setUser(null);
    setAccessToken(null);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.top}>
        <h1>IIV CAMERA</h1>

        <ul>
          <li>
            <Link
              href="/map"
              className={pathname.includes("/map") ? styles.active : ""}
            >
              <MapIcon />
              Карта
            </Link>
          </li>
          <li>
            <Link
              href="/cameras"
              className={pathname.includes("/cameras") ? styles.active : ""}
            >
              <VideocamIcon />
              Камеры
            </Link>
          </li>
          {user?.role === "admin" && (
            <li>
              <Link
                href="/users"
                className={pathname.includes("/users") ? styles.active : ""}
              >
                <PeopleAltIcon />
                Пользователи
              </Link>
            </li>
          )}
        </ul>
      </div>

      <ul className={styles.bottom}>
        <li>
          <Link href="/">
            <AccountCircleIcon />
            {user.username}
          </Link>
        </li>
        <li>
          <Link onClick={handleLogout} href="/login">
            <LogoutIcon />
            Выход
          </Link>
        </li>
      </ul>
    </div>
  );
}
