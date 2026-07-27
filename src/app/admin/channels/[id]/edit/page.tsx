import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ChannelForm } from "@/components/admin/channel-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { params: Promise<{ id: string }> };

export default async function EditChannelPage({ params }: Props) {
  const { id } = await params;
  const channel = await prisma.channel.findUnique({ where: { id } });
  if (!channel) notFound();

  return (
    <Card className="dark:bg-slate-900 dark:border-slate-800">
      <CardHeader><CardTitle className="dark:text-white">تعديل القناة</CardTitle></CardHeader>
      <CardContent><ChannelForm channel={channel} /></CardContent>
    </Card>
  );
}
