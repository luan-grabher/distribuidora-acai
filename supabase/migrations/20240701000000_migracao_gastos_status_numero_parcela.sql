BEGIN;

ALTER TABLE gastos
  ADD COLUMN IF NOT EXISTS numero_parcela INTEGER;

ALTER TABLE gastos
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pendente';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'gastos_status_check'
  ) THEN
    ALTER TABLE gastos ADD CONSTRAINT gastos_status_check CHECK (status IN ('pendente','pago'));
  END IF;
END$$;

UPDATE gastos
SET numero_parcela = LEAST(
  COALESCE(total_parcelas, 1),
  GREATEST(1, (EXTRACT(YEAR FROM now())::int - EXTRACT(YEAR FROM data_inicio)::int) * 12
    + (EXTRACT(MONTH FROM now())::int - EXTRACT(MONTH FROM data_inicio)::int) + 1)
)
WHERE tipo = 'parcelado';

UPDATE gastos
SET numero_parcela = NULL
WHERE tipo <> 'parcelado';

ALTER TABLE gastos
  DROP COLUMN IF EXISTS ativo;

COMMIT;
