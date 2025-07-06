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
      <button
        onClick={prevPage}
        disabled={page === 1}
        style={{
          opacity: page === 1 ? 0.5 : 1,
          cursor: page === 1 ? "not-allowed" : "pointer",
        }}
      >
        Предыдущий
      </button>

      <p>
        Текущая страница: <b>{page}</b>
      </p>
      <p>
        Всего страниц: <b>{totalPages}</b>
      </p>
      <p>
        Всего камер: <b>{totalCameras}</b>
      </p>

      <button
        onClick={nextPage}
        disabled={page === totalPages}
        style={{
          opacity: page === totalPages ? 0.5 : 1,
          cursor: page === totalPages ? "not-allowed" : "pointer",
        }}
      >
        Следующий
      </button>
    </div>
  );
}
