ALTER TABLE "my_animes" ALTER COLUMN "created_at" SET DEFAULT '2024-11-15 19:55:56.968';--> statement-breakpoint
ALTER TABLE "my_animes" DROP COLUMN IF EXISTS "id";