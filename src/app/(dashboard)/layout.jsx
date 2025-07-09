"use client";

import Sidebar from "@/components/sidebar/Sidebar";
import styles from "./layout.module.scss";
import ProtectedRoutes from "@/components/protectedRoutes/ProtectedRoutes";
import { useState } from "react";
import { Menu } from "@mui/icons-material";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoutes allowedRoles={["admin", "user"]}>
      <div className={styles.dashboardLayout}>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className={styles.main}>{children}</div>
      </div>
    </ProtectedRoutes>
  );
}
