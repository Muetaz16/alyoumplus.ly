import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VideoForm } from "@/components/admin/video-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { params: Promise<{ id: string }> };

export default async function EditVideoPage({ params }: Props) {
  const { id } = await params;
  const [video, channels, programs] = await Promise.all([
    prisma.video.findUnique({ where: { id }, include: { channel: true, program: true } }),
    prisma.channel.findMany({ orderBy: { name: "asc" } }),
    prisma.program.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!video) notFound();

  return (
    <Card className="dark:bg-slate-900 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="dark:text-white">تعديل الفيديو</CardTitle>
      </CardHeader>
      <CardContent>
        <VideoForm video={video} channels={channels} programs={programs} />
      </CardContent>
    </Card>
  );
}
