"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createLiveStream, updateLiveStream } from "@/actions/admin";
import type { LiveStream, Channel } from "@prisma/client";

const selectClass =
  "flex h-11 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C1121F] dark:bg-slate-800 dark:border-slate-700 dark:text-white";

export function LiveForm({
  stream,
  channels,
}: {
  stream?: LiveStream;
  channels: Channel[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = stream
        ? await updateLiveStream(stream.id, formData)
        : await createLiveStream(formData);
      if (result?.error) {
        toast.error("تحقق من الحقول");
        return;
      }
      toast.success(stream ? "تم التحديث" : "تم الإنشاء");
      router.push("/admin/live");
      router.refresh();
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4 max-w-2xl">
      <div>
        <Label htmlFor="title">العنوان *</Label>
        <Input id="title" name="title" defaultValue={stream?.title} required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="description">الوصف</Label>
        <Textarea id="description" name="description" defaultValue={stream?.description ?? ""} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="streamUrl">رابط البث *</Label>
        <Input id="streamUrl" name="streamUrl" defaultValue={stream?.streamUrl} required className="mt-1" placeholder="https://...m3u8" />
      </div>
      <div>
        <Label htmlFor="streamType">نوع البث</Label>
        <select id="streamType" name="streamType" defaultValue={stream?.streamType ?? "HLS"} className={`mt-1 ${selectClass}`}>
          <option value="HLS">HLS</option>
          <option value="M3U8">M3U8</option>
          <option value="RTMP">RTMP</option>
        </select>
      </div>
      <div>
        <Label htmlFor="thumbnail">رابط الصورة</Label>
        <Input id="thumbnail" name="thumbnail" defaultValue={stream?.thumbnail ?? ""} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="channelId">القناة</Label>
        <select id="channelId" name="channelId" defaultValue={stream?.channelId ?? ""} className={`mt-1 ${selectClass}`}>
          <option value="">بدون قناة</option>
          {channels.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" name="isActive" defaultChecked={stream?.isActive} />
        <span className="text-sm font-semibold">تفعيل البث الآن</span>
      </label>
      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>{pending ? "جاري الحفظ..." : stream ? "تحديث" : "إنشاء"}</Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>إلغاء</Button>
      </div>
    </form>
  );
}
