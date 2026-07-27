import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LiveForm } from "@/components/admin/live-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { params: Promise<{ id: string }> };

export default async function EditLivePage({ params }: Props) {
  const { id } = await params;
  const [stream, channels] = await Promise.all([
    prisma.liveStream.findUnique({ where: { id } }),
    prisma.channel.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!stream) notFound();

  return (
    <Card className="dark:bg-slate-900 dark:border-slate-800">
      <CardHeader><CardTitle className="dark:text-white">تعديل البث</CardTitle></CardHeader>
      <CardContent><LiveForm stream={stream} channels={channels} /></CardContent>
    </Card>
  );
}
