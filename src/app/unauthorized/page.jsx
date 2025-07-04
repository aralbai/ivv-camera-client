import styles from "./page.module.scss";

export default function Unauthorized() {
  return (
    <div className={styles.unauthorized}>
      <img src="/401.jpg" alt="" />
    </div>
  );
}
