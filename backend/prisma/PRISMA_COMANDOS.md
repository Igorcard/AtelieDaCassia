# Guia de Comandos do Prisma

**Execute todos os comandos de dentro da pasta `backend/`** (onde está o `package.json` do backend e a pasta `prisma/`).

---

## Comandos principais

```bash
# Gerar Prisma Client (após mudar schema)
npx prisma generate

# Criar e aplicar migration (desenvolvimento)
npx prisma migrate dev --name nome_da_migration

# Criar migration SEM aplicar (para editar SQL antes)
npx prisma migrate dev --name nome_migration --create-only

# Aplicar migrations pendentes (produção)
npx prisma migrate deploy

# Ver status das migrations
npx prisma migrate status

# Abrir Prisma Studio (UI do banco)
npx prisma studio

# Resetar banco (⚠️ apaga todos os dados) — só em dev
npx prisma migrate reset
npx prisma migrate reset --force
```

---

## Workflow

- **Dev:** edite `prisma/schema.prisma` → `npx prisma migrate dev --name descricao`
- **Produção:** nunca use `migrate dev` nem `migrate reset`; use apenas `npx prisma migrate deploy`
- **Commitar** a pasta `prisma/migrations/` no Git
- **Nunca editar** o SQL de uma migration já aplicada; crie uma nova migration para corrigir

---

## Referências

- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
