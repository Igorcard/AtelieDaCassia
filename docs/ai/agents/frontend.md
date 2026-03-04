# Agente Frontend — UI, componentes e integração com a API

Use este contexto quando a tarefa for **criar ou alterar** o frontend: telas, componentes, estado, chamadas à API e UX.

---

## Estado atual

A pasta **`frontend/`** existe na raiz do repositório, mas o app ainda não foi implementado (apenas `package.json` mínimo). Este arquivo serve como contrato e guia para quando for implementado.

Planejado:
- Código do frontend em `frontend/`.
- Consumir a API do backend (base URL configurável, ex.: `http://localhost:3333`).
- Autenticação via token JWT (ex.: header `Authorization: Bearer <token>`).

---

## Quando o frontend existir, documentar aqui

1. **Stack:** framework (React, Vue, etc.), gerenciamento de estado, roteamento, chamadas HTTP (axios, fetch, etc.).
2. **Estrutura de pastas:** ex. `pages/`, `components/`, `services/`, `store/`, `hooks/`.
3. **Convenções:** nomes de componentes, idioma (código em inglês), estilo (CSS modules, Tailwind, etc.).
4. **API:** base URL (ex. `import.meta.env.VITE_API_URL`), formato de erro (objeto com `error` ou `message`), uso de token em todas as rotas autenticadas.
5. **Fluxos principais:** login, listagem de produtos, carrinho, checkout, painel admin (se houver).

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
