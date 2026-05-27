# 11 — Imagens e Upload (Admin / Supabase)

## Objetivo

Validar e documentar o fluxo de upload de imagens para que a equipe consiga inserir fotos reais facilmente.

## Descrição
- Revisar `src/app/api/admin/itens/imagem/route.ts` e `src/lib/supabase/storage/uploadImagemParaStorage.ts`.
- Testar upload com `SUPABASE_SERVICE_ROLE_KEY` em staging e gerar URLs públicas.
- Fornecer alternativa rápida: copiar imagens para `public/` quando o upload não for possível.

## Arquivos a revisar
- `src/app/api/admin/itens/imagem/route.ts`
- `src/lib/supabase/storage/uploadImagemParaStorage.ts`
- `src/components/Admin/Itens/FormularioItem.tsx`

## Critério de aceite
- Imagens carregadas e acessíveis por URL pública
- Documentação curta com passos de upload
