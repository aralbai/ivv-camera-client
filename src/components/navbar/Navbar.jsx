import FilterModal from "../filterModal/FilterModal";
import styles from "./Navbar.module.scss";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";

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
        <AddLocationAltIcon />
        Добавить новый
      </button>
    </div>
  );
}
