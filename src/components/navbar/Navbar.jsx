import styles from "./Navbar.module.scss";

export default function Navbar({ setAddNewModalOpen }) {
  return (
    <div className={styles.navbar}>
      <h1></h1>

      <button
        className={styles.addNew}
        onClick={() => setAddNewModalOpen(true)}
      >
        Add New
      </button>
    </div>
  );
}
