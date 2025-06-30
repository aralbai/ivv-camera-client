"use client";

import Sidebar from "@/components/sidebar/Sidebar";
import styles from "./layout.module.scss";

export default function DashboardLayout({ children }) {
  return (
    <div className={styles.dashboardLayout}>
      <Sidebar />

      <div className={styles.main}>{children}</div>
    </div>
  );
}
