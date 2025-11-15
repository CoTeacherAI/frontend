-- ============================================================================
-- ClassPark Recordings - Complete Database Setup
-- ============================================================================
-- This script creates the class_recordings table, storage bucket, and all
-- necessary RLS policies for the ClassPark audio recording feature.
-- Run this entire script in Supabase SQL Editor.
-- ============================================================================

-- ============================================================================
-- STEP 1: Create Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS class_recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  audio_url TEXT,
  transcript TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'recording' CHECK (status IN ('recording', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- STEP 2: Create Indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_class_recordings_professor ON class_recordings(professor_id);
CREATE INDEX IF NOT EXISTS idx_class_recordings_status ON class_recordings(status);
CREATE INDEX IF NOT EXISTS idx_class_recordings_created_at ON class_recordings(created_at DESC);

-- ============================================================================
-- STEP 3: Create Updated_at Trigger Function
-- ============================================================================
CREATE OR REPLACE FUNCTION update_class_recordings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 4: Create Updated_at Trigger
-- ============================================================================
DROP TRIGGER IF EXISTS update_class_recordings_updated_at ON class_recordings;

CREATE TRIGGER update_class_recordings_updated_at
  BEFORE UPDATE ON class_recordings
  FOR EACH ROW
  EXECUTE FUNCTION update_class_recordings_updated_at();

-- ============================================================================
-- STEP 5: Enable Row Level Security (RLS)
-- ============================================================================
ALTER TABLE class_recordings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 6: Drop Existing RLS Policies (if any)
-- ============================================================================
DROP POLICY IF EXISTS "Professors can view own recordings" ON class_recordings;
DROP POLICY IF EXISTS "Professors can insert own recordings" ON class_recordings;
DROP POLICY IF EXISTS "Professors can update own recordings" ON class_recordings;
DROP POLICY IF EXISTS "Professors can delete own recordings" ON class_recordings;

-- ============================================================================
-- STEP 7: Create RLS Policies for Table
-- ============================================================================
-- Professors can view their own recordings
CREATE POLICY "Professors can view own recordings"
  ON class_recordings
  FOR SELECT
  USING (auth.uid() = professor_id);

-- Professors can insert their own recordings
CREATE POLICY "Professors can insert own recordings"
  ON class_recordings
  FOR INSERT
  WITH CHECK (auth.uid() = professor_id);

-- Professors can update their own recordings
CREATE POLICY "Professors can update own recordings"
  ON class_recordings
  FOR UPDATE
  USING (auth.uid() = professor_id)
  WITH CHECK (auth.uid() = professor_id);

-- Professors can delete their own recordings
CREATE POLICY "Professors can delete own recordings"
  ON class_recordings
  FOR DELETE
  USING (auth.uid() = professor_id);

-- ============================================================================
-- STEP 8: Create Storage Bucket
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('class_recordings', 'class_recordings', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 9: Drop Existing Storage Policies (if any)
-- ============================================================================
DROP POLICY IF EXISTS "Professors can upload recordings" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view recordings" ON storage.objects;
DROP POLICY IF EXISTS "Professors can delete own recordings" ON storage.objects;

-- ============================================================================
-- STEP 10: Create Storage Policies
-- ============================================================================
-- Professors can upload to their own folder (path format: {user_id}/...)
CREATE POLICY "Professors can upload recordings"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'class_recordings' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Anyone can view recordings (public bucket)
CREATE POLICY "Anyone can view recordings"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'class_recordings');

-- Professors can delete their own recordings from storage
CREATE POLICY "Professors can delete own recordings"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'class_recordings' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- VERIFICATION QUERIES (Optional - uncomment to verify setup)
-- ============================================================================
-- Verify table exists
-- SELECT tablename FROM pg_tables WHERE tablename = 'class_recordings';

-- Verify RLS policies
-- SELECT policyname, cmd FROM pg_policies WHERE tablename = 'class_recordings';

-- Verify storage bucket
-- SELECT id, name, public FROM storage.buckets WHERE id = 'class_recordings';

-- Verify storage policies
-- SELECT policyname, cmd FROM pg_policies 
-- WHERE schemaname = 'storage' AND tablename = 'objects' 
-- AND policyname LIKE '%recordings%';
