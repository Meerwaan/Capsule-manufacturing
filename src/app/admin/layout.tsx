import React from "react";
import Link from "next/link";
import styles from "./admin.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1>CAPSULE <span>ADMIN</span></h1>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>
            Dashboard
          </Link>
          <Link href="/admin/quotes" className={styles.navLink}>
            Devis reçus
          </Link>
          <Link href="/admin/projects" className={styles.navLink}>
            Production en cours
          </Link>
          <Link href="/admin/materials" className={styles.navLink}>
            Stock Matières
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.avatar}>ML</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Merwan L.</span>
            <span className={styles.userRole}>Administrateur</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
