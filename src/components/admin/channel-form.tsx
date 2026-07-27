"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createChannel, updateChannel } from "@/actions/admin";
import type { Channel } from "@prisma/client";

export function ChannelForm({ channel }: { channel?: Channel }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = channel
        ? await updateChannel(channel.id, formData)
        : await createChannel(formData);
      if (result?.error) {
        toast.error("تحقق من الحقول");
        return;
      }
      toast.success(channel ? "تم التحديث" : "تم الإنشاء");
      router.push("/admin/channels");
      router.refresh();
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4 max-w-2xl">
      <div>
        <Label htmlFor="name">اسم القناة *</Label>
        <Input id="name" name="name" defaultValue={channel?.name} required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="description">الوصف</Label>
        <Textarea id="description" name="description" defaultValue={channel?.description ?? ""} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="logo">رابط الشعار</Label>
        <Input id="logo" name="logo" defaultValue={channel?.logo ?? ""} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="coverImage">رابط صورة الغلاف</Label>
        <Input id="coverImage" name="coverImage" defaultValue={channel?.coverImage ?? ""} className="mt-1" />
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={pending}>{pending ? "جاري الحفظ..." : channel ? "تحديث" : "إنشاء"}</Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>إلغاء</Button>
      </div>
    </form>
  );
}
