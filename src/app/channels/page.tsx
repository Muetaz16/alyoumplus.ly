import { getAllChannels } from "@/lib/data";
import { SectionHeader } from "@/components/home/section-header";
import { ChannelCard } from "@/components/channel/channel-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "القنوات",
  description: "استكشف قنوات ليبيا بلس",
};

export const dynamic = "force-dynamic";

export default async function ChannelsPage() {
  const channels = await getAllChannels();

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <SectionHeader title="قنوات ليبيا بلس" subtitle="محتوى متنوع لكل اهتماماتك" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels.map((channel, i) => (
            <ChannelCard key={channel.id} channel={channel} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
