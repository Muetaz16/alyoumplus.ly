import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { UserForm } from "@/components/admin/user-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteUser } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateAr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black dark:text-white">إدارة المستخدمين</h1>

      <Card className="dark:bg-slate-900 dark:border-slate-800">
        <CardHeader><CardTitle className="dark:text-white">مستخدم جديد</CardTitle></CardHeader>
        <CardContent><UserForm /></CardContent>
      </Card>

      <div className="rounded-2xl border bg-white dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-slate-800">
            <tr>
              <th className="text-right p-4 font-bold">الاسم</th>
              <th className="text-right p-4 font-bold">البريد</th>
              <th className="text-right p-4 font-bold">الدور</th>
              <th className="text-right p-4 font-bold">التاريخ</th>
              <th className="text-right p-4 font-bold">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t dark:border-slate-800">
                <td className="p-4 dark:text-white">{user.name}</td>
                <td className="p-4 text-gray-500">{user.email}</td>
                <td className="p-4">
                  <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                    {user.role === "ADMIN" ? "مدير" : "محرر"}
                  </Badge>
                </td>
                <td className="p-4 text-gray-500">{formatDateAr(user.createdAt)}</td>
                <td className="p-4">
                  <DeleteButton onDelete={() => deleteUser(user.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
