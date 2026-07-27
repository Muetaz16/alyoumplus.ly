import { prisma } from "@/lib/prisma";
import type { ContentStatus } from "@prisma/client";

const publishedFilter = { status: "PUBLISHED" as ContentStatus };

export async function getFeaturedVideo() {
  return prisma.video.findFirst({
    where: { ...publishedFilter, featured: true },
    include: { channel: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getLatestVideos(limit = 8) {
  return prisma.video.findMany({
    where: publishedFilter,
    include: { channel: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getPopularVideos(limit = 8) {
  return prisma.video.findMany({
    where: publishedFilter,
    include: { channel: true },
    orderBy: { views: "desc" },
    take: limit,
  });
}

export async function getActiveLiveStream() {
  return prisma.liveStream.findFirst({
    where: { isActive: true },
    include: { channel: true },
  });
}

export async function getAllChannels() {
  return prisma.channel.findMany({
    include: {
      _count: { select: { videos: true, programs: true } },
    },
    orderBy: { name: "asc" },
  });
}

export async function getChannelBySlug(slug: string) {
  return prisma.channel.findUnique({
    where: { slug },
    include: {
      videos: {
        where: publishedFilter,
        orderBy: { createdAt: "desc" },
        take: 12,
      },
      programs: {
        include: { _count: { select: { videos: true } } },
      },
      liveStreams: { where: { isActive: true }, take: 1 },
    },
  });
}

export async function getVideoBySlug(slug: string) {
  return prisma.video.findUnique({
    where: { slug },
    include: { channel: true, program: true },
  });
}

export async function getSuggestedVideos(
  videoId: string,
  channelId?: string | null,
  limit = 8
) {
  return prisma.video.findMany({
    where: {
      ...publishedFilter,
      id: { not: videoId },
      ...(channelId ? { channelId } : {}),
    },
    include: { channel: true },
    orderBy: { views: "desc" },
    take: limit,
  });
}

export async function getProgramBySlug(channelSlug: string, programSlug: string) {
  const channel = await prisma.channel.findUnique({ where: { slug: channelSlug } });
  if (!channel) return null;
  return prisma.program.findUnique({
    where: { channelId_slug: { channelId: channel.id, slug: programSlug } },
    include: {
      channel: true,
      videos: { where: publishedFilter, orderBy: { createdAt: "desc" } },
    },
  });
}

export async function getAllPrograms() {
  return prisma.program.findMany({
    include: { channel: true, _count: { select: { videos: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllLiveStreams() {
  return prisma.liveStream.findMany({
    include: { channel: true },
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
  });
}

export async function searchContent(query: string) {
  const q = query.trim();
  if (!q) return { videos: [], channels: [] };

  const [videos, channels] = await Promise.all([
    prisma.video.findMany({
      where: {
        ...publishedFilter,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      include: { channel: true },
      take: 12,
    }),
    prisma.channel.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 6,
    }),
  ]);

  return { videos, channels };
}

export async function getDashboardStats() {
  const [videos, channels, liveStreams, viewsAgg] = await Promise.all([
    prisma.video.count(),
    prisma.channel.count(),
    prisma.liveStream.count({ where: { isActive: true } }),
    prisma.video.aggregate({ _sum: { views: true } }),
  ]);

  return {
    videos,
    channels,
    liveStreams,
    totalViews: viewsAgg._sum.views ?? 0,
  };
}

export async function incrementVideoViews(slug: string) {
  await prisma.video.update({
    where: { slug },
    data: { views: { increment: 1 } },
  });
}
