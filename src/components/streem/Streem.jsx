import { useEffect, useRef } from "react";
import Hls from "hls.js";
import styles from "./Streem.module.scss";
import { Close } from "@mui/icons-material";

export default function StreamPage({ setViewCamera, streemCamera, setStreemCamera }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const startStream = async () => {
      try {
        await fetch(`http://localhost:5000/api/stream/start/${streemCamera._id}`, {
          method: "POST",
        });

        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(`http://localhost:5000/hls/${streemCamera._id}/stream.m3u8`);
          hls.attachMedia(videoRef.current);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoRef.current.play();
          });
        } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
          videoRef.current.src = `http://localhost:5000/hls/${streemCamera._id}/stream.m3u8`;
        }
      } catch (err) {
        console.error("Stream start error:", err);
      }
    };

    if (streemCamera?._id) startStream();

    return () => {
      fetch(`http://localhost:5000/api/stream/stop/${streemCamera._id}`, {
        method: "POST",
      });

      console.log("stop")
    };
  }, [streemCamera]);

  return (
    <div className={styles.streem}>
      <div className={styles.main}>
        <div className={styles.top}>
          <h1>IP Kamera</h1>
          <button onClick={() => {setViewCamera(false), setStreemCamera(null)}}>
            <Close />
          </button>
        </div>
        <video
          ref={videoRef}
          controls
          autoPlay
          muted
          width="640"
          height="360"
        />
      </div>
    </div>
  );
}
