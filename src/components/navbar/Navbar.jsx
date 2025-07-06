import { useUserContext } from "@/context/UserContext";
import FilterModal from "../filterModal/FilterModal";
import styles from "./Navbar.module.scss";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";

export default function Navbar({
  setAddNewModalOpen,
  filters,
  setFilters,
  setAddNewClickOpen,
  setTempMarkerClick,
  totalCameras,
}) {
  const { user } = useUserContext();

  return (
    <div className={styles.navbar}>
      <div className={styles.filterContainer}>
        <FilterModal
          filters={filters}
          setFilters={setFilters}
          totalCameras={totalCameras}
        />
      </div>

      {user?.role === "admin" && (
        <button
          className={styles.addNew}
          onClick={() => {
            setAddNewModalOpen(true);
            setAddNewClickOpen(false);
            setTempMarkerClick(null);
          }}
        >
          <AddLocationAltIcon />
          Добавить новый
        </button>
      )}
    </div>
  );
}
