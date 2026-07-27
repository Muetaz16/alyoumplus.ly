import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { ThemeProvider } from "@/components/admin/theme-provider";
import { SessionProvider } from "next-auth/react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <SessionProvider>
      <ThemeProvider>
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-950">
          <AdminSidebar role={session.user.role} />
          <div className="mr-64 p-8">{children}</div>
        </div>
      </ThemeProvider>
    </SessionProvider>
  );
}
