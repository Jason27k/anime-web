CREATE TABLE "my_animes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"anime_id" integer NOT NULL,
	"status" text DEFAULT 'WATCHING' NOT NULL,
	"episode" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "my_animes_user_id_anime_id_unique" UNIQUE("user_id","anime_id")
);
