"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// ----------------------------------------------------
// SEEDING HELPER (Initial run)
// ----------------------------------------------------
export async function seedDatabaseIfNeeded() {
  const adminCount = await prisma.adminUser.count();
  if (adminCount === 0) {
    const hashedPassword = await bcrypt.hash("motaz123", 10);
    await prisma.adminUser.create({
      data: {
        email: "motaz@gmail.com",
        password: hashedPassword,
        name: "رئيس التحرير",
        role: "ADMIN",
      },
    });
  }

  const contactCount = await prisma.contactSetting.count();
  if (contactCount === 0) {
    await prisma.contactSetting.create({
      data: {
        id: 1,
        phone: "+218928175897",
        email: "info@libyaplus.ly",
        address: "طرابلس، ليبيا",
        whatsapp: "218928175897",
        telegram: "+218928175897",
        facebook: "libyaplus.official",
        advertisingPlans: JSON.stringify([]),
      },
    });
  }

  // Ticker seed
  const tickerExists = await prisma.generalSetting.findUnique({ where: { id: "ticker" } });
  if (!tickerExists) {
    await prisma.generalSetting.create({
      data: {
        id: "ticker",
        items: JSON.stringify([
          " اليوم plus الرقمية تطلق منصتها التفاعلية الجديدة كلياً للبث الحي والمباشر.",
          "تغطية خاصة ومباشرة لفعاليات مهرجان بنغازي الثقافي والفني الدولي.",
          "تحديث مستمر على مدار 24 ساعة لآخر الأخبار والتقارير الإقليمية والمحلية.",
          "ترقبوا اللقاء الإعلامي الحصري مع نخبة من صناع القرار والمبدعين الليلة الليلة."
        ])
      }
    });
  }

  // Poll seed
  const pollExists = await prisma.generalSetting.findUnique({ where: { id: "poll" } });
  if (!pollExists) {
    await prisma.generalSetting.create({
      data: {
        id: "poll",
        items: "",
        question: "ما هي نوعية التغطية الإعلامية التي تود رؤيتها بكثافة أكبر على منصة اليوم plus؟",
        option1: "التغطيات الإخبارية المباشرة للأحداث المحلية",
        option2: "تقارير الفيديو الوثائقية والبرامج السياسية",
        option3: "مقاطع الريلز القصيرة والتغطيات الميدانية الخفيفة",
        votes1: 154,
        votes2: 108,
        votes3: 78
      }
    });
  }
}

// ----------------------------------------------------
// AUTH ACTIONS
// ----------------------------------------------------
export async function adminLoginAction(email: string, password: string) {
  await seedDatabaseIfNeeded();
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) {
    return { success: false, error: "المستخدم غير موجود" };
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    // Fallback support for plain text if password wasn't hashed during manual setup
    if (password === user.password) {
      return { success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
    }
    return { success: false, error: "كلمة المرور غير صحيحة" };
  }
  return {
    success: true,
    user: { id: user.id, email: user.email, name: user.name, role: user.role }
  };
}

// ----------------------------------------------------
// ADMIN USERS
// ----------------------------------------------------
export async function getAdminUsers() {
  return prisma.adminUser.findMany({
    orderBy: { id: "asc" }
  });
}

export async function createAdminUser(data: any) {
  const hashedPassword = await bcrypt.hash(data.password || "123456", 10);
  return prisma.adminUser.create({
    data: {
      email: data.email,
      name: data.name,
      role: data.role || "EDITOR",
      password: hashedPassword
    }
  });
}

export async function updateAdminUser(id: number, data: any) {
  const updateData: any = {
    email: data.email,
    name: data.name,
    role: data.role
  };
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }
  return prisma.adminUser.update({
    where: { id },
    data: updateData
  });
}

export async function deleteAdminUser(id: number) {
  return prisma.adminUser.delete({
    where: { id }
  });
}

// ----------------------------------------------------
// CATEGORIES
// ----------------------------------------------------
export async function getCategories(options: any = {}) {
  await seedDatabaseIfNeeded();
  let whereClause: any = {};
  if (options?.where?.slug?.not) {
    whereClause.slug = { not: options.where.slug.not };
  }
  return prisma.category.findMany({
    where: whereClause,
    orderBy: { id: "asc" }
  });
}

export async function getCategoryCount() {
  return prisma.category.count();
}

export async function findCategoryUnique(where: { id?: number; slug?: string }) {
  if (where.id) {
    return prisma.category.findUnique({ where: { id: where.id } });
  }
  if (where.slug) {
    return prisma.category.findUnique({ where: { slug: where.slug } });
  }
  return null;
}

export async function createCategory(data: any) {
  return prisma.category.create({ data });
}

export async function updateCategory(id: number, data: any) {
  return prisma.category.update({
    where: { id },
    data
  });
}

