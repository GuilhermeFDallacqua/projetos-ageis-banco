-- Campos das etapas 3 (Gestação e bebê), 4 (Coleta e armazenamento)
-- e 5 (Sorologia) da triagem. Rode no SQL Editor do Supabase.
alter table public.trials
  add column if not exists delivery_date date,
  add column if not exists gestational_weeks smallint,
  add column if not exists delivery_type text,
  add column if not exists had_prenatal boolean,
  add column if not exists collection_place text,
  add column if not exists has_freezer boolean,
  add column if not exists has_glass_jars boolean,
  add column if not exists received_hygiene_guidance boolean,
  add column if not exists hiv_result text,
  add column if not exists syphilis_result text,
  add column if not exists hepatitis_b_result text,
  add column if not exists hepatitis_c_result text,
  add column if not exists htlv_result text;
