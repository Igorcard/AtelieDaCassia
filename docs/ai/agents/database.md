# Agente Database — Prisma, schema e migrations

Use este contexto quando a tarefa for **alterar o modelo de dados**, criar ou ajustar **migrations**, ou trabalhar com **Prisma** (schema, seeds, client).

---

## Arquivos principais

Todos os caminhos são relativos à raiz do repositório. O backend está em **`backend/`**.

- **Schema:** `backend/prisma/schema.prisma` — única fonte de verdade do modelo.
- **Migrations:** `backend/prisma/migrations/` — cada migration é uma pasta com `migration.sql`.
- **Client:** gerado com `npx prisma generate` (executar de dentro de `backend/`); usado no código em `backend/src/shared/infra/prisma/client.js`.
- **Referência de comandos:** `backend/prisma/PRISMA_COMANDOS.md`.

---

## Modelos atuais (resumo)

- **User** — id (UUID), name, email, roleId, timestamps. Relação com UsersRoles e Orders.
- **UsersRoles** — id, name. Roles dos usuários.
- **Products** — id, description, sku (unique), salePrice, costPrice, active, timestamps. Relações: Inventory, InventoryHistories, OrderItems.
- **Inventory** — id, quantity, productId (unique), timestamps. 1:1 com Products, onDelete Cascade.
- **InventoryHistories** — id, quantity, productId, type, referenceId, createdAt. Histórico de movimentações.
- **Orders** — id, userId, status (enum), total, timestamps. Relações: User, OrderItems.
- **OrderStatus** — enum: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED.
- **OrderItems** — id, orderId, productId, quantity, unitPrice, timestamps. Relações: Orders, Products.

Tabelas no banco usam `@@map` em minúsculo (ex.: `users`, `products`, `orders`).

---

## Regras ao alterar o schema

1. **Sempre** criar migration para mudanças no schema. Não usar apenas `prisma db push` em desenvolvimento com migrations já adotadas.
2. **Nunca** editar arquivos SQL de migrations já aplicadas. Para corrigir, crie uma nova migration.
3. **Nomes descritivos:** `npx prisma migrate dev --name add_phone_to_user`.
4. **Campos obrigatórios em tabelas com dados:** usar `--create-only`, editar o SQL (ex.: DEFAULT temporário) e depois aplicar.
5. **Renomear campo/tabela:** preferir editar o SQL da migration (RENAME) em vez de DROP + ADD para não perder dados.
6. **Commitar** a pasta `prisma/migrations/` no Git.

---

## Comandos mais usados

```bash
npx prisma generate
npx prisma migrate dev --name nome_da_mudanca
npx prisma migrate dev --name nome --create-only   # só gera SQL
npx prisma migrate deploy
npx prisma migrate status
npx prisma studio
```

Em produção: apenas `migrate deploy`. Não usar `migrate dev` nem `migrate reset`.

---

## Impacto no backend

Após alterar o schema:
1. Rodar `npx prisma generate`.
2. Ajustar repositórios, services e DTOs que usam os campos/relações alterados.
3. Verificar `backend/src/shared/types/orders-status.js` se mudar o enum OrderStatus.

Para mudanças que afetam a API (novos campos em respostas, novos filtros), coordenar com o agente **backend** e, se houver frontend, com o **fullstack**.
