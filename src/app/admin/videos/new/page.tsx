import { prisma } from "@/lib/prisma";
import { VideoForm } from "@/components/admin/video-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewVideoPage() {
  const [channels, programs] = await Promise.all([
    prisma.channel.findMany({ orderBy: { name: "asc" } }),
    prisma.program.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <Card className="dark:bg-slate-900 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="dark:text-white">إنشاء فيديو جديد</CardTitle>
      </CardHeader>
      <CardContent>
        <VideoForm channels={channels} programs={programs} />
      </CardContent>
    </Card>
  );
}
