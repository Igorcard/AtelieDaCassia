# Atelie da Cassia — Contexto para IA

Este documento é o **ponto de entrada** para qualquer assistente ou agente que trabalhe no projeto. Use-o para entender o que é o projeto, onde está cada coisa e qual agente chamar para tarefas específicas.

---

## O que é o projeto

- **Nome:** Atelie da Cassia
- **Tipo:** E-commerce (backend API + frontend planejado)
- **Backend:** Node.js (ESM), Express, Prisma, PostgreSQL
- **Auth:** JWT + Supabase (usuários podem vir do Supabase)
- **Frontend:** Pasta `frontend/` existe; o app ainda será implementado (React/Vue/etc.).

---

## Estrutura de pastas (visão geral)

```
AtelieDaCassia/
├── claude.md                 ← Este arquivo (contexto geral para IA)
├── .cursorrules              ← Regras globais do Cursor
├── package.json              ← Scripts da raiz (dev:backend, dev:frontend)
├── docs/                     ← Documentação humana e para agentes
│   ├── architecture.md       ← Arquitetura backend + frontend
│   ├── development.md        ← Setup, scripts, env, como rodar
│   └── ai/
│       └── agents/           ← Contexto por tipo de agente
│           ├── backend.md    ← Agente Backend (API, serviços, repos)
│           ├── frontend.md   ← Agente Frontend (quando houver)
│           ├── database.md   ← Agente Banco (Prisma, migrations)
│           └── fullstack.md  ← Agente Fullstack (integração)
├── backend/                  ← Código da API (Node.js, Express, Prisma)
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma     ← Modelo de dados único
│   │   └── migrations/
│   │   └── PRISMA_COMANDOS.md    ← Referência de comandos Prisma
│   └── src/
│       ├── index.js         ← Entrada do servidor
│       ├── modules/          ← Um módulo por domínio (users, products, orders...)
│       │   ├── users/
│       │   ├── products/
│       │   ├── inventory/
│       │   ├── inventory-histories/
│       │   ├── orders/
│       │   ├── order-items/
│       │   ├── users-roles/
│       │   └── payments/
│       └── shared/           ← Infra e código compartilhado
│           ├── infra/        ← Prisma client, Supabase, app, server
│           ├── middlewares/  ← auth, role, error, async-handler
│           ├── errors/       ← error-handler
│           ├── types/        ← result-classes, orders-status
│           └── utils/        ← helpers, routes-exports
└── frontend/                 ← App frontend (a ser implementado)
    └── package.json
```

---

## Quando usar cada agente

| Tarefa | Arquivo de contexto | Caminho |
|--------|---------------------|--------|
| API, rotas, controllers, services, repositories, DTOs, middlewares | Agente Backend | `docs/ai/agents/backend.md` |
| Telas, componentes, estado, chamadas à API, UX | Agente Frontend | `docs/ai/agents/frontend.md` |
| Schema Prisma, migrations, modelos, relações, seeds | Agente Database | `docs/ai/agents/database.md` |
| Integração front ↔ back, contratos de API, fluxos completos | Agente Fullstack | `docs/ai/agents/fullstack.md` |

**Regra:** Para qualquer tarefa, leia primeiro o `claude.md` (este arquivo). Para tarefas específicas de backend, frontend, banco ou fullstack, carregue também o arquivo correspondente em `docs/ai/agents/`.

---

## Convenções gerais

- **Idioma:** Código (nomes de variáveis, funções, arquivos) em **inglês**. Comentários e documentação podem ser em português.
- **Backend:** ES Modules (`import`/`export`). Padrão por módulo: `routes.js` → controller → service → repository; DTOs e entities quando fizer sentido.
- **Respostas de erro:** Usar as classes em `backend/src/shared/types/result-classes.js` (BadRequestException, NotFoundException, etc.) e o `error-handler` para responder ao cliente.
- **Documentação:** Não criar README ou docs extras a menos que o usuário peça.
- **Git:** Commitar migrations do Prisma; não editar migrations já aplicadas.

---

## Links rápidos na documentação

- **Arquitetura (backend + frontend):** `docs/architecture.md`
- **Como rodar o projeto e variáveis de ambiente:** `docs/development.md`
- **Comandos Prisma (referência):** `backend/prisma/PRISMA_COMANDOS.md`

---

*Última atualização: estrutura inicial para IA/agentes. Ajuste este arquivo e os agentes em `docs/ai/agents/` conforme o projeto e o frontend evoluírem.*
