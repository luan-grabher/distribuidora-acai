-- Migração: remover coluna 'ativo', adicionar 'numero_parcela' e 'status'
-- Execute no Supabase SQL Editor (faça backup antes)

BEGIN;

-- 1) Adicionar colunas
ALTER TABLE gastos
  ADD COLUMN IF NOT EXISTS numero_parcela INTEGER;

ALTER TABLE gastos
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pendente';

-- Criar constraint para status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'gastos_status_check'
  ) THEN
    ALTER TABLE gastos ADD CONSTRAINT gastos_status_check CHECK (status IN ('pendente','pago'));
  END IF;
END$$;

-- 2) Popular numero_parcela para gastos parcelados com base na data_inicio
-- Calcula meses decorridos desde data_inicio até agora e converte para parcela atual
UPDATE gastos
SET numero_parcela = LEAST(
  COALESCE(total_parcelas, 1),
  GREATEST(1, (EXTRACT(YEAR FROM now())::int - EXTRACT(YEAR FROM data_inicio)::int) * 12
    + (EXTRACT(MONTH FROM now())::int - EXTRACT(MONTH FROM data_inicio)::int) + 1)
)
WHERE tipo = 'parcelado';

-- 3) Limpar numero_parcela para não-parcelados
UPDATE gastos
SET numero_parcela = NULL
WHERE tipo <> 'parcelado';

-- 4) Remover coluna ativo (se existir)
ALTER TABLE gastos
  DROP COLUMN IF EXISTS ativo;

COMMIT;

-- Após esta migração, considere revisar índices, permissões e testes de leitura/escrita.
