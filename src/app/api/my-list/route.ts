import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { myAnimes } from "@/lib/schema";
import { cacheDel } from "@/lib/cache";
import { eq, desc } from "drizzle-orm";

async function invalidateUserCache(userId: string) {
  await cacheDel(
    `mylist:${userId}`,
    `mylist:${userId}:ids`,
    `mylist:${userId}:stats`,
    `mylist:${userId}:WATCHING`,
    `mylist:${userId}:COMPLETED`,
    `mylist:${userId}:DROPPED`,
  );
}

// GET — full list for the authenticated user
export async function GET() {
  const { userId, getToken } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const token = await getToken();
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb(token);
  const rows = await db
    .select()
    .from(myAnimes)
    .where(eq(myAnimes.userId, userId))
    .orderBy(desc(myAnimes.createdAt));

  return Response.json({
    entries: rows.map((r) => ({
      animeId: r.animeId,
      status: r.status,
      episode: r.episode,
      createdAt: r.createdAt.toISOString(),
    })),
  });
}

// POST — upsert a single entry (used by web or mobile for one-off saves)
export async function POST(request: Request) {
  const { userId, getToken } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const token = await getToken();
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { animeId, status, episode } = await request.json();
  const db = getDb(token);

  await db
    .insert(myAnimes)
    .values({ userId, animeId, status, episode })
    .onConflictDoUpdate({
      target: [myAnimes.userId, myAnimes.animeId],
      set: { status, episode },
    });

  await invalidateUserCache(userId);
  return Response.json({ success: true });
}