export async function deleteCategory(id: number) {
  return prisma.category.delete({
    where: { id }
  });
}

// ----------------------------------------------------
// VIDEOS
// ----------------------------------------------------
export async function getVideoCount() {
  return prisma.video.count();
}

export async function findFirstVideo(options: any = {}) {
  await seedDatabaseIfNeeded();
  const where: any = {};
  if (options?.where?.type) {
    where.type = options.where.type;
  }
  if (options?.where?.isFeatured !== undefined) {
    where.isFeatured = options.where.isFeatured;
  }
  return prisma.video.findFirst({
    where,
    orderBy: { createdAt: "desc" }
  });
}

export async function getVideos(options: any = {}) {
  await seedDatabaseIfNeeded();
  const where: any = {};
  if (options?.where?.type) {
    where.type = options.where.type;
  }
  if (options?.where?.isFeatured !== undefined) {
    where.isFeatured = options.where.isFeatured;
  }
  if (options?.where?.categoryId !== undefined) {
    where.categoryId = options.where.categoryId;
  }
  if (options?.where?.category?.slug) {
    where.category = { slug: options.where.category.slug };
  }

  const include: any = {};
  if (options?.include?.category) {
    include.category = true;
  }

  return prisma.video.findMany({
    where,
    include: Object.keys(include).length > 0 ? include : undefined,
    orderBy: { createdAt: "desc" },
    take: options?.take || undefined
  });
}

export async function createVideo(data: any) {
  return prisma.video.create({
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      url: data.url,
      thumbnail: data.thumbnail,
      views: data.views !== undefined ? Number(data.views) : 0,
      likes: data.likes !== undefined ? Number(data.likes) : 0,
      isFeatured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : false,
      categoryId: data.categoryId ? Number(data.categoryId) : null,
    }
  });
}

export async function updateVideo(id: number, data: any) {
  return prisma.video.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      url: data.url,
      thumbnail: data.thumbnail,
      views: data.views !== undefined ? Number(data.views) : undefined,
      likes: data.likes !== undefined ? Number(data.likes) : undefined,
      isFeatured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : undefined,
      categoryId: data.categoryId !== undefined ? (data.categoryId ? Number(data.categoryId) : null) : undefined,
    }
  });
}

export async function deleteVideo(id: number) {
  return prisma.video.delete({
    where: { id }
  });
}

// ----------------------------------------------------
// CONTACT SETTINGS
// ----------------------------------------------------
export async function getContactSetting() {
  await seedDatabaseIfNeeded();
  return prisma.contactSetting.findFirst();
}

export async function createContactSetting(data: any) {
  return prisma.contactSetting.create({
    data: {
      phone: data.phone,
      email: data.email,
      address: data.address,
      whatsapp: data.whatsapp,
      telegram: data.telegram,
      facebook: data.facebook,
      advertisingPlans: data.advertisingPlans,
      exchangeUsd: data.exchangeUsd,
      exchangeEur: data.exchangeEur,
      exchangeGbp: data.exchangeGbp,
    }
  });
}

export async function updateContactSetting(id: number, data: any) {
  return prisma.contactSetting.update({
    where: { id },
    data
  });
}

export async function upsertContactSetting(data: any) {
  return prisma.contactSetting.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data }
  });
}

// ----------------------------------------------------
// GENERAL SETTINGS
// ----------------------------------------------------
export async function getGeneralSetting(id: string) {
  await seedDatabaseIfNeeded();
  const setting = await prisma.generalSetting.findUnique({ where: { id } });
  if (!setting) return null;

  if (id === "ticker") {
    try {
      return {
        id,
        docId: id,
        items: JSON.parse(setting.items)
      };
    } catch {
      return { id, docId: id, items: [] };
    }
  }

  return {
    ...setting,
    docId: setting.id
  };
}

export async function upsertGeneralSetting(id: string, data: any) {
  let payload: any = {
    id
  };

  if (id === "ticker") {
    payload.items = JSON.stringify(data.items || []);
  } else if (id === "poll") {
    payload.items = "";
    payload.question = data.question;
    payload.option1 = data.option1;
    payload.option2 = data.option2;
    payload.option3 = data.option3;
    if (data.votes1 !== undefined) payload.votes1 = Number(data.votes1);
    if (data.votes2 !== undefined) payload.votes2 = Number(data.votes2);
    if (data.votes3 !== undefined) payload.votes3 = Number(data.votes3);
  }

  const result = await prisma.generalSetting.upsert({
    where: { id },
    update: payload,
    create: payload
  });

  if (id === "ticker") {
    return {
      id: result.id,
      docId: result.id,
      items: JSON.parse(result.items)
    };
  }

  return {
    ...result,
    docId: result.id
  };
}
