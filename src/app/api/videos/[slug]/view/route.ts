import { NextRequest, NextResponse } from "next/server";
import { incrementVideoViews } from "@/lib/data";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  const { success } = rateLimit(`view:${ip}:${slug}`, 5, 60_000);

  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    await incrementVideoViews(slug);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
