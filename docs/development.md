# Desenvolvimento — setup e comandos

## Pré-requisitos

- Node.js (versão compatível com o projeto; ver `package.json` / engines se houver).
- PostgreSQL (local ou remoto).
- Conta Supabase (se usar auth/usuários via Supabase).

## Instalação

Na raiz (instala dependências do workspace e dos subprojetos):

```bash
npm run install:all
```

Ou apenas o backend:

```bash
cd backend && npm install
```

## Variáveis de ambiente (backend)

Crie um arquivo `.env` dentro de `backend/` (não versionado). Exemplo:

```env
PORT=3333
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
# Supabase (se usado)
SUPABASE_URL=
SUPABASE_ANON_KEY=
# JWT (se usado)
JWT_SECRET=
```

- **DATABASE_URL** — Obrigatório para o Prisma.
- **PORT** — Porta do servidor (default 3333).
- Demais variáveis conforme uso de Supabase e JWT no código.

## Comandos

**Na raiz:**

| Comando              | Descrição                    |
|----------------------|------------------------------|
| `npm run dev`        | Sobe o backend (nodemon)     |
| `npm run dev:backend`| Idem                         |
| `npm run dev:frontend` | Sobe o frontend (quando existir) |
| `npm run start:backend` | Backend em produção (node)   |

**Dentro de `backend/`:**

| Comando        | Descrição                          |
|----------------|------------------------------------|
| `npm run dev`  | Sobe o backend com nodemon         |
| `npm start`    | Sobe o backend com node            |
| `npm run lint` | ESLint no código em `src`         |
| `npm run lint:fix` | ESLint com correção automática  |

## Prisma (dentro de `backend/`)

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name nome_da_mudanca
npx prisma migrate deploy
npx prisma studio
```

Referência completa: **backend/prisma/PRISMA_COMANDOS.md**.

## Health check

Com o servidor rodando:

```bash
GET http://localhost:3333/health
```

Resposta esperada: `{ "status": "ok", "message": "Server is running" }`.

## Frontend

Quando existir, terá seus próprios scripts e env (ex.: `frontend/.env` com `VITE_API_URL` ou similar). Será documentado aqui e em `docs/ai/agents/frontend.md`.
