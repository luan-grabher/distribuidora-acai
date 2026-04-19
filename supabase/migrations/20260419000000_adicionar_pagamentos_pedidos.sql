ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS pagamentos JSONB NOT NULL DEFAULT '[]';

UPDATE pedidos
SET pagamentos = json_build_array(
  json_build_object('forma', forma_pagamento, 'valor', total)
)
WHERE forma_pagamento IS NOT NULL AND pagamentos = '[]'::jsonb;
