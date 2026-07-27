import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteProgram } from "@/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminProgramsPage() {
  const programs = await prisma.program.findMany({
    include: { channel: true, _count: { select: { videos: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black dark:text-white">إدارة البرامج</h1>
        <Button asChild>
          <Link href="/admin/programs/new"><Plus className="h-4 w-4" />برنامج جديد</Link>
        </Button>
      </div>
      <div className="space-y-3">
        {programs.map((program) => (
          <div key={program.id} className="flex items-center justify-between p-4 rounded-xl border bg-white dark:bg-slate-900 dark:border-slate-800">
            <div>
              <h3 className="font-bold dark:text-white">{program.name}</h3>
              <p className="text-sm text-[#C1121F]">{program.channel.name}</p>
              <p className="text-xs text-gray-400 mt-1">{program._count.videos} حلقة</p>
            </div>
            <DeleteButton onDelete={() => deleteProgram(program.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
