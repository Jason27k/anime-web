-- Run this in the Neon SQL Editor after completing Neon Authorize setup
-- (Project → Authorize → Add provider → Clerk)

-- Enable Neon Authorize extension (already present after dashboard setup, this is idempotent)
CREATE EXTENSION IF NOT EXISTS pg_session_jwt;

-- Ensure the authenticated role exists (Neon Authorize creates it; this is a safety net)
DO $$ BEGIN
  CREATE ROLE authenticated;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Grant table and sequence access to the authenticated role
GRANT SELECT, INSERT, UPDATE, DELETE ON "my_animes" TO authenticated;
GRANT USAGE ON SEQUENCE "my_animes_id_seq" TO authenticated;

-- Enable Row Level Security
ALTER TABLE "my_animes" ENABLE ROW LEVEL SECURITY;

-- Policies: each user can only access their own rows
-- auth.user_id() reads the `sub` claim from the Clerk JWT passed via authToken

CREATE POLICY "users_select_own" ON "my_animes"
  FOR SELECT USING (user_id = auth.user_id());

CREATE POLICY "users_insert_own" ON "my_animes"
  FOR INSERT WITH CHECK (user_id = auth.user_id());

CREATE POLICY "users_update_own" ON "my_animes"
  FOR UPDATE
  USING (user_id = auth.user_id())
  WITH CHECK (user_id = auth.user_id());

CREATE POLICY "users_delete_own" ON "my_animes"
  FOR DELETE USING (user_id = auth.user_id());
