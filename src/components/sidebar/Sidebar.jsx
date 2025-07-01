import Link from "next/link";
import styles from "./Sidebar.module.scss";
import { usePathname } from "next/navigation";
import MapIcon from "@mui/icons-material/Map";
import VideocamIcon from "@mui/icons-material/Videocam";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className={styles.sidebar}>
      <h1>IIV CAMERA</h1>

      <ul>
        <li>
          <Link
            href="/map"
            className={pathname.includes("/map") ? styles.active : ""}
          >
            <MapIcon />
            Map
          </Link>
        </li>
        <li>
          <Link
            href="/cameras"
            className={pathname.includes("/cameras") ? styles.active : ""}
          >
            <VideocamIcon />
            Cameras
          </Link>
        </li>
        <li>
          <Link
            href="/users"
            className={pathname.includes("/users") ? styles.active : ""}
          >
            <PeopleAltIcon />
            Users
          </Link>
        </li>
      </ul>
    </div>
  );
}
