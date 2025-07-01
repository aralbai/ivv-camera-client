import FilterModal from "../filterModal/FilterModal";
import styles from "./Navbar.module.scss";

export default function Navbar({ setAddNewModalOpen, filters, setFilters }) {
  return (
    <div className={styles.navbar}>
      <div className={styles.filterContainer}>
        <FilterModal filters={filters} setFilters={setFilters} />
      </div>

      <button
        className={styles.addNew}
        onClick={() => setAddNewModalOpen(true)}
      >
        Add New
      </button>
    </div>
  );
}
