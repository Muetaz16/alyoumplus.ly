"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUser } from "@/actions/admin";

const selectClass =
  "flex h-11 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C1121F] dark:bg-slate-800 dark:border-slate-700 dark:text-white";

export function UserForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createUser(formData);
      if (result?.error) {
        toast.error("تحقق من الحقول");
        return;
      }
      toast.success("تم إنشاء المستخدم");
      router.refresh();
      (document.getElementById("user-form") as HTMLFormElement)?.reset();
    });
  };

  return (
    <form id="user-form" action={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <Label htmlFor="name">الاسم</Label>
        <Input id="name" name="name" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="email">البريد</Label>
        <Input id="email" name="email" type="email" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="password">كلمة المرور</Label>
        <Input id="password" name="password" type="password" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="role">الدور</Label>
        <select id="role" name="role" defaultValue="EDITOR" className={`mt-1 ${selectClass}`}>
          <option value="ADMIN">مدير (Admin)</option>
          <option value="EDITOR">محرر (Editor)</option>
        </select>
      </div>
      <Button type="submit" disabled={pending}>{pending ? "جاري الإنشاء..." : "إضافة مستخدم"}</Button>
    </form>
  );
}
