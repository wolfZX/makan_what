-- Makan Where Supabase Setup Script
-- Run this in your Supabase SQL Editor to create the required table

-- Create the "makan where" table
CREATE TABLE IF NOT EXISTS "makan where" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    cuisine TEXT NOT NULL,
    price_range TEXT NOT NULL,
    is_halal BOOLEAN NOT NULL DEFAULT false,
    google_url TEXT,
    org_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on org_name for better query performance
CREATE INDEX IF NOT EXISTS idx_makan_where_org_name ON "makan where" (org_name);

-- Enable Row Level Security (RLS)
ALTER TABLE "makan where" ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now
-- You can customize this based on your security requirements
CREATE POLICY "Allow all operations" ON "makan where"
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_makan_where_updated_at
    BEFORE UPDATE ON "makan where"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create some sample data (uncomment if you want to test)
/*
INSERT INTO "makan where" (name, cuisine, price_range, is_halal, google_url, org_name) VALUES
('McDonald''s', 'Fast Food', '$', false, 'https://maps.google.com/?q=mcdonalds', 'test'),
('KFC', 'Fast Food', '$', false, 'https://maps.google.com/?q=kfc', 'test'),
('Subway', 'Fast Food', '$', true, 'https://maps.google.com/?q=subway', 'test');
*/ 