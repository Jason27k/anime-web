import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { myAnimes } from "@/lib/schema";
import { cacheDel } from "@/lib/cache";
import { eq, and, desc } from "drizzle-orm";

type Change = {
  animeId: number;
  status?: string;
  episode?: number | null;
  action: "upsert" | "delete";
};

// POST — mobile pushes pending changes, receives full canonical list back
export async function POST(request: Request) {
  const { userId, getToken } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const token = await getToken();
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { changes = [] }: { changes: Change[] } = await request.json();
  const db = getDb(token);

  // Apply each change
  for (const c of changes) {
    if (c.action === "delete") {
      await db
        .delete(myAnimes)
        .where(
          and(eq(myAnimes.userId, userId), eq(myAnimes.animeId, c.animeId)),
        );
    } else {
      await db
        .insert(myAnimes)
        .values({
          userId,
          animeId: c.animeId,
          status: c.status ?? "WATCHING",
          episode: c.episode ?? null,
        })
        .onConflictDoUpdate({
          target: [myAnimes.userId, myAnimes.animeId],
          set: {
            status: c.status ?? "WATCHING",
            episode: c.episode ?? null,
          },
        });
    }
  }

  // Return full list after changes
  const rows = await db
    .select()
    .from(myAnimes)
    .where(eq(myAnimes.userId, userId))
    .orderBy(desc(myAnimes.createdAt));

  if (changes.length > 0) {
    await cacheDel(
      `mylist:${userId}`,
      `mylist:${userId}:ids`,
      `mylist:${userId}:stats`,
      `mylist:${userId}:WATCHING`,
      `mylist:${userId}:COMPLETED`,
      `mylist:${userId}:DROPPED`,
    );
  }

  return Response.json({
    entries: rows.map((r) => ({
      animeId: r.animeId,
      status: r.status,
      episode: r.episode,
      createdAt: r.createdAt.toISOString(),
    })),
  });
}
