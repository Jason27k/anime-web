import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const myAnimes = pgTable(
  "my_animes",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    animeId: integer("anime_id").notNull(),
    status: text("status").notNull().default("WATCHING"), // WATCHING | COMPLETED | DROPPED
    episode: integer("episode"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [unique().on(t.userId, t.animeId)]
);
