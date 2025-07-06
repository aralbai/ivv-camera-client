import { useUserContext } from "@/context/UserContext";
import FilterModal from "../filterModal/FilterModal";
import styles from "./Navbar.module.scss";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import { Menu } from "@mui/icons-material";
import { useMenuContext } from "@/context/MenuContext";

export default function Navbar({
  setAddNewModalOpen,
  filters,
  setFilters,
  setAddNewClickOpen,
  setTempMarkerClick,
  totalCameras,
}) {
  const { user } = useUserContext();
  const { menuOpen, setMenuOpen } = useMenuContext();

  return (
    <div className={styles.navbar}>
      <button className={styles.menu}>
        <Menu onClick={() => setMenuOpen(true)} />
      </button>

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
          <p>Добавить новый</p>
        </button>
      )}
    </div>
  );
}
