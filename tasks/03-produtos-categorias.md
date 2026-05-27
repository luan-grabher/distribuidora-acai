# 03 — Seção de Produtos (Categorias Comerciais)

## Objetivo

Transformar a seção de produtos da home em um catálogo comercial de categorias com imagens reais.

## Descrição
- Reestruturar `Products` para exibir categorias: Açaís, Sorvetes, Complementos, Operação.
- Cada categoria terá imagem grande, descrição curta e link para catálogo completo da categoria.
- Implementação rápida: usar `siteConfig.products` com novo campo `image` apontando para `public/`.
- Fase 2: migrar para consumo dinâmico de `/api/itens` para mapear categorias reais.

## Arquivos a alterar
- `src/components/Products/Products.tsx`
- `src/config/siteConfig.ts`
- `src/app/page.tsx`

## Assets necessários
- Imagens de categoria: `categoria-acais.jpg`, `categoria-sorvetes.jpg`, `categoria-complementos.jpg`, `categoria-operacao.jpg` (1500×800 sugerido).

## Critério de aceite
- Categorias distintas e visuais
- Imagens carregam e CTA leva ao catálogo de categoria
