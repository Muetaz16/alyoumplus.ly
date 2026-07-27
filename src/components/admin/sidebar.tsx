"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Video,
  Tv,
  Radio,
  Users,
  FolderOpen,
  LogOut,
  Play,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useTheme } from "@/components/admin/theme-provider";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/videos", label: "الفيديوهات", icon: Video },
  { href: "/admin/channels", label: "القنوات", icon: Tv },
  { href: "/admin/programs", label: "البرامج", icon: FolderOpen },
  { href: "/admin/live", label: "البث المباشر", icon: Radio },
  { href: "/admin/users", label: "المستخدمون", icon: Users, adminOnly: true },
];

export function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="fixed right-0 top-0 z-40 h-screen w-64 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 flex flex-col">
      <div className="flex items-center gap-3 p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C1121F] text-white">
          <Play className="h-5 w-5 fill-current" />
        </div>
        <div>
          <span className="font-black text-[#C1121F] dark:text-red-400">ليبيا بلس</span>
          <p className="text-xs text-gray-500">لوحة التحكم</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links
          .filter((l) => !l.adminOnly || role === "ADMIN")
          .map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors",
                  active
                    ? "bg-[#C1121F] text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-3" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          {theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-600"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOut className="h-5 w-5" />
          تسجيل الخروج
        </Button>
      </div>
    </aside>
  );
}
