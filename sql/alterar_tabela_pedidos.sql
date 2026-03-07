ALTER TABLE pedidos
  ADD COLUMN nome_cliente TEXT NOT NULL DEFAULT '',
  ADD COLUMN telefone_cliente TEXT NOT NULL DEFAULT '';
