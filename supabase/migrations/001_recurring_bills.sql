-- Migration: Add recurring bill support
-- Run this in the Supabase SQL editor on the existing database.

-- 1. Add repeat_interval column
ALTER TABLE bills ADD COLUMN IF NOT EXISTS repeat_interval text
  DEFAULT 'none'
  CHECK (repeat_interval IN ('none','weekly','monthly','quarterly','yearly'));

-- 2. Add parent_bill_id for linking renewed bills
ALTER TABLE bills ADD COLUMN IF NOT EXISTS parent_bill_id uuid
  REFERENCES bills(id) ON DELETE SET NULL;
