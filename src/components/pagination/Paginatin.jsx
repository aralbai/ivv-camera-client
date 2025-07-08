import styles from "./Pagination.module.scss";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function Paginatin({ page, setPage, totalPages, totalCameras }) {
  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className={styles.pagination}>
      <p>Текущая страница: {page}</p>
      <p>Всего страниц: {totalPages}</p>
      <p>Всего камер: {totalCameras}</p>

      <div className={styles.buttons}>
        <button
          onClick={prevPage}
          disabled={page === 1}
          style={{
            opacity: page === 1 ? 0.5 : 1,
            cursor: page === 1 ? "not-allowed" : "pointer",
          }}
        >
          <ArrowBackIosIcon />
          <p>Предыдущий</p>
        </button>

        <button
          onClick={nextPage}
          disabled={page === totalPages}
          style={{
            opacity: page === totalPages ? 0.5 : 1,
            cursor: page === totalPages ? "not-allowed" : "pointer",
          }}
        >
          <p>Следующий</p>
          <ArrowForwardIosIcon />
        </button>
      </div>
    </div>
  );
}
