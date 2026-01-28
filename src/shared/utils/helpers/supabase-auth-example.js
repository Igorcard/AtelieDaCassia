/**
 * EXEMPLO DE USO DO SUPABASE AUTH
 *
 * Este arquivo mostra como usar as funções do supabase-helper.js
 * nos seus controllers/services.
 */
import prisma from '../../infra/prisma/client.js'

// ==========================================
// EXEMPLO 4: ATUALIZAR PERFIL
// ==========================================
export async function exemploUpdateProfile(req, res) {
  const { id } = req.user  // do Supabase Auth (via middleware)
  const { name } = req.body

  const user = await prisma.user.update({
    where: { id },
    data: { name }
  })

  return res.status(200).json(user)
}

// ==========================================
// RESUMO DO FLUXO
// ==========================================
/*
1. CADASTRO:
   - Cliente: POST /signup com { email, password, name }
   - Backend: signUpUser() → pega id do Supabase → cria em prisma.user
   - Resposta: dados do user (sem password)

2. LOGIN:
   - Cliente: POST /login com { email, password }
   - Backend: signInUser() → retorna accessToken
   - Resposta: { user, accessToken }

3. REQUISIÇÕES AUTENTICADAS:
   - Cliente: envia header Authorization: Bearer {accessToken}
   - Backend: authMiddleware pega id/email do token
   - Controller: usa req.user.id para buscar/atualizar dados

4. EMAIL E SENHA:
   - Ficam no Supabase Auth (auth.users)
   - Seu banco (public.users) só tem: id, name, role, etc.
   - Para mudar email/senha: use funções do Supabase Auth
*/
