import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";
import styles from "./client.module.css";

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
    redirect("/admin"); // Les admins vont sur /admin
  }

  return (
    <div className={styles.layout}>
      <nav className={styles.navbar}>
        <Link href="/client" className={styles.brand}>
          CAPSULE <span>Marque</span>
        </Link>
        <div className={styles.navLinks}>
          <Link href="/client" className={styles.navLink}>Dashboard</Link>
          <Link href="/client/quotes" className={styles.navLink}>Mes Devis</Link>
          <Link href="/client/projects" className={styles.navLink}>Mes Productions</Link>
        </div>
        <div className={styles.userInfo}>
          <span>{session.user.name || session.user.email}</span>
          <LogoutButton />
        </div>
      </nav>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
