import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteVideo } from "@/actions/admin";
import { formatDateAr } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  DRAFT: "مسودة",
  PUBLISHED: "منشور",
  ARCHIVED: "مؤرشف",
  HIDDEN: "مخفي",
};

export default async function AdminVideosPage() {
  const videos = await prisma.video.findMany({
    include: { channel: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black dark:text-white">إدارة الفيديوهات</h1>
        <Button asChild>
          <Link href="/admin/videos/new">
            <Plus className="h-4 w-4" />
            فيديو جديد
          </Link>
        </Button>
      </div>

      <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-slate-800">
            <tr>
              <th className="text-right p-4 font-bold">العنوان</th>
              <th className="text-right p-4 font-bold">القناة</th>
              <th className="text-right p-4 font-bold">الحالة</th>
              <th className="text-right p-4 font-bold">المشاهدات</th>
              <th className="text-right p-4 font-bold">التاريخ</th>
              <th className="text-right p-4 font-bold">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video.id} className="border-t border-gray-100 dark:border-slate-800">
                <td className="p-4 font-medium dark:text-white">{video.title}</td>
                <td className="p-4 text-gray-500">{video.channel?.name ?? "—"}</td>
                <td className="p-4">
                  <Badge variant={video.status === "PUBLISHED" ? "default" : "secondary"}>
                    {statusLabels[video.status]}
                  </Badge>
                </td>
                <td className="p-4">{video.views}</td>
                <td className="p-4 text-gray-500">{formatDateAr(video.createdAt)}</td>
                <td className="p-4 flex gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/videos/${video.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeleteButton onDelete={() => deleteVideo(video.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
