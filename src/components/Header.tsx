"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import db from "@/lib/db";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tickerItems, setTickerItems] = useState<string[]>([
    " اليوم plus الرقمية تطلق منصتها التفاعلية الجديدة كلياً للبث الحي والمباشر.",
    "تحديث مستمر على مدار 24 ساعة لآخر الأخبار والتقارير الإقليمية والمحلية."
  ]);

  useEffect(() => {
    // Sync React state with HTML class when path changes
    setSidebarOpen(false);
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("sidebar-open");
    }
  }, [pathname]);

  // Fetch news ticker settings
  useEffect(() => {
    async function loadTicker() {
      try {
        const tickerDoc = await db.generalSetting.findUnique({ where: { id: "ticker" } });
        if (tickerDoc && tickerDoc.items) {
          setTickerItems(tickerDoc.items);
        }
      } catch (e) {
        console.error("Error fetching news ticker:", e);
      }
    }
    loadTicker();
  }, []);

  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  const toggleSidebar = () => {
    const nextState = !sidebarOpen;
    setSidebarOpen(nextState);
    if (typeof document !== "undefined") {
      if (nextState) {
        document.documentElement.classList.add("sidebar-open");
      } else {
        document.documentElement.classList.remove("sidebar-open");
      }
    }
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <div
        className={`${styles.mobileOverlay} ${sidebarOpen ? styles.open : ""}`}
        onClick={toggleSidebar}
        aria-hidden="true"
      />
      <header className={styles.header}>
        {/* Search/Action Controls */}
        <div className={styles.rightGroup}>
          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleSidebar}
            className={`${styles.hamburger} ${sidebarOpen ? styles.hamburgerOpen : ""}`}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Brand logo (visible on mobile only since desktop has it in the sidebar) */}
          <Link href="/" prefetch={false} className={styles.logoAreaMobile}>
            <img src="/LogoPlusPNG.png" alt="اليوم plus" className={styles.logoImage} />
            <span className={styles.logoText}>اليوم plus</span>
          </Link>
        </div>

        {/* Center navigation links or Ticker */}
        <div className={styles.searchPlaceholder}>
          <div className={styles.breakingTicker}>
            <div className={styles.tickerLabel}>
              <span>🔴</span>
              <span>عاجل</span>
            </div>
            <div className={styles.tickerFlow}>
              <div className={styles.tickerWrapper}>
                {/* Original Set */}
                {tickerItems.map((item, index) => (
                  <span key={`orig-${index}`} className={styles.tickerText}>
                    <span className={styles.tickerDot}></span>
                    {item}
                  </span>
                ))}
                {/* Duplicated Set for Seamless Loop */}
                {tickerItems.map((item, index) => (
                  <span key={`dup-${index}`} className={styles.tickerText}>
                    <span className={styles.tickerDot}></span>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Left controls */}
        <div className={styles.actionArea}>
          <a
            href="https://wa.me/218928175897"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.supportBtn}
          >
            💬 اتصل بنا
          </a>
        </div>
      </header>
    </>
  );
}
