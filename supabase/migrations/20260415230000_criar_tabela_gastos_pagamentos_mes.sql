CREATE TABLE IF NOT EXISTS gastos_pagamentos_mes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gasto_id UUID NOT NULL REFERENCES gastos(id) ON DELETE CASCADE,
  ano INTEGER NOT NULL,
  mes INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pago' CHECK (status IN ('pendente', 'pago')),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(gasto_id, ano, mes)
);

ALTER TABLE gastos_pagamentos_mes ENABLE ROW LEVEL SECURITY;
