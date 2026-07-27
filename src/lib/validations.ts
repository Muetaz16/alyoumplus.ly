import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export const videoSchema = z.object({
  title: z.string().min(3, "العنوان مطلوب"),
  description: z.string().optional(),
  videoUrl: z.string().url("رابط الفيديو غير صالح"),
  thumbnail: z.string().url().optional().or(z.literal("")),
  duration: z.coerce.number().int().positive().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  channelId: z.string().optional(),
  programId: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "HIDDEN"]),
  featured: z.boolean().optional(),
});

export const channelSchema = z.object({
  name: z.string().min(2, "اسم القناة مطلوب"),
  description: z.string().optional(),
  logo: z.string().url().optional().or(z.literal("")),
  coverImage: z.string().url().optional().or(z.literal("")),
});

export const programSchema = z.object({
  name: z.string().min(2, "اسم البرنامج مطلوب"),
  description: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  channelId: z.string().min(1, "القناة مطلوبة"),
});

export const liveStreamSchema = z.object({
  title: z.string().min(3, "العنوان مطلوب"),
  description: z.string().optional(),
  streamUrl: z.string().min(1, "رابط البث مطلوب"),
  streamType: z.enum(["HLS", "M3U8", "RTMP"]),
  thumbnail: z.string().url().optional().or(z.literal("")),
  channelId: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const userSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("البريد غير صالح"),
  password: z.string().min(6, "كلمة المرور 6 أحرف على الأقل").optional(),
  role: z.enum(["ADMIN", "EDITOR"]),
});
