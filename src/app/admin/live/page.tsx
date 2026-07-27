import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";
import { LiveToggle } from "@/components/admin/live-toggle";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteLiveStream } from "@/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminLivePage() {
  const streams = await prisma.liveStream.findMany({
    include: { channel: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black dark:text-white">إدارة البث المباشر</h1>
        <Button asChild>
          <Link href="/admin/live/new"><Plus className="h-4 w-4" />بث جديد</Link>
        </Button>
      </div>
      <div className="space-y-4">
        {streams.map((stream) => (
          <div key={stream.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border bg-white dark:bg-slate-900 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold dark:text-white">{stream.title}</h3>
                {stream.isActive && <Badge variant="live">مباشر</Badge>}
              </div>
              <p className="text-sm text-gray-500 mt-1">{stream.streamType} · {stream.channel?.name ?? "—"}</p>
              <p className="text-xs text-gray-400 mt-1 truncate max-w-md">{stream.streamUrl}</p>
            </div>
            <div className="flex items-center gap-2">
              <LiveToggle id={stream.id} isActive={stream.isActive} />
              <Button asChild variant="ghost" size="sm">
                <Link href={`/admin/live/${stream.id}/edit`}><Pencil className="h-4 w-4" /></Link>
              </Button>
              <DeleteButton onDelete={() => deleteLiveStream(stream.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
