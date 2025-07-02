import styles from "./SaveToExcel.module.scss";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

export default function SaveToExcel() {
  const exportToExcel = () => {
    const table = document.getElementById("myTable");
    const workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet 1" });
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "table-data.xlsx");
  };

  return (
    <div className={styles.saveToExcel}>
      <button onClick={exportToExcel}>
        <SaveAltIcon /> Сохранить в Excel
      </button>
    </div>
  );
}
