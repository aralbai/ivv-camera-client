import styles from "./Pagination.module.scss";

export default function Paginatin({ page, setPage, totalPages, totalCameras }) {
  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className={styles.pagination}>
      <button onClick={prevPage} disabled={page === 1}>
        Prev
      </button>

      <p>page: {page}</p>
      <p>totalPages: {totalPages}</p>
      <p>totalCameras: {totalCameras}</p>

      <button onClick={nextPage} disabled={page === totalPages}>
        Next
      </button>
    </div>
  );
}
