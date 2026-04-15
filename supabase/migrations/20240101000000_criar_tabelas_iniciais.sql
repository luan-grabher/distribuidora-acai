CREATE TABLE IF NOT EXISTS itens_catalogo (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL DEFAULT '',
  imagem_url TEXT NOT NULL DEFAULT '',
  preco NUMERIC(10, 2) NOT NULL,
  estoque INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pedidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  itens JSONB NOT NULL DEFAULT '[]',
  total NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'aguardando confirmação',
  forma_pagamento TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
