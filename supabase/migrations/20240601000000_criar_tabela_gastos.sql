CREATE TABLE gastos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  descricao TEXT NOT NULL,
  valor NUMERIC(10,2) NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('unico', 'recorrente', 'parcelado')),
  categoria TEXT,
  data_inicio DATE NOT NULL,
  total_parcelas INTEGER,
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
