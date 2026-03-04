# Arquitetura do projeto

## Visão geral

O projeto é um e-commerce com:
- **Backend:** API REST em Node.js (Express + Prisma + PostgreSQL), em `backend/`.
- **Frontend:** Pasta `frontend/` no mesmo repositório; o app será implementado nela.

A API é consumida por um cliente (futuro frontend ou outros integradores). Autenticação via JWT; usuários podem ser sincronizados/criados via Supabase.

---

## Backend

### Stack

- **Runtime:** Node.js (ES Modules).
- **Framework:** Express.
- **ORM:** Prisma.
- **Banco:** PostgreSQL.
- **Auth:** JWT (jsonwebtoken) + Supabase (opcional para usuários).

### Estrutura por módulo

Cada domínio em `backend/src/modules/<nome>/` segue:

- **routes.js** — Define rotas Express e middlewares (auth, role); chama controllers.
- **controllers/** — Recebe req/res, valida entrada (DTOs quando existem), chama service, devolve resposta.
- **services/** — Regras de negócio, orquestração, uso de repositórios e helpers.
- **repositories/** — Acesso a dados (Prisma). Um repositório por entidade/agregado.
- **dtos/** — Objetos de entrada/saída (create, update, get).
- **entities/** — Objetos de domínio quando necessário (ex.: Order, OrderItem).

Rotas são registradas automaticamente: qualquer `routes.js` dentro de `backend/src/modules/` é importado em `backend/src/shared/utils/routes-exports.js` e montado no `app` (Express).

### Módulos atuais

| Módulo               | Responsabilidade                          |
|----------------------|--------------------------------------------|
| users                | CRUD usuários, login, roles                 |
| users-roles          | Papéis (helper + repository)               |
| products             | CRUD produtos (SKU, preços, ativo)          |
| inventory            | Estoque por produto (1:1 com product)      |
| inventory-histories  | Histórico de movimentações de estoque      |
| orders               | Pedidos (status, total, itens)             |
| order-items          | Itens do pedido (entidades/DTOs)           |
| payments             | Pagamentos (rotas apenas; em construção)   |

### Shared

- **infra/** — `app.js` (Express, CORS, JSON, rotas, error middleware), `server.js`, clientes Prisma e Supabase.
- **middlewares/** — auth (JWT), role (ex.: ADMIN), error, async-handler.
- **errors/** — error-handler (mapeia exceções para respostas HTTP).
- **types/** — result-classes (BadRequest, NotFound, etc.), orders-status (enum).
- **utils/** — helpers (auth, validator, transaction, result, supabase, file), routes-exports.

Todos os caminhos acima são relativos a `backend/src/shared/`.

### Fluxo de uma requisição

1. Entrada em `app.js` (Express).
2. Rota em algum `modules/<nome>/routes.js` (opcional: authMiddleware, requireRole).
3. Controller valida entrada, chama service.
4. Service aplica regras, usa repository(ies) e helpers.
5. Resposta enviada pelo controller; erros tratados pelo error-middleware usando result-classes.

---

## Banco de dados (Prisma)

- **Schema único:** `backend/prisma/schema.prisma`.
- **Modelos principais:** User, UsersRoles, Products, Inventory, InventoryHistories, Orders, OrderItems.
- **Status de pedido:** enum OrderStatus (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED).
- Migrations em `backend/prisma/migrations/`. Em produção usar apenas `migrate deploy`; em dev `migrate dev`. Ver `backend/PRISMA_COMANDOS.md`.

---

## Frontend (planejado)

- Ainda não implementado.
- Deve consumir a API do backend (base URL configurável, ex.: env).
- Estrutura (pasta, framework, estado global) a definir; quando existir, será documentada aqui e em `docs/ai/agents/frontend.md`.

---

## Integração Backend ↔ Frontend

- Contrato: API REST (JSON). Autenticação: header (ex.: `Authorization: Bearer <token>`).
- Endpoints e payloads serão descritos em `docs/ai/agents/fullstack.md` e, se necessário, em um `docs/api.md` resumido.
