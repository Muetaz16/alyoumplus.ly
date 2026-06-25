"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import db from "@/lib/db";
import styles from "./Footer.module.css";

export default function Footer() {
  const pathname = usePathname();
  const [settings, setSettings] = useState({
    phone: "+218 92 817 5897",
    email: "info@libyaplus.ly",
    address: "بنغازي- ليبيا",
    whatsapp: "218928175897",
    telegram: "+218928175897",
    facebook: "libyaplus.official",
  });

  useEffect(() => {
    async function loadFooterSettings() {
      try {
        const data = await db.contactSetting.findFirst();
        if (data) {
          setSettings({
            phone: data.phone || "+218 92 817 5897",
            email: data.email || "info@libyaplus.ly",
            address: data.address || "بنغازي- ليبيا",
            whatsapp: data.whatsapp || "218928175897",
            telegram: data.telegram || "+218928175897",
            facebook: data.facebook || "libyaplus.official",
          });
        }
      } catch (err) {
        console.error("Failed to load footer settings:", err);
      }
    }
    loadFooterSettings();
  }, []);

  // Hide the standard visitor footer inside the Admin Dashboard
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  const getSocialLink = (platform: "wa" | "tg" | "fb", val: string) => {
    if (!val) return "#";
    if (val.startsWith("http://") || val.startsWith("https://")) {
      return val;
    }
    if (platform === "wa") {
      const cleaned = val.replace(/[+\s-]/g, "");
      return `https://wa.me/${cleaned}`;
    }
    if (platform === "tg") {
      if (val.startsWith("t.me/")) {
        return `https://${val}`;
      }
      if (val.startsWith("+")) {
        return `https://t.me/${val}`;
      }
      return `https://t.me/${val}`;
    }
    if (platform === "fb") {
      return `https://facebook.com/${val}`;
    }
    return "#";
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        {/* Brand Description */}
        <div className={styles.brandColumn}>
          <div className={styles.logoContainer}>
            <img src="/logl.png" alt="اليوم plus" className={styles.logoImage} />
          </div>
          <p className={styles.description}>
            نحن منصة إعلامية بهوية ليبية، انطلقنا لنقدم محتوى مرئياً ومسموعاً يصل إلى كل بيت. من الفيديوهات والتقارير القصيرة والمليئة بالحياة، إلى البث المباشر الموثوق الذي ينقل لكم الحدث لحظة بلحظة. نختار لكم أفضل القصص والمحتوى المميز بجودة عرض مذهلة، لأننا نؤمن أن القصة الليبية تستحق أن تُروى بأفضل صورة.
          </p>
        </div>

        {/* Quick Links */}
        <div className={styles.linkColumn}>
          <h3 className={styles.columnTitle}>روابط سريعة</h3>
          <Link href="/" prefetch={false} className={styles.link}>الرئيسية</Link>
          <Link href="/live" prefetch={false} className={styles.link}>البث المباشر</Link>
          <Link href="/reels" prefetch={false} className={styles.link}>فيديوهات الريلز</Link>
        </div>

        {/* Contact info & Socials */}
        <div className={styles.linkColumn}>
          <h3 className={styles.columnTitle}>تواصل معنا</h3>
          <div className={styles.contactInfo}>
            <div>📍 {settings.address}</div>
            <div>✉️ {settings.email}</div>
            <div>📞 {settings.phone}</div>
          </div>
          <div className={styles.socialRow}>
            <a href={getSocialLink("wa", settings.whatsapp)} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="WhatsApp">WA</a>
            <a href={getSocialLink("tg", settings.telegram)} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="Telegram">TG</a>
            <a href={getSocialLink("fb", settings.facebook)} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="Facebook">FB</a>
          </div>
        </div>
      </div>

      <div className={styles.divider}></div>
      <div className={styles.copyright}>
        جميع الحقوق محفوظة © {new Date().getFullYear()} اليوم plus. .
      </div>
    </footer>
  );
}
