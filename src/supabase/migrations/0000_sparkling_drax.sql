CREATE TABLE IF NOT EXISTS "my_animes" (
	"user_id" text PRIMARY KEY NOT NULL,
	"mal_id" integer,
	"created_at" timestamp,
	"updated_at" timestamp,
	"finished" boolean DEFAULT false,
	"episode" integer DEFAULT 1
);
