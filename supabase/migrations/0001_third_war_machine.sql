ALTER TABLE "my_animes" ALTER COLUMN "created_at" SET DEFAULT '2024-11-15 18:07:49.968';--> statement-breakpoint
ALTER TABLE "my_animes" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "my_animes" DROP COLUMN IF EXISTS "updated_at";