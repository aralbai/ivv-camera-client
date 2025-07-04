"use client";

import Sidebar from "@/components/sidebar/Sidebar";
import styles from "./layout.module.scss";
import ProtectedRoutes from "@/components/protectedRoutes/ProtectedRoutes";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoutes allowedRoles={["admin", "user"]}>
      <div className={styles.dashboardLayout}>
        <Sidebar />

        <div className={styles.main}>{children}</div>
      </div>
    </ProtectedRoutes>
  );
}
