import { prisma } from "@/lib/prisma";
import { LiveForm } from "@/components/admin/live-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewLivePage() {
  const channels = await prisma.channel.findMany({ orderBy: { name: "asc" } });

  return (
    <Card className="dark:bg-slate-900 dark:border-slate-800">
      <CardHeader><CardTitle className="dark:text-white">بث مباشر جديد</CardTitle></CardHeader>
      <CardContent><LiveForm channels={channels} /></CardContent>
    </Card>
  );
}
