/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'my_animes'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "my_animes" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "my_animes" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "my_animes" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "my_animes" ALTER COLUMN "id" SET DATA TYPE bigserial;--> statement-breakpoint
ALTER TABLE "my_animes" ALTER COLUMN "created_at" SET DEFAULT '2024-11-15 19:53:22.370';--> statement-breakpoint
ALTER TABLE "my_animes" ADD COLUMN "anime_id" integer NOT NULL;