-- Run this script in your Supabase SQL Editor.
-- Note: Create your admin user ('admin@studentapply.com') directly from the 
-- "Authentication -> Users -> Add User" button in your Supabase Dashboard to avoid 
-- Internal Server Errors caused by complex internal auth triggers.

-- Below are the RLS Policies to allow Authenticated users (the admin) to read/write EVERYTHING.

DROP POLICY IF EXISTS "Allow authenticated full access on student_applications" ON student_applications;
CREATE POLICY "Allow authenticated full access on student_applications" ON student_applications FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated full access on universities" ON universities;
CREATE POLICY "Allow authenticated full access on universities" ON universities FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated full access on programs" ON programs;
CREATE POLICY "Allow authenticated full access on programs" ON programs FOR ALL TO authenticated USING (true) WITH CHECK (true);
