# 00 — Pré‑requisitos para a Reformulação do Site

## Objetivo

Centralizar todos os ativos, acessos e decisões necessários antes de iniciar a implementação visual e de conteúdo.

## Assets necessários (imagens)
- Hero principal: foto profissional do produto/estoque (preferência: 2560×1440 ou 1600×900). Nome sugerido: `hero-estoque.jpg`.
- Fotos de produto por categoria (mín. 2–3 por produto): 1000×1000 + 1200×800. Nomes: `produto-<slug>-1.jpg`, `produto-<slug>-2.jpg`.
- Fotos de prova operacional: empilhamento de caixas, freezers, área de produção (1920×1080). Ex.: `prova-estoque-1.jpg`.
- Fotos de embalagens e caixas (800×800).
- Logotipo em vetor (SVG) e PNG transparente (512×512).
- Arquivo de catálogo em PDF (`catalogo.pdf`) caso o CTA baixe ou envie o catálogo.
- Logos de clientes/testemunhos (opcional) em PNG/SVG.

## Conteúdo textual a confirmar
- Headline do Hero (versão final aprovada)
- Subheadline do Hero
- Textos dos CTAs (`Quero revender`, `Receber catálogo`): destino e comportamento (download, formulário, email, etc.)
- Lista de cidades atendidas iniciais (ex.: Porto Alegre, Alvorada)
- Lista de categorias e 1–2 produtos exemplares por categoria com descrições curtas
- Textos para cards de diferenciais (qualidade, margem, entrega, recorrência, tudo‑em‑um)

## Acessos / Credenciais
- Credenciais do Supabase (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY) para upload de imagens
- Credenciais de deploy/staging (Vercel/hosting) para validar antes de produção
- Credenciais de admin do painel (se necessário para upload)

## Decisões técnicas a definir
- Onde hospedar imagens: `public/` (rápido, versionado) ou Supabase bucket (dinâmico). Se Supabase, confirmar domínio para `next.config`.
- Confirmar número de WhatsApp no formato E.164 para links `wa.me/`.
- Confirmar se o catálogo deve ser PDF para download ou formulário de envio por e‑mail.

## Critério de aceite
- Todos os assets listados entregues em `assets/reform/` ou carregados no Supabase
- Copy final aprovada e entregue em arquivo texto
- Credenciais de Supabase e deploy fornecidas em ambiente seguro
