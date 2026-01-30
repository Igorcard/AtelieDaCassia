# Guia de Comandos do Prisma

## 🗄️ Gerenciamento do Banco de Dados

### Resetar o Banco (⚠️ Apaga TODOS os dados)
```bash
# Com confirmação
npx prisma migrate reset

# Sem confirmação (force)
npx prisma migrate reset --force

**O que faz:**
- Dropa todas as tabelas
- Recria o banco do zero
- Aplica todas as migrations
- Roda seed (se configurado)
- Gera Prisma Client

---

## 🔄 Migrations (Desenvolvimento)

### Criar Nova Migration
```bash
# Criar e aplicar migration
npx prisma migrate dev --name nome_da_migration

# Criar migration SEM aplicar (para editar SQL antes)
npx prisma migrate dev --name nome_migration --create-only

# Depois de editar, aplicar:
npx prisma migrate dev
```

### Ver Status das Migrations
```bash
# Ver quais migrations foram aplicadas
npx prisma migrate status
```

### Aplicar Migrations Pendentes
```bash
# Aplica migrations que ainda não foram executadas
npx prisma migrate deploy
```

**⚠️ Diferença:**
- `migrate dev` → para **desenvolvimento** (cria + aplica)
- `migrate deploy` → para **produção** (só aplica, não cria)

---

## ➕ Adicionar Campo em Tabela Existente

### 1. Edite o `schema.prisma`:
```prisma
model User {
  id        String   @id @db.Uuid
  name      String?
  role      String   @default("client")
  phone     String?  // ← NOVO CAMPO
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2. Crie a migration:
```bash
npx prisma migrate dev --name add_phone_to_user
```

### Exemplo com campo obrigatório (NOT NULL):
```prisma
model User {
  // ...
  cpf String  // campo obrigatório
}
```

```bash
# Se a tabela JÁ TEM dados, precisa de default ou migration manual
npx prisma migrate dev --name add_cpf_to_user --create-only
```

**Edite o SQL gerado** para adicionar valor default temporário:
```sql
ALTER TABLE "users" ADD COLUMN "cpf" TEXT NOT NULL DEFAULT '';
```

Depois aplique:
```bash
npx prisma migrate dev
```

---

## ➖ Remover Campo de Tabela

### 1. Edite o `schema.prisma` (remova o campo):
```prisma
model User {
  id        String   @id @db.Uuid
  name      String?
  role      String   @default("client")
  // phone     String?  ← REMOVIDO
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2. Crie a migration:
```bash
npx prisma migrate dev --name remove_phone_from_user
```

**O Prisma gera automaticamente:**
```sql
ALTER TABLE "users" DROP COLUMN "phone";
```

---

## 🆕 Criar Nova Tabela

### 1. Adicione no `schema.prisma`:
```prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  price       Float
  description String?
  categoryId  String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  category Category @relation(fields: [categoryId], references: [id])

  @@map("products")
}
```

### 2. Crie a migration:
```bash
npx prisma migrate dev --name create_products_table
```

---

## 🔗 Adicionar Relacionamento

### 1. Edite o `schema.prisma`:
```prisma
model User {
  id        String   @id @db.Uuid
  name      String?
  orders    Order[]  // ← relação 1:N

  @@map("users")
}

