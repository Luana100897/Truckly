const USERS_KEY = 'truckly_users_v1'
const SESSION_KEY = 'truckly_session_v1'

function safeJsonParse(rawValue, fallbackValue) {
  if (!rawValue) {
    return fallbackValue
  }

  try {
    return JSON.parse(rawValue)
  } catch {
    return fallbackValue
  }
}

function normalizeName(value) {
  return value.trim().toLowerCase()
}

function normalizeCpf(value) {
  return value.replace(/\D/g, '')
}

function normalizeEmail(value) {
  return value.trim().toLowerCase()
}

export function getStoredUsers() {
  const users = safeJsonParse(window.localStorage.getItem(USERS_KEY), [])
  return Array.isArray(users) ? users : []
}

function saveStoredUsers(users) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getSessionUser() {
  const session = safeJsonParse(window.localStorage.getItem(SESSION_KEY), null)

  if (!session?.accountName) {
    return null
  }

  const users = getStoredUsers()
  const sessionName = normalizeName(session.accountName)
  return users.find((user) => normalizeName(user.accountName) === sessionName) ?? null
}

export function clearSessionUser() {
  window.localStorage.removeItem(SESSION_KEY)
}

export function suggestAccountNames(name, maxSuggestions = 3) {
  const trimmed = name.trim()

  if (!trimmed) {
    return []
  }

  const users = getStoredUsers()
  const used = new Set(users.map((user) => normalizeName(user.accountName)))
  const suggestions = []
  let suffix = 2

  while (suggestions.length < maxSuggestions) {
    const candidate = `${trimmed}${suffix}`
    if (!used.has(normalizeName(candidate))) {
      suggestions.push(candidate)
    }
    suffix += 1
  }

  return suggestions
}

export function registerUser(profile) {
  const users = getStoredUsers()
  const normalizedAccountName = normalizeName(profile.accountName)
  const normalizedCpf = normalizeCpf(profile.cpf)
  const normalizedEmail = normalizeEmail(profile.email ?? '')

  const hasSameName = users.some((user) => normalizeName(user.accountName) === normalizedAccountName)
  if (hasSameName) {
    return {
      ok: false,
      reason: 'duplicate_name',
      message: 'Este nome de acesso ja possui cadastro.',
      suggestions: suggestAccountNames(profile.accountName),
    }
  }

  const hasSameCpf = users.some((user) => normalizeCpf(user.cpf) === normalizedCpf)
  if (hasSameCpf) {
    return {
      ok: false,
      reason: 'duplicate_cpf',
      message: 'Ja existe cadastro para este CPF.',
      suggestions: [],
    }
  }

  const hasSameEmail = users.some((user) => normalizeEmail(user.email ?? '') === normalizedEmail)
  if (hasSameEmail) {
    return {
      ok: false,
      reason: 'duplicate_email',
      message: 'Ja existe cadastro com este e-mail.',
      suggestions: [],
    }
  }

  const userToStore = {
    ...profile,
    cpf: normalizedCpf,
    email: normalizedEmail,
    accountName: profile.accountName.trim(),
  }

  users.push(userToStore)
  saveStoredUsers(users)
  window.localStorage.setItem(SESSION_KEY, JSON.stringify({ accountName: userToStore.accountName }))

  return {
    ok: true,
    user: userToStore,
  }
}

export function loginUser({ email, password }) {
  const users = getStoredUsers()
  const normalizedEmail = normalizeEmail(email ?? '')

  const user = users.find((storedUser) => normalizeEmail(storedUser.email ?? '') === normalizedEmail)

  if (!user) {
    return {
      ok: false,
      message: 'Nao encontramos cadastro com este e-mail.',
    }
  }

  if ((user.password ?? '') !== (password ?? '')) {
    return {
      ok: false,
      message: 'Senha incorreta.',
    }
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify({ accountName: user.accountName }))

  return {
    ok: true,
    user,
  }
}
