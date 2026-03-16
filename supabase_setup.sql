-- Drop tables if they exist (for a clean slate)
DROP TABLE IF EXISTS student_applications CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS universities CASCADE;

-- 1. Create Universities Table
CREATE TABLE universities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Programs Table
CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    level TEXT,
    language TEXT,
    official_price DECIMAL(10, 2),
    discounted_price DECIMAL(10, 2),
    currency TEXT,
    unit TEXT,
    study_years INTEGER,
    field TEXT,
    speciality TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Student Applications Table
CREATE TABLE student_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on basic RLS (Row Level Security)
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_applications ENABLE ROW LEVEL SECURITY;

-- Create Policies allowing anonymous reads for public data
CREATE POLICY "Allow public read access on universities" ON universities FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public read access on programs" ON programs FOR SELECT TO anon USING (true);

-- Allow anonymous inserts to applications (so form works)
CREATE POLICY "Allow anonymous inserts on student_applications" ON student_applications FOR INSERT TO anon WITH CHECK (true);

-- 4. Set up Full-Text Search Indexes
CREATE INDEX universities_name_idx ON universities USING GIN (to_tsvector('english', name));
CREATE INDEX programs_name_idx ON programs USING GIN (to_tsvector('english', name));
CREATE INDEX programs_field_idx ON programs USING GIN (to_tsvector('english', field));
CREATE INDEX programs_speciality_idx ON programs USING GIN (to_tsvector('english', speciality));
