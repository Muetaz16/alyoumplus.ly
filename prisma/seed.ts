import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 بدء تعبئة قاعدة البيانات...");

  const adminPassword = await bcrypt.hash("admin123", 12);
  const editorPassword = await bcrypt.hash("editor123", 12);

  await prisma.user.upsert({
    where: { email: "admin@libyaplus.ly" },
    update: {},
    create: {
      email: "admin@libyaplus.ly",
      password: adminPassword,
      name: "مدير النظام",
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "editor@libyaplus.ly" },
    update: {},
    create: {
      email: "editor@libyaplus.ly",
      password: editorPassword,
      name: "محرر المحتوى",
      role: "EDITOR",
    },
  });

  const news = await prisma.channel.upsert({
    where: { slug: "news" },
    update: {},
    create: {
      name: "قناة الأخبار",
      slug: "news",
      description: "آخر الأخبار المحلية والعالمية على مدار الساعة",
      logo: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&h=200&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&h=400&fit=crop",
    },
  });

  const sports = await prisma.channel.upsert({
    where: { slug: "sports" },
    update: {},
    create: {
      name: "قناة الرياضة",
      slug: "sports",
      description: "كل ما يخص الرياضة الليبية والعربية والعالمية",
      logo: "https://images.unsplash.com/photo-1461896836934-ffe607cdbea5?w=200&h=200&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=400&fit=crop",
    },
  });

  const business = await prisma.channel.upsert({
    where: { slug: "business" },
    update: {},
    create: {
      name: "قناة الاقتصاد",
      slug: "business",
      description: "أخبار الاقتصاد والأعمال والأسواق",
      logo: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=200&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=400&fit=crop",
    },
  });

  const bulletin = await prisma.program.upsert({
    where: { channelId_slug: { channelId: news.id, slug: "news-bulletin" } },
    update: {},
    create: {
      name: "نشرة الأخبار",
      slug: "news-bulletin",
      description: "نشرة إخبارية يومية شاملة",
      channelId: news.id,
    },
  });

  const sportsShow = await prisma.program.upsert({
    where: { channelId_slug: { channelId: sports.id, slug: "sports-show" } },
    update: {},
    create: {
      name: "برنامج رياضي",
      slug: "sports-show",
      description: "تحليلات ومباريات ونتائج",
      channelId: sports.id,
    },
  });

  const ecoShow = await prisma.program.upsert({
    where: { channelId_slug: { channelId: business.id, slug: "eco-show" } },
    update: {},
    create: {
      name: "برنامج اقتصادي",
      slug: "eco-show",
      description: "تحليلات اقتصادية وأسواق",
      channelId: business.id,
    },
  });

  const videos = [
    {
      title: "نشرة الأخبار الرئيسية - ليبيا اليوم",
      slug: "main-news-bulletin",
      description: "تغطية شاملة لأهم أحداث ليبيا والعالم في نشرة مسائية",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnail: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1280&h=720&fit=crop",
      duration: 720,
      category: "أخبار",
      tags: "ليبيا,أخبار,نشرة",
      views: 15420,
      featured: true,
      channelId: news.id,
      programId: bulletin.id,
    },
    {
      title: "تطورات الأوضاع الاقتصادية في ليبيا",
      slug: "libya-economic-update",
      description: "تحليل معمق للمؤشرات الاقتصادية والفرص الاستثمارية",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1280&h=720&fit=crop",
      duration: 540,
      category: "اقتصاد",
      tags: "اقتصاد,ليبيا",
      views: 8750,
      channelId: business.id,
      programId: ecoShow.id,
    },
    {
      title: "ملخص مباريات الدوري الليبي",
      slug: "libyan-league-summary",
      description: "أبرز لحظات الجولة الأخيرة من الدوري الليبي الممتاز",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1280&h=720&fit=crop",
      duration: 480,
      category: "رياضة",
      tags: "رياضة,كرة قدم",
      views: 22100,
      channelId: sports.id,
      programId: sportsShow.id,
    },
    {
      title: "حوار مع خبير سياسي حول مستقبل ليبيا",
      slug: "political-expert-interview",
      description: "حوار خاص مع أحد أبرز المحللين السياسيين",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumbnail: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1280&h=720&fit=crop",
      duration: 900,
      category: "أخبار",
      tags: "سياسة,حوار",
      views: 12300,
      channelId: news.id,
    },
    {
      title: "تقرير: مشاريع البنية التحتية الجديدة",
      slug: "infrastructure-report",
      description: "جولة في أهم مشاريع البنية التحتية قيد التنفيذ",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      thumbnail: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1280&h=720&fit=crop",
      duration: 600,
      category: "اقتصاد",
      tags: "بنية تحتية,تنمية",
      views: 6800,
      channelId: business.id,
    },
    {
      title: "تحليل مباراة القمة الليبية",
      slug: "libyan-derby-analysis",
      description: "تحليل فني شامل لأحداث مباراة القمة",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      thumbnail: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1280&h=720&fit=crop",
      duration: 420,
      category: "رياضة",
      tags: "كرة قدم,تحليل",
      views: 18900,
      channelId: sports.id,
    },
    {
      title: "أخبار الطقس والبيئة في ليبيا",
      slug: "weather-environment-news",
      description: "توقعات الطقس والتنبيهات البيئية",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      thumbnail: "https://images.unsplash.com/photo-1504608524841-42fe6f008b4b?w=1280&h=720&fit=crop",
      duration: 300,
      category: "أخبار",
      tags: "طقس,بيئة",
      views: 4500,
      channelId: news.id,
    },
    {
      title: "أسواق النفط والطاقة - تقرير أسبوعي",
      slug: "oil-energy-weekly",
      description: "متابعة أسعار النفط وتأثيرها على الاقتصاد الليبي",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      thumbnail: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1280&h=720&fit=crop",
      duration: 660,
      category: "اقتصاد",
      tags: "نفط,طاقة",
      views: 11200,
      channelId: business.id,
    },
  ];

  for (const video of videos) {
    await prisma.video.upsert({
      where: { slug: video.slug },
      update: { status: "PUBLISHED" },
      create: { ...video, status: "PUBLISHED" },
    });
  }

  await prisma.liveStream.upsert({
    where: { slug: "main-live" },
    update: { isActive: true },
    create: {
      title: "البث المباشر - قناة الأخبار",
      slug: "main-live",
      description: "تابع آخر الأخبار مباشرةً من استوديو ليبيا بلس",
      streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
      streamType: "M3U8",
      thumbnail: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1280&h=720&fit=crop",
      isActive: true,
      viewerCount: 2847,
      channelId: news.id,
    },
  });

  await prisma.liveStream.upsert({
    where: { slug: "sports-live" },
    update: {},
    create: {
      title: "بث مباشر - قناة الرياضة",
      slug: "sports-live",
      description: "مباريات وأحداث رياضية مباشرة",
      streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
      streamType: "HLS",
      thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1280&h=720&fit=crop",
      isActive: false,
      viewerCount: 0,
      channelId: sports.id,
    },
  });

  console.log("✅ تم تعبئة قاعدة البيانات بنجاح!");
  console.log("");
  console.log("📧 حسابات الدخول:");
  console.log("   Admin:  admin@libyaplus.ly / admin123");
  console.log("   Editor: editor@libyaplus.ly / editor123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
