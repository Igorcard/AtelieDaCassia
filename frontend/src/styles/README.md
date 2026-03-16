# Estilização — Ateliê da Cássia

## Abordagem

- **Tailwind CSS v4** (plugin Vite: `@tailwindcss/vite`).
- Diretiva em `src/index.css`: `@import "tailwindcss"`.
- Tokens de tema definidos em `src/index.css` no bloco `@theme`.

## Tokens (index.css)

- **Cores de marca:** `--color-brand-50` a `--color-brand-950` (paleta terrosa/vermelha). Uso: `bg-brand-500`, `text-brand-600`, etc.
- **Fonte:** `--font-sans` (Inter + system fallbacks).

## Padrões

- **Cores neutras:** `slate` para texto e bordas (`text-slate-800`, `border-slate-300`).
- **Links e destaques:** `text-brand-600`, `hover:text-brand-700`.
- **Botão primário:** `bg-brand-600`, `hover:bg-brand-700`, `focus:ring-brand-500`.
- **Espaçamento:** `space-y-4`, `mb-6`, `px-4 py-2` (escala Tailwind).
- **Tipografia:** `text-2xl font-bold` para títulos, `text-sm` para labels.

## Onde alterar

- Novos tokens: `src/index.css` (bloco `@theme`).
- Estilos globais do app: `src/App.css`.
- Componentes: classes Tailwind inline (ou CSS Modules no futuro, se necessário).
