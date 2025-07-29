import { Close } from "@mui/icons-material";
import styles from "./ViewCamera.module.scss";

export default function ViewCamera({ setViewCamera }) {
  return (
    <div className={styles.viewCamera}>
      <button className={styles.close} onClick={() => setViewCamera(false)}>
        <Close />
      </button>

      <iframe
        src="http://localhost:3001" // <-- bu yerga IP address yozing
        width="100%"
        height="100%"
        style={{ border: "none" }}
      ></iframe>
    </div>
  );
}
