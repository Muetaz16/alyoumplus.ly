"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import VerticalSidebar from "./VerticalSidebar";
import Header from "./Header";
import Footer from "./Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname && pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="admin-layout" style={{ minHeight: "100vh", backgroundColor: "#0c0e14" }}>
        <main style={{ minHeight: "100vh" }}>{children}</main>
      </div>
    );
  }

  return (
    <div className="layout-wrapper">
      <Suspense fallback={<div style={{ width: "var(--sidebar-width)", backgroundColor: "#0b0c0e" }} />}>
        <VerticalSidebar />
      </Suspense>
      <div className="layout-main">
        <Header />
        <main className="layout-page">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
