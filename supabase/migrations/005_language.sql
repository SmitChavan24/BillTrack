-- Migration 005: per-user message language for WhatsApp reminders & receipts.
-- 'en' (English), 'hi' (Hindi) or 'hinglish' (Roman Hindi). Defaults to 'en'
-- and backfills existing rows, so current users are unchanged. Run in the
-- Supabase SQL editor.

alter table profiles
  add column if not exists language text not null default 'en'
  check (language in ('en', 'hi', 'hinglish'));
