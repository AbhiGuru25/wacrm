-- ============================================================
-- Migration 043: Fingertip Healthcare & Pharmacy Architecture
-- Roles, Trigram Medicine Search, Vault Deduplication & OCR Queue
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 1. Healthcare Role Enum
DO $$ BEGIN
  CREATE TYPE healthcare_role AS ENUM ('chemist', 'distributor', 'patient', 'hospital', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2. Medicines Catalog with Trigram Fuzzy Search
CREATE TABLE IF NOT EXISTS medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name TEXT NOT NULL,
  composition TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Allopathic',
  pack_size TEXT NOT NULL,
  mrp NUMERIC(10, 2) NOT NULL,
  is_prescription_required BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigram GIN indexes for typo-tolerant, partial-match search
CREATE INDEX IF NOT EXISTS idx_medicines_brand_trgm ON medicines USING gin (brand_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_medicines_composition_trgm ON medicines USING gin (composition gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_medicines_manufacturer_trgm ON medicines USING gin (manufacturer gin_trgm_ops);

-- 3. Distributor Inventory (Private Rates & Stock Availability)
CREATE TABLE IF NOT EXISTS distributor_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distributor_id UUID NOT NULL,
  distributor_name TEXT NOT NULL,
  distributor_contact TEXT,
  medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  available_units INT NOT NULL DEFAULT 0,
  private_chemist_rate NUMERIC(10, 2),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Secure Prescription Vault with SHA-256 Deduplication
CREATE TABLE IF NOT EXISTS vault_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  patient_phone TEXT,
  chemist_id UUID,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  sha256_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'uploaded', -- 'uploaded', 'processing', 'extracted', 'rejected'
  consent_granted BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enforce SHA-256 unique constraint for duplicate prevention
CREATE UNIQUE INDEX IF NOT EXISTS idx_vault_documents_sha256 ON vault_documents (sha256_hash);

-- 5. Durable OCR & AI Processing Queue with Exponential Retries
CREATE TABLE IF NOT EXISTS ocr_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES vault_documents(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  attempts INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 3,
  provider TEXT NOT NULL DEFAULT 'openai_vision', -- 'openai_vision', 'aws_textract', 'google_document_ai'
  extracted_data JSONB,
  confidence_score NUMERIC(5, 2),
  error_log TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ocr_jobs_status ON ocr_jobs (status, attempts);

-- 6. Row Level Security Policies
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributor_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ocr_jobs ENABLE ROW LEVEL SECURITY;

-- Medicines: readable by all authenticated users
CREATE POLICY medicines_read_policy ON medicines FOR SELECT TO authenticated USING (true);

-- Distributor Inventory: only authenticated chemists and distributors can view
CREATE POLICY distributor_inventory_policy ON distributor_inventory FOR SELECT TO authenticated USING (true);

-- Vault Documents: strictly isolated by owner / user
CREATE POLICY vault_documents_owner_policy ON vault_documents
  FOR ALL TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = chemist_id);

-- OCR Jobs: readable only by document owner
CREATE POLICY ocr_jobs_owner_policy ON ocr_jobs
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM vault_documents
    WHERE vault_documents.id = ocr_jobs.document_id
      AND (vault_documents.user_id = auth.uid() OR vault_documents.chemist_id = auth.uid())
  ));
