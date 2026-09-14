import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    // We use the Video model here as it seems to represent the news/posts in your schema
    // `db.video.findMany()` automatically sorts by `createdAt: "desc"` in your `actions.ts`
    const news = await db.video.findMany();
    
    return NextResponse.json({ 
      success: true, 
      data: news 
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch news data' 
    }, { status: 500 });
  }
}
