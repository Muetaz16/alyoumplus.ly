"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import {
  videoSchema,
  channelSchema,
  programSchema,
  liveStreamSchema,
  userSchema,
} from "@/lib/validations";
import { slugify } from "@/lib/utils";

async function ensureUniqueSlug(base: string, model: "video" | "channel" | "program" | "live") {
  const baseSlug = slugify(base);
  let counter = 0;
  while (true) {
    const testSlug = counter ? `${baseSlug}-${counter}` : baseSlug;
    let exists = false;
    if (model === "video") exists = !!(await prisma.video.findUnique({ where: { slug: testSlug } }));
    if (model === "channel") exists = !!(await prisma.channel.findUnique({ where: { slug: testSlug } }));
    if (model === "live") exists = !!(await prisma.liveStream.findUnique({ where: { slug: testSlug } }));
    if (!exists) return testSlug;
    counter++;
  }
}

// Videos
export async function createVideo(formData: FormData) {
  await requireAuth();
  const raw = Object.fromEntries(formData);
  const parsed = videoSchema.safeParse({
    ...raw,
    featured: raw.featured === "on" || raw.featured === "true",
    duration: raw.duration ? Number(raw.duration) : undefined,
  });
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const slug = await ensureUniqueSlug(parsed.data.title, "video");
  const tags = parsed.data.tags
    ? String(parsed.data.tags).split(",").map((t) => t.trim()).filter(Boolean).join(",")
    : "";

  await prisma.video.create({
    data: {
      ...parsed.data,
      slug,
      tags,
      thumbnail: parsed.data.thumbnail || null,
      channelId: parsed.data.channelId || null,
      programId: parsed.data.programId || null,
    },
  });
  revalidatePath("/");
  revalidatePath("/videos");
  revalidatePath("/admin/videos");
  return { success: true };
}

export async function updateVideo(id: string, formData: FormData) {
  await requireAuth();
  const raw = Object.fromEntries(formData);
  const parsed = videoSchema.safeParse({
    ...raw,
    featured: raw.featured === "on" || raw.featured === "true",
    duration: raw.duration ? Number(raw.duration) : undefined,
  });
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const tags = parsed.data.tags
    ? String(parsed.data.tags).split(",").map((t) => t.trim()).filter(Boolean).join(",")
    : "";

  await prisma.video.update({
    where: { id },
    data: {
      ...parsed.data,
      tags,
      thumbnail: parsed.data.thumbnail || null,
      channelId: parsed.data.channelId || null,
      programId: parsed.data.programId || null,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/videos");
  return { success: true };
}

export async function deleteVideo(id: string) {
  await requireAuth();
  await prisma.video.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/videos");
  return { success: true };
}

// Channels
export async function createChannel(formData: FormData) {
  await requireAuth();
  const raw = Object.fromEntries(formData);
  const parsed = channelSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const slug = await ensureUniqueSlug(parsed.data.name, "channel");
  await prisma.channel.create({
    data: { ...parsed.data, slug, logo: parsed.data.logo || null, coverImage: parsed.data.coverImage || null },
  });
  revalidatePath("/channels");
  revalidatePath("/admin/channels");
  return { success: true };
}

export async function updateChannel(id: string, formData: FormData) {
  await requireAuth();
  const raw = Object.fromEntries(formData);
  const parsed = channelSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  await prisma.channel.update({
    where: { id },
    data: { ...parsed.data, logo: parsed.data.logo || null, coverImage: parsed.data.coverImage || null },
  });
  revalidatePath("/channels");
  revalidatePath("/admin/channels");
  return { success: true };
}

export async function deleteChannel(id: string) {
  await requireAuth("ADMIN");
  await prisma.channel.delete({ where: { id } });
  revalidatePath("/admin/channels");
  return { success: true };
}

// Programs
export async function createProgram(formData: FormData) {
  await requireAuth();
  const raw = Object.fromEntries(formData);
  const parsed = programSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const slug = slugify(parsed.data.name);
  await prisma.program.create({
    data: { ...parsed.data, slug, coverImage: parsed.data.coverImage || null },
  });
  revalidatePath("/programs");
  revalidatePath("/admin/programs");
  return { success: true };
}

export async function deleteProgram(id: string) {
  await requireAuth();
  await prisma.program.delete({ where: { id } });
  revalidatePath("/admin/programs");
  return { success: true };
}

// Live Streams
export async function createLiveStream(formData: FormData) {
  await requireAuth();
  const raw = Object.fromEntries(formData);
  const parsed = liveStreamSchema.safeParse({
    ...raw,
    isActive: raw.isActive === "on" || raw.isActive === "true",
  });
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const slug = await ensureUniqueSlug(parsed.data.title, "live");
  await prisma.liveStream.create({
    data: {
      ...parsed.data,
      slug,
      thumbnail: parsed.data.thumbnail || null,
      channelId: parsed.data.channelId || null,
    },
  });
  revalidatePath("/live");
  revalidatePath("/admin/live");
  return { success: true };
}

export async function updateLiveStream(id: string, formData: FormData) {
  await requireAuth();
  const raw = Object.fromEntries(formData);
  const parsed = liveStreamSchema.safeParse({
    ...raw,
    isActive: raw.isActive === "on" || raw.isActive === "true",
  });
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  await prisma.liveStream.update({
    where: { id },
    data: {
      ...parsed.data,
      thumbnail: parsed.data.thumbnail || null,
      channelId: parsed.data.channelId || null,
    },
  });
  revalidatePath("/live");
  revalidatePath("/admin/live");
  return { success: true };
}

export async function toggleLiveStream(id: string, active: boolean) {
  await requireAuth();
  if (active) {
    await prisma.liveStream.updateMany({ data: { isActive: false } });
  }
  await prisma.liveStream.update({ where: { id }, data: { isActive: active } });
  revalidatePath("/");
  revalidatePath("/live");
  revalidatePath("/admin/live");
  return { success: true };
}

export async function deleteLiveStream(id: string) {
  await requireAuth();
  await prisma.liveStream.delete({ where: { id } });
  revalidatePath("/admin/live");
  return { success: true };
}

// Users
export async function createUser(formData: FormData) {
  await requireAuth("ADMIN");
  const raw = Object.fromEntries(formData);
  const parsed = userSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };
  if (!parsed.data.password) return { error: { password: ["كلمة المرور مطلوبة"] } };

  const hashed = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashed,
      role: parsed.data.role,
    },
  });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(id: string) {
  await requireAuth("ADMIN");
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
  return { success: true };
}
