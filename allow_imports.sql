-- Temporarily allow anon inserts and updates for data migration
CREATE POLICY "Allow anonymous inserts on universities" ON universities FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous updates on universities" ON universities FOR UPDATE TO anon USING (true);
CREATE POLICY "Allow anonymous inserts on programs" ON programs FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous updates on programs" ON programs FOR UPDATE TO anon USING (true);
