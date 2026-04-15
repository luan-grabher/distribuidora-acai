ALTER TABLE itens_catalogo
  ADD COLUMN IF NOT EXISTS promocao_ativa NUMERIC(10, 2);
