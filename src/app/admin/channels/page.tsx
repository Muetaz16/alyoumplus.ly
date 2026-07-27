import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteChannel } from "@/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminChannelsPage() {
  const channels = await prisma.channel.findMany({
    include: { _count: { select: { videos: true, programs: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black dark:text-white">إدارة القنوات</h1>
        <Button asChild>
          <Link href="/admin/channels/new"><Plus className="h-4 w-4" />قناة جديدة</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((channel) => (
          <div key={channel.id} className="p-5 rounded-2xl border bg-white dark:bg-slate-900 dark:border-slate-800">
            <h3 className="font-bold text-lg dark:text-white">{channel.name}</h3>
            <p className="text-sm text-gray-500 mt-1">/{channel.slug}</p>
            <p className="text-xs text-gray-400 mt-2">
              {channel._count.videos} فيديو · {channel._count.programs} برنامج
            </p>
            <div className="flex gap-2 mt-4">
              <Button asChild variant="ghost" size="sm">
                <Link href={`/admin/channels/${channel.id}/edit`}><Pencil className="h-4 w-4" /></Link>
              </Button>
              <DeleteButton onDelete={() => deleteChannel(channel.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
