import { adminClient, anonClient } from '../../infra/supabase/client.js'

export async function getUserFromToken(token) {
  const { data: { user }, error } = await anonClient.auth.getUser(token)

  if (error || !user) {
    throw new Error('Invalid token')
  }

  return {
    id: user.id,           // UUID do auth.users
    email: user.email,     // email do auth.users
    ...user               // outros dados do user se precisar
  }
}

export async function signUpUser({ email, password }) {
  const { data, error } = await anonClient.auth.signUp({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return {
    id: data.user.id,
    email: data.user.email,
    session: data.session,
  }
}

export async function signInUser({ email, password }) {
  const { data, error } = await anonClient.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return {
    id: data.user.id,
    email: data.user.email,
    session: data.session,        // contém access_token e refresh_token
    accessToken: data.session.access_token,
  }
}


export async function deleteUser(userId) {
  const { error } = await adminClient.auth.admin.deleteUser(userId)

  if (error) {
    throw error
  }
}


export async function updateUserPassword({ userId, password }) {
  const { error } = await adminClient.auth.admin.updateUserById(userId, {
    password,
  })

  if (error) {
    throw error
  }
}
