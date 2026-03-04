# Agente Backend — API, serviços e repositórios

Use este contexto quando a tarefa for **criar ou alterar** rotas, controllers, services, repositories, DTOs, entities ou middlewares do backend.

---

## Onde está cada coisa

Todo o backend fica na pasta **`backend/`**. Caminhos relativos a ela:

- **Rotas:** `backend/src/modules/<modulo>/routes.js`
- **Controllers:** `backend/src/modules/<modulo>/controllers/`
- **Services:** `backend/src/modules/<modulo>/services/`
- **Repositories:** `backend/src/modules/<modulo>/repositories/`
- **DTOs:** `backend/src/modules/<modulo>/dtos/`
- **Entities:** `backend/src/modules/<modulo>/entities/`
- **Shared:** `backend/src/shared/` (middlewares, errors, types, utils, infra)

Rotas são descobertas automaticamente: todo arquivo `routes.js` dentro de `backend/src/modules/` é importado em `backend/src/shared/utils/routes-exports.js` e montado no `app` com `app.use(router)`. Os scripts (npm run dev) são executados com cwd = `backend/`.

---

## Padrões obrigatórios

1. **Rotas**
   - Usar `Router()` do Express e exportar `default` do router.
   - Envolver controllers em `asyncHandler(controller.funcao)`.
   - Usar `authMiddleware` quando a rota for autenticada.
   - Usar `requireRole(USERS_ROLES.ADMIN)` (ou outro role) quando precisar de permissão. Importar de `../users-roles/helper/users-roles-helper.js`.

2. **Controllers**
   - Receber `req`, `res`. Extrair dados de `req.body`, `req.params`, `req.query`.
   - Chamar o service e enviar resposta com `res.status(...).json(...)`.
   - Não colocar lógica de negócio no controller; apenas orquestração e resposta.

3. **Services**
   - Receber DTOs ou objetos simples.
   - Usar repositórios para ler/escrever no banco.
   - Lançar exceções de `backend/src/shared/types/result-classes.js`: `BadRequestException`, `NotFoundException`, `UnauthorizedException`, `ForbiddenException`, `ConflictException`, `InternalServerErrorException`, `BadGatewayException`.
   - Exemplo: `throw new NotFoundException({ message: 'Product not found' })`. O `error-handler` transforma em resposta HTTP.

4. **Repositories**
   - Usar o Prisma client de `backend/src/shared/infra/prisma/client.js`.
   - Funções como `findBy(criteria)`, `create(data)`, `update(id, data)`, etc. Retornar dados brutos ou null; não lançar exceções de negócio (isso fica no service).

5. **Novo módulo**
   - Criar pasta `backend/src/modules/<nome>/` com pelo menos `routes.js`.
   - Se tiver rotas, exportar um router com `export default router` para ser pego pelo routes-exports.

---

## Exceções e respostas HTTP

- **BadRequestException** → 400
- **UnauthorizedException** → 401
- **ForbiddenException** → 403
- **NotFoundException** → 404
- **ConflictException** → 409
- **InternalServerErrorException** → 500
- **BadGatewayException** → 502

O formato de mensagem é um objeto, ex.: `{ message: 'Product not found' }`. O `error-handler` em `backend/src/shared/errors/error-handler.js` usa isso para montar a resposta. Não criar novos tipos de exceção sem alinhar com o error-handler e o frontend.

---

## Imports

- Sempre usar extensão `.js` em imports (ESM).
- Exemplo: `import { asyncHandler } from '../../shared/middlewares/async-handler-middleware.js'`
- Caminhos relativos conforme a pasta do arquivo.

---

## Referências no projeto

- Exemplo de módulo completo: `backend/src/modules/orders/` (routes, controller, service, repository, dtos, entities).
- Exemplo de rotas com auth e role: `backend/src/modules/users/routes.js`, `backend/src/modules/products/routes.js`.
- Error handler: `backend/src/shared/errors/error-handler.js` e `backend/src/shared/middlewares/error-middleware.js`.
