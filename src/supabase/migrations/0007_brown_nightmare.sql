ALTER TABLE "my_animes" ALTER COLUMN "created_at" SET DEFAULT '2024-11-15 19:56:18.591';--> statement-breakpoint
ALTER TABLE "my_animes" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;