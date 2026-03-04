# Agente Fullstack — Integração backend e frontend

Use este contexto quando a tarefa envolver **os dois lados**: garantir que frontend e backend concordem em rotas, payloads, erros e fluxos (login, carrinho, checkout, admin, etc.).

---

## Visão geral

- **Backend:** API REST em `backend/` (código em `backend/src/`), porta padrão 3333, base URL ex.: `http://localhost:3333`.
- **Frontend:** Pasta `frontend/` na raiz; quando o app existir, consumirá essa API (URL configurável).

O agente fullstack deve assegurar:
- Contratos de request/response (body, query, headers).
- Tratamento de erros no frontend conforme o que o backend envia.
- Fluxos completos (ex.: criar pedido = validar estoque, criar order + order_items, baixar estoque, registrar histórico).

---

## Onde está o quê

- **Rotas e métodos:** cada módulo em `backend/src/modules/<nome>/routes.js`.
- **Entrada dos controllers:** `req.body`, `req.params`, `req.query`; validação às vezes via DTOs em `dtos/`.
- **Respostas de erro:** formato definido por `backend/src/shared/errors/error-handler.js` e as classes em `backend/src/shared/types/result-classes.js` (ex.: `{ error: message }`).
- **Auth:** header `Authorization: Bearer <token>`. Rotas protegidas usam `authMiddleware` e opcionalmente `requireRole(USERS_ROLES.ADMIN)`.

---

## Resumo de endpoints (para contrato com o frontend)

Construir esta lista a partir dos arquivos `routes.js` de cada módulo. Exemplo (verificar no código para estar atualizado):

- **Users:** POST `/user`, PUT `/user/:id`, DELETE `/user/:id`, GET `/users/:id`, GET `/users`, POST `/login`.
- **Products:** POST `/product`, PUT `/product/:id`, DELETE `/product/:id`, GET `/product/:id`, POST `/products` (listagem).
- **Orders:** (ver `backend/src/modules/orders/routes.js`).
- **Inventory / Inventory-histories:** (ver respectivos `routes.js` em `backend/src/modules/`).

Quando o frontend existir, manter aqui (ou em `docs/api.md`) um resumo de:
- Método e path.
- Headers obrigatórios (Authorization quando aplicável).
- Body/query esperados.
- Exemplo de resposta de sucesso e de erro.

---

## Fluxos críticos (exemplos)

1. **Login:** POST `/login` com credenciais → resposta com token (ou erro 401). Frontend guarda token e envia em `Authorization` nas próximas requisições.
2. **Criar pedido:** POST na rota de orders com `userId`, `items[]` (productId, quantity, unitPrice), `total`. Backend valida estoque, produtos ativos e total; cria Order + OrderItems; baixa estoque e registra InventoryHistories. Frontend deve enviar exatamente o formato esperado pelo backend e tratar 400/404/409.
3. **Listar produtos:** GET (ou POST `/products` com filtros, conforme implementação). Resposta paginada ou lista; frontend deve tratar formato e erros.

---

## Boas práticas

- Qualquer mudança em contrato (nova rota, campo novo em request/response) deve ser refletida no backend e, quando existir, no frontend e neste documento (ou em `docs/api.md`).
- Manter `docs/ai/agents/backend.md` e `docs/ai/agents/frontend.md` alinhados com as convenções reais de cada camada.
- Testes E2E ou de integração (quando existirem) devem cobrir esses fluxos; o agente fullstack pode sugerir casos de teste.
