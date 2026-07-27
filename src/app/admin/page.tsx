import { auth } from "@/lib/auth";
import { getDashboardStats } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsChart } from "@/components/admin/stats-chart";
import { Video, Tv, Eye, Radio } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await auth();
  const stats = await getDashboardStats();

  const cards = [
    { label: "الفيديوهات", value: stats.videos, icon: Video, color: "bg-red-500" },
    { label: "القنوات", value: stats.channels, icon: Tv, color: "bg-blue-500" },
    { label: "المشاهدات", value: stats.totalViews, icon: Eye, color: "bg-green-500" },
    { label: "بثوث نشطة", value: stats.liveStreams, icon: Radio, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-[#111827] dark:text-white">لوحة التحكم</h1>
        <p className="text-gray-500 mt-1">مرحباً، {session?.user?.name}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="dark:bg-slate-900 dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{card.label}</p>
                    <p className="text-3xl font-black mt-1 dark:text-white">
                      {formatNumber(card.value)}
                    </p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="dark:bg-slate-900 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="dark:text-white">إحصائيات المشاهدات</CardTitle>
        </CardHeader>
        <CardContent>
          <StatsChart />
        </CardContent>
      </Card>
    </div>
  );
}
