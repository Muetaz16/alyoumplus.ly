import { prisma } from "@/lib/prisma";
import { ProgramForm } from "@/components/admin/program-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewProgramPage() {
  const channels = await prisma.channel.findMany({ orderBy: { name: "asc" } });

  return (
    <Card className="dark:bg-slate-900 dark:border-slate-800">
      <CardHeader><CardTitle className="dark:text-white">برنامج جديد</CardTitle></CardHeader>
      <CardContent><ProgramForm channels={channels} /></CardContent>
    </Card>
  );
}
