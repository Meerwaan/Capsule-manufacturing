import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";
import styles from "./client.module.css";
import { LayoutDashboard, FileText, Package } from "lucide-react";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  // @ts-ignore
  if (session.user.role === "ADMIN") {
    redirect("/admin"); 
  }

  return (
    <div className={styles.layout}>
      <nav className={styles.navbar}>
        <Link href="/client" className={styles.brand}>
          CAPSULE <span>Marque</span>
        </Link>
        <div className={styles.navLinks}>
          <Link href="/client" className={styles.navLink}>
            <LayoutDashboard className={styles.navLinkIcon} />
            Dashboard
          </Link>
          <Link href="/client/quotes" className={styles.navLink}>
            <FileText className={styles.navLinkIcon} />
            Mes Devis
          </Link>
          <Link href="/client/projects" className={styles.navLink}>
            <Package className={styles.navLinkIcon} />
            Mes Productions
          </Link>
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userProfile}>
            <div className={styles.userAvatar}>
              {session.user?.name ? session.user.name.substring(0, 1).toUpperCase() : session.user?.email?.substring(0, 1).toUpperCase()}
            </div>
            <span>{session.user?.name || session.user?.email}</span>
          </div>
          <LogoutButton />
        </div>
      </nav>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
