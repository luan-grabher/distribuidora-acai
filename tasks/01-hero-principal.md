# 01 — Hero Principal (B2B)

## Objetivo

Substituir o hero atual por um hero B2B com foto real do estoque/produto, headline clara e CTAs comerciais.

## Descrição
- Atualizar `siteConfig.hero` com `title`, `titleHighlight`, `subtitle`, `ctaPrimary` e `ctaSecondary` em PT‑BR.
- Trocar o logo circular do hero por imagem de fundo `hero-estoque.jpg` e garantir contraste de texto.
- CTA primário: `Quero revender` — abre modal de contato com formulário mínimo (nome, empresa, telefone, cidade).
- CTA secundário: `Receber catálogo` — inicia download de `catalogo.pdf` ou abre formulário para envio por e‑mail.

## Arquivos a alterar
- `src/config/siteConfig.ts`
- `src/components/Hero/Hero.tsx`
- `src/app/page.tsx`

## Assets necessários
- `public/hero-estoque.jpg`
- `public/catalogo.pdf` (ou URL do catálogo)

## Critério de aceite
- Hero exibe nova headline/subheadline em PT‑BR
- Imagem de fundo responsiva e otimizada
- `Quero revender` abre modal funcional
- `Receber catálogo` baixa ou solicita envio do PDF
