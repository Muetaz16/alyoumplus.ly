import { ChannelForm } from "@/components/admin/channel-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewChannelPage() {
  return (
    <Card className="dark:bg-slate-900 dark:border-slate-800">
      <CardHeader><CardTitle className="dark:text-white">قناة جديدة</CardTitle></CardHeader>
      <CardContent><ChannelForm /></CardContent>
    </Card>
  );
}
