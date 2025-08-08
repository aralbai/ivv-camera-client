import { Close } from "@mui/icons-material";
import styles from "./ViewCamera.module.scss";

export default function ViewCamera({ setViewCamera }) {
  return (
    <div className={styles.viewCamera}>
      <button className={styles.close} onClick={() => setViewCamera(false)}>
        <Close />
      </button>

      <iframe
        src="rtsp://admin:Sl@ym224@10.144.184.49/main" // <-- bu yerga IP address yozing
        width="100%"
        height="100%"
        style={{ border: "none" }}
      ></iframe>
    </div>
  );
}
