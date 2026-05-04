import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { myAnimes } from "@/lib/schema";
import { cacheDel } from "@/lib/cache";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ animeId: string }> },
) {
  const { userId, getToken } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const token = await getToken();
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { animeId: raw } = await params;
  const animeId = parseInt(raw);
  if (isNaN(animeId))
    return Response.json({ error: "Invalid ID" }, { status: 400 });

  const db = getDb(token);
  await db
    .delete(myAnimes)
    .where(and(eq(myAnimes.userId, userId), eq(myAnimes.animeId, animeId)));

  await cacheDel(
    `mylist:${userId}`,
    `mylist:${userId}:ids`,
    `mylist:${userId}:stats`,
    `mylist:${userId}:WATCHING`,
    `mylist:${userId}:COMPLETED`,
    `mylist:${userId}:DROPPED`,
  );

  return Response.json({ success: true });
}
