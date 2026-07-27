"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProgram } from "@/actions/admin";
import type { Channel } from "@prisma/client";

const selectClass =
  "flex h-11 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C1121F] dark:bg-slate-800 dark:border-slate-700 dark:text-white";

export function ProgramForm({ channels }: { channels: Channel[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createProgram(formData);
      if (result?.error) {
        toast.error("تحقق من الحقول");
        return;
      }
      toast.success("تم إنشاء البرنامج");
      router.push("/admin/programs");
      router.refresh();
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4 max-w-2xl">
      <div>
        <Label htmlFor="name">اسم البرنامج *</Label>
        <Input id="name" name="name" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="description">الوصف</Label>
        <Textarea id="description" name="description" className="mt-1" />
      </div>
      <div>
        <Label htmlFor="channelId">القناة *</Label>
        <select id="channelId" name="channelId" required className={`mt-1 ${selectClass}`}>
          <option value="">اختر القناة</option>
          {channels.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="coverImage">رابط صورة الغلاف</Label>
        <Input id="coverImage" name="coverImage" className="mt-1" />
      </div>
      <Button type="submit" disabled={pending}>{pending ? "جاري الحفظ..." : "إنشاء"}</Button>
    </form>
  );
}
