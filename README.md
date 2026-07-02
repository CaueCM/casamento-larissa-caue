# Larissa & Cauê — Site de Casamento

Site one-page do casamento de Larissa & Cauê, 24/04/2027, Rancho Santa Maria — Mairiporã, SP.

Publicado via GitHub Pages a partir da branch `main`.

## Estrutura
- `index.html` — todas as seções do site
- `assets/css/style.css` — estilos (design tokens em `:root`)
- `assets/js/main.js` — contagem regressiva, RSVP, FAQ, menu mobile, cópia da chave PIX

## RSVP
O formulário envia cada confirmação via `fetch` para um Google Apps Script implantado
como Web App, que adiciona uma linha na aba "RSVP" da planilha "Planilha Geral
Casamento" (colunas: Nome completo, Você vai comparecer?, Número de pessoas, Recado
aos noivos, Timestamp). O endpoint está em `RSVP_ENDPOINT` no topo de
`assets/js/main.js`. Se precisar trocar a planilha/script, é só atualizar essa URL.

## Pendências antes do grande dia
- Trocar as fotos placeholder (hero, "nós dois", mapa, presentes) por fotos reais em `assets/img/`
- Substituir a chave PIX de exemplo (`larissa.caue@casamento.com`) pela chave real
- Apagar as linhas de teste na aba RSVP da planilha (usadas para validar a integração)
