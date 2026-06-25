"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import db from "@/lib/db";
import styles from "./VerticalSidebar.module.css";
import SideWidgets from "./SideWidgets";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function VerticalSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategorySlug = searchParams ? searchParams.get("category") : null;
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await db.category.findMany({
          orderBy: { id: "asc" },
        });
        setCategories(cats.filter((c: any) => c.slug !== "live" && c.name !== "اخباريه"));
      } catch (err) {
        console.error("Error loading sidebar categories:", err);
      }
    }
    loadCategories();
  }, []);

  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  const exploreItems = [
    {
      name: "الرئيسية",
      path: "/",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      ),
      active: pathname === "/" && !activeCategorySlug,
    },
    {
      name: "المباشر",
      path: "/live",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"/><path d="m12 19-2 3h4Z"/><path d="M8 21h8"/><path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></svg>
      ),
      active: pathname === "/live",
    },
    {
      name: "فيديوهات الريلز",
      path: "/reels",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
      ),
      active: pathname === "/reels",
    },
    {
      name: "فيديوهات 360",
      path: "/vr360",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
      ),
      active: pathname === "/vr360",
    },
  ];

  return (
    <aside className={styles.sidebar}>
      {/* Brand Header */}
      <div className={styles.brandContainer}>
        <Link href="/" prefetch={false} className={styles.logoLink}>
          <img src="/logl.png" alt="اليوم plus" className={styles.logoImage} />
          <span className={styles.logoText}>اليوم plus</span>
        </Link>
      </div>

      <div className={styles.scrollArea}>
        {/* Section: Explore */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>استكشف</h3>
          <ul className={styles.list}>
            {exploreItems.map((item, idx) => (
              <li key={idx}>
                <Link
                  href={item.path}
                  prefetch={false}
                  className={`${styles.itemLink} ${item.active ? styles.active : ""}`}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <span className={styles.name}>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Section: Categories */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>التصنيفات</h3>
          <ul className={styles.list}>
            {categories.map((cat) => {
              const isActive = activeCategorySlug === cat.slug;
              return (
                <li key={cat.id}>
                  <Link
                    href={`/?category=${cat.slug}`}
                    prefetch={false}
                    className={`${styles.itemLink} ${isActive ? styles.active : ""}`}
                  >
                    <span className={styles.icon}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
                    </span>
                    <span className={styles.name}>{cat.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        
        {/* Interactive Side Widgets */}
        <SideWidgets />

      </div>

      {/* Sidebar Footer */}
      <div className={styles.sidebarFooter}>
        <div className={styles.downloadApps}>
          <p>تطبيقاتنا قريباً على</p>
          <div className={styles.appBadgeGrid}>
            <div className={styles.appBadge}>Google Play</div>
            <div className={styles.appBadge}>App Store</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
