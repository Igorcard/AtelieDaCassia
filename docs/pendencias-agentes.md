# Pendências do e-commerce — uso com agentes

Use este arquivo como **checklist**: marque `[x]` ao concluir. Ao pedir algo a um agente no Cursor, indique **a fase e o item** (ex.: “Fase 1, item 1.2 — pagamento Mercado Pago”).

---

## Qual agente carregar

| Agente      | Quando usar                                      | Contexto                          |
|------------|---------------------------------------------------|-----------------------------------|
| **database** | Schema Prisma, migrations, seeds, modelos       | `docs/ai/agents/database.md`      |
| **backend**  | API, services, repos, DTOs, webhooks              | `docs/ai/agents/backend.md`       |
| **frontend** | Telas, componentes, contextos, chamadas à API   | `docs/ai/agents/frontend.md`      |
| **fullstack**| Contrato API ↔ UI, fluxo ponta a ponta          | `docs/ai/agents/fullstack.md`     |

Leia também `claude.md` na raiz antes de alterar código.

---

## Fase 1 — Fechar a venda (MVP comercial)

| Feito | ID   | Pendência | Agente(s) sugerido(s) | Notas |
|:-----:|------|-----------|------------------------|-------|
| [x] | 1.1 | Endereço de entrega no pedido (modelo + migration) | database → backend | CEP, rua, número, cidade, UF, etc. |
| [x] | 1.1b | Checkout: formulário de endereço + envio no create order | fullstack | Ajustar DTO e `CheckoutPage` |
| [x] | 1.1c | Frete (fixo ou regra simples) no total do pedido | fullstack | `ORDER_FIXED_SHIPPING_BRL` (backend); `VITE_ORDER_FIXED_SHIPPING_BRL` (exibição) |
| [ ] | 1.2 | Modelo `Payment` + fluxo com gateway (escolher qual) | database → backend | Webhook, envs |
| [ ] | 1.2b | Tela / redirect de pagamento no front | frontend + fullstack | |
| [ ] | 1.3 | Atualizar status do pedido ao confirmar pagamento | backend | ex.: PENDING → CONFIRMED |

---

## Fase 2 — Confiança e catálogo

| Feito | ID   | Pendência | Agente(s) sugerido(s) | Notas |
|:-----:|------|-----------|------------------------|-------|
| [ ] | 2.1 | Imagens no produto (URL ou tabela) | database → backend → frontend | Lista, detalhe, carrinho |
| [ ] | 2.2 | Listar pedidos do usuário logado (`GET` protegido) | backend | |
| [ ] | 2.2b | Página “Meus pedidos” + detalhe na conta | frontend + fullstack | |
| [x] | 2.3 | Preço unitário definido no servidor no create order (não confiar só no client) | backend | Itens: productId + quantity |

---

## Fase 3 — Operação (loja)

| Feito | ID   | Pendência | Agente(s) sugerido(s) | Notas |
|:-----:|------|-----------|------------------------|-------|
| [ ] | 3.1 | Painel admin: produtos + estoque (role ADMIN) | fullstack | Rotas já existem |
| [ ] | 3.1b | Painel admin: listar pedidos e alterar status | fullstack | |
| [ ] | 3.2 | Cancelamento de pedido + devolução de estoque (regras) | backend + fullstack | |

---

## Fase 4 — Opcional (crescimento)

| Feito | ID   | Pendência | Agente(s) sugerido(s) | Notas |
|:-----:|------|-----------|------------------------|-------|
| [ ] | 4.1 | Categorias / tags e filtros | database → fullstack | |
| [ ] | 4.2 | Busca de produtos | backend → frontend | |
| [ ] | 4.3 | E-mail transacional (pedido criado / pago / enviado) | backend | |
| [ ] | 4.4 | Cupons / desconto | database → fullstack | |
| [ ] | 4.5 | Frete por CEP (API ou tabela) | fullstack | |
| [ ] | 4.6 | Páginas legais (termos, privacidade) | frontend | |

---

## Pendências avulsas (preencha você)

| Feito | Descrição | Agente | Notas |
|:-----:|-----------|--------|-------|
| [ ] | | | |
| [ ] | | | |
| [ ] | | | |

---

## Ordem sugerida (referência rápida)

1. **2.3** — preço no servidor  
2. **1.1** → **1.1b** → **1.1c** — endereço + frete  
3. **1.2** → **1.2b** → **1.3** — pagamento  
4. **2.1** — imagens  
5. **2.2** → **2.2b** — meus pedidos  
6. **3.x** — admin e cancelamento  
7. **4.x** — conforme prioridade  

---

*Atualize datas ou decisões (ex.: gateway escolhido) na coluna Notas.*
