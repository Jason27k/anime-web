CREATE EXTENSION IF NOT EXISTS pg_session_jwt;

DO $$ BEGIN
  CREATE ROLE authenticated;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

GRANT SELECT, INSERT, UPDATE, DELETE ON "my_animes" TO authenticated;
GRANT USAGE ON SEQUENCE "my_animes_id_seq" TO authenticated;

ALTER TABLE "my_animes" ENABLE ROW LEVEL SECURITY;

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