model Order {
  id        String   @id @default(uuid())
  userId    String   @db.Uuid
  total     Float
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id])

  @@map("orders")
}
```

### 2. Crie a migration:
```bash
npx prisma migrate dev --name add_user_orders_relation
```

---

## 🗑️ Deletar Tabela

### 1. Remova o model do `schema.prisma`:
```prisma
// Remove o model inteiro
// model OldTable { ... }
```

### 2. Crie a migration:
```bash
npx prisma migrate dev --name drop_old_table
```

---

## 🔄 Renomear Campo ou Tabela

### Renomear Campo

⚠️ O Prisma pode interpretar como "remover + adicionar" (perde dados!)

**Solução: Editar o SQL manualmente**

1. Crie migration sem aplicar:
```bash
npx prisma migrate dev --name rename_field --create-only
```

2. Edite o SQL gerado:
```sql
-- Ao invés de DROP + ADD, use RENAME:
ALTER TABLE "users" RENAME COLUMN "old_name" TO "new_name";
```

3. Aplique:
```bash
npx prisma migrate dev
```

### Renomear Tabela

Use `@@map` no schema:
```prisma
model User {
  // ...
  @@map("clients")  // tabela se chama "clients" no banco
}
```

---

## 🔍 Outros Comandos Úteis

### Gerar Prisma Client (sem mexer no banco)
```bash
npx prisma generate
```

### Abrir Prisma Studio (UI visual do banco)
```bash
npx prisma studio
```

### Formatar schema.prisma
```bash
npx prisma format
```

### Validar schema.prisma
```bash
npx prisma validate
```

### Push schema direto no banco (SEM migration)
```bash
# ⚠️ Útil para prototipagem rápida, NÃO use em produção
npx prisma db push
```

### Puxar schema do banco existente
```bash
# Gera schema.prisma baseado no banco atual
npx prisma db pull
```

---

## 📝 Workflow Típico (Desenvolvimento)

### 1. Fazer mudança no banco:
```bash
# 1. Edite prisma/schema.prisma
# 2. Crie e aplique migration
npx prisma migrate dev --name descricao_da_mudanca
```

### 2. Quando dá erro ou quer revisar:
```bash
# Ver status
npx prisma migrate status

# Resetar e começar do zero (⚠️ perde dados)
npx prisma migrate reset --force

# Ou: criar migration para editar manualmente
npx prisma migrate dev --name fix_something --create-only
# Edite o SQL em prisma/migrations/...
npx prisma migrate dev
```

### 3. Sincronizar com outros devs:
```bash
# Após git pull (aplicar migrations dos outros)
npx prisma migrate deploy

# Gerar Prisma Client atualizado
npx prisma generate
```

---

## 🚀 Workflow de Produção

### Deploy de Migrations:
```bash
# NO SERVIDOR DE PRODUÇÃO (CI/CD):
npx prisma migrate deploy
```

**⚠️ NUNCA use `migrate dev` ou `migrate reset` em produção!**

---

## 🛠️ Troubleshooting

### Erro "Migration failed to apply"
```bash
# Ver detalhes do erro
npx prisma migrate status

# Forçar resolver (⚠️ cuidado)
npx prisma migrate resolve --applied nome_da_migration
```

### Schema e banco dessincronizados
```bash
# Opção 1: Resetar (dev only)
npx prisma migrate reset

# Opção 2: Criar migration para corrigir
npx prisma migrate dev --name fix_schema

# Opção 3: Puxar schema do banco (se banco é a verdade)
npx prisma db pull
```

### Prisma Client desatualizado
```bash
# Sempre após mudar schema
npx prisma generate
```

---

## 📚 Exemplos Práticos

### Adicionar campo com valor default
```bash
# 1. Edite schema.prisma
# status String @default("active")

# 2. Migre
npx prisma migrate dev --name add_status_field
```

### Mudar tipo de campo (ex: String → Int)
```bash
# 1. Crie migration sem aplicar
npx prisma migrate dev --name change_age_to_int --create-only

# 2. Edite o SQL (converta dados se necessário)
# ALTER TABLE "users" ALTER COLUMN "age" TYPE INTEGER USING age::integer;

# 3. Aplique
npx prisma migrate dev
```

### Adicionar índice
```prisma
model User {
  email String @unique  // índice único
  name  String

  @@index([name])  // índice simples
  @@index([name, email])  // índice composto
}
```

```bash
npx prisma migrate dev --name add_indexes
```

---

## 🎯 Dicas Importantes

✅ **Sempre commite as migrations** no Git
✅ **Nunca edite migrations já aplicadas** (crie novas)
✅ **Use nomes descritivos** nas migrations
✅ **Teste migrations antes de deploy** em produção
✅ **Faça backup** antes de `migrate reset`

❌ **Nunca use `migrate dev`** em produção
❌ **Nunca delete pasta `migrations`** manualmente
❌ **Não use `db push`** se você usa migrations

---

## 📖 Referências

- [Documentação Oficial do Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma CLI Reference](https://www.prisma.io/docs/reference/api-reference/command-reference)
