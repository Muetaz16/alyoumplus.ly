"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createVideo, updateVideo } from "@/actions/admin";
import type { Video, Channel, Program } from "@prisma/client";

type VideoWithRelations = Video & {
  channel?: Channel | null;
  program?: Program | null;
};

const selectClass =
  "flex h-11 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C1121F] dark:bg-slate-800 dark:border-slate-700 dark:text-white";

export function VideoForm({
  video,
  channels,
  programs,
}: {
  video?: VideoWithRelations;
  channels: Channel[];
  programs: Program[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = video
        ? await updateVideo(video.id, formData)
        : await createVideo(formData);

      if (result?.error) {
        toast.error("تحقق من الحقول المطلوبة");
        return;
      }
      toast.success(video ? "تم التحديث" : "تم الإنشاء");
      router.push("/admin/videos");
      router.refresh();
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4 max-w-2xl">
      <div>
        <Label htmlFor="title">العنوان *</Label>
        <Input id="title" name="title" defaultValue={video?.title} required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="description">الوصف</Label>
        <Textarea id="description" name="description" defaultValue={video?.description ?? ""} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="videoUrl">رابط الفيديو *</Label>
        <Input id="videoUrl" name="videoUrl" defaultValue={video?.videoUrl} required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="thumbnail">رابط الصورة المصغرة</Label>
        <Input id="thumbnail" name="thumbnail" defaultValue={video?.thumbnail ?? ""} className="mt-1" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration">المدة (ثواني)</Label>
          <Input id="duration" name="duration" type="number" defaultValue={video?.duration ?? ""} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="category">التصنيف</Label>
          <Input id="category" name="category" defaultValue={video?.category ?? ""} className="mt-1" />
        </div>
      </div>
      <div>
        <Label htmlFor="tags">الوسوم (مفصولة بفاصلة)</Label>
        <Input id="tags" name="tags" defaultValue={video?.tags?.replace(/,/g, ", ") ?? ""} className="mt-1" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="channelId">القناة</Label>
          <select id="channelId" name="channelId" defaultValue={video?.channelId ?? ""} className={`mt-1 ${selectClass}`}>
            <option value="">بدون قناة</option>
            {channels.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="programId">البرنامج</Label>
          <select id="programId" name="programId" defaultValue={video?.programId ?? ""} className={`mt-1 ${selectClass}`}>
            <option value="">بدون برنامج</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <Label htmlFor="status">الحالة</Label>
        <select id="status" name="status" defaultValue={video?.status ?? "DRAFT"} className={`mt-1 ${selectClass}`}>
          <option value="DRAFT">مسودة</option>
          <option value="PUBLISHED">منشور</option>
          <option value="ARCHIVED">مؤرشف</option>
          <option value="HIDDEN">مخفي</option>
        </select>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" name="featured" defaultChecked={video?.featured} className="rounded" />
        <span className="text-sm font-semibold">فيديو مميز (Hero)</span>
      </label>
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={pending}>
          {pending ? "جاري الحفظ..." : video ? "تحديث" : "إنشاء"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          إلغاء
        </Button>
      </div>
    </form>
  );
}
