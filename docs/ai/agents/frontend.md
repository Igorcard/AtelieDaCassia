# Agente Frontend — UI, componentes e integração com a API

Use este contexto quando a tarefa for **criar ou alterar** o frontend: telas, componentes, estado, chamadas à API e UX.

**Stack:** React (Vite), React Router, axios, Tailwind v4. Checklist completo: **`docs/frontend-react-checklist.md`**. Item 10 (monorepo e docs) concluído.

---

## Estado atual

A pasta **`frontend/`** contém o app React (Vite); estrutura e fluxos iniciais já implementados.

Implementado:
- **React + Vite** em `frontend/`.
- Consumir a API do backend (base URL em `VITE_API_URL`); cliente em `src/services/api.js`.
- Autenticação JWT: **AuthContext** (`src/contexts/AuthContext.jsx`), token e usuário em **localStorage**; **ProtectedRoute** em `src/components/ProtectedRoute.jsx`; login em `LoginPage`, área logada em `/account`.

---

## Stack

- **React** + **Vite**, **React Router**, **axios**.
- Estado global: **Context** (AuthContext). Token e usuário em **localStorage**.
- **Estilo:** Tailwind CSS v4 (`@tailwindcss/vite`). Tokens em `src/index.css` (`@theme`). Padrões em `src/styles/README.md`.

## Estrutura de pastas (`frontend/src/`)

| Pasta | Uso |
|-------|-----|
| `components/` | Componentes reutilizáveis (ex.: ProtectedRoute). |
| `config/` | Configuração (env.js com API_URL). |
| `contexts/` | Contextos React (AuthContext). |
| `hooks/` | Hooks customizados; re-export de useAuth e futuros hooks. |
| `pages/` | Uma pasta por rota: HomePage, LoginPage, AccountPage, ProductListPage, ProductDetailPage. |
| `services/` | Cliente HTTP (api.js) e funções que chamam endpoints. |
| `utils/` | Helpers (ex.: formatCurrency em utils/format.js). |
| `assets/` | Imagens, ícones, fontes. |

Arquivos na raiz de `src/`: `App.jsx`, `main.jsx`, `index.css`, `App.css`.

## Convenções

- **Nomes:** componentes e arquivos em inglês (HomePage, LoginPage, useAuth).
- **Rotas:** `/` (home), `/login`, `/products`, `/product/:id`, `/account` (protegida).

## API

- Base URL: `import.meta.env.VITE_API_URL` (centralizado em `config/env.js` como `API_URL`).
- Token: header `Authorization: Bearer <token>`; cliente em `services/api.js` adiciona automaticamente.
- Erros: usar `getErrorMessage(error)` de `services/api.js` para exibir mensagem do backend.

---

## Integração com o backend

- Endpoints e payloads devem seguir o que está implementado em `backend/src/modules/`.
- Erros retornados pelo backend seguem as classes em `backend/src/shared/types/result-classes.js`; a resposta HTTP traz o corpo definido pelo error-handler (ex.: `{ error: { message: '...' } }` ou similar). O frontend deve tratar esses formatos.
- Para detalhes de contratos (rotas, body, query), use o agente **fullstack** (`docs/ai/agents/fullstack.md`) ou leia os arquivos de routes/controllers do backend.

---

## Ações recomendadas ao criar o frontend

1. Criar a pasta do frontend e configurar build (Vite, CRA, etc.).
2. Atualizar `claude.md` e `docs/architecture.md` com a pasta e a stack.
3. Preencher este arquivo (`docs/ai/agents/frontend.md`) com a estrutura real e convenções adotadas.
4. Atualizar `docs/development.md` com comandos e env do frontend.
