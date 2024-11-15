import {
  text,
  integer,
  timestamp,
  pgTable,
  boolean,
  serial,
} from "drizzle-orm/pg-core";

export const MyAnimesTable = pgTable("my_animes", {
  id: serial().primaryKey(),
  user_id: text().notNull(),
  anime_id: integer().notNull().default(1),
  created_at: timestamp().notNull().default(new Date()),
  finished: boolean().default(false).notNull(),
  episode: integer().default(1),
});

export type InsertMyAnime = typeof MyAnimesTable.$inferInsert;
export type SelectMyAnime = typeof MyAnimesTable.$inferSelect;
