import { useMemo, useState } from 'react'
import { loginUser, registerUser } from '../../services/authService.js'

const ROLE_OPTIONS = [
  {
    id: 'requester',
    title: 'Solicitante de Frete',
    description: 'Para quem precisa contratar um transporte urbano.',
  },
  {
    id: 'provider',
    title: 'Transportador Parceiro',
    description: 'Para profissionais que prestam servico de frete.',
  },
]

function normalizeCpf(value) {
  return value.replace(/\D/g, '')
}

function isValidCpf(value) {
  return normalizeCpf(value).length === 11
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function calculateAge(birthDate) {
  if (!birthDate) {
    return 0
  }

  const today = new Date()
  const birth = new Date(`${birthDate}T00:00:00`)

  if (Number.isNaN(birth.getTime())) {
    return 0
  }

  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1
  }

  return age
}

function UserRoleOnboarding({ onSubmit }) {
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState('requester')

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerCpf, setRegisterCpf] = useState('')
  const [registerBirthDate, setRegisterBirthDate] = useState('')
  const [profilePhotoFile, setProfilePhotoFile] = useState(null)
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('')
  const [accessNameOverride, setAccessNameOverride] = useState('')

  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [vehicleYear, setVehicleYear] = useState('')
  const [vehicleDocumentFile, setVehicleDocumentFile] = useState(null)
  const [cnhFacePhotoFile, setCnhFacePhotoFile] = useState(null)

  const [errorMessage, setErrorMessage] = useState('')
  const [accountNameSuggestions, setAccountNameSuggestions] = useState([])

  const registerAge = useMemo(() => calculateAge(registerBirthDate), [registerBirthDate])
  const effectiveAccountName = (accessNameOverride || fullName).trim()

  async function handleProfilePhotoChange(file) {
    if (!file) {
      return
    }

    const previewUrl = await readFileAsDataUrl(file)
    setProfilePhotoFile(file)
    setProfilePhotoUrl(typeof previewUrl === 'string' ? previewUrl : '')
  }

  function handleLogin(event) {
    event.preventDefault()
    setErrorMessage('')

    if (!loginEmail.trim()) {
      setErrorMessage('Informe seu e-mail para entrar.')
      return
    }

    if (!loginPassword.trim()) {
      setErrorMessage('Informe sua senha para entrar.')
      return
    }

    const result = loginUser({
      email: loginEmail.trim(),
      password: loginPassword,
    })

    if (!result.ok) {
      setErrorMessage(result.message)
      return
    }

    onSubmit(result.user)
  }

  function handleRegister(event) {
    event.preventDefault()
    setErrorMessage('')
    setAccountNameSuggestions([])

    if (!fullName.trim() || !phone.trim() || !registerEmail.trim() || !registerPassword.trim() || !registerCpf.trim() || !registerBirthDate) {
      setErrorMessage('Preencha nome, e-mail, senha, telefone, CPF e data de nascimento.')
      return
    }

    if (!isValidCpf(registerCpf)) {
      setErrorMessage('CPF invalido. Informe 11 digitos.')
      return
    }

    if (!profilePhotoFile || !profilePhotoUrl) {
      setErrorMessage('Adicione uma foto de perfil para continuar.')
      return
    }

    if (registerAge < 18) {
      setErrorMessage('O cadastro exige idade minima de 18 anos.')
      return
    }

    if (role === 'provider') {
      if (!brand.trim() || !model.trim() || !vehicleYear.trim()) {
        setErrorMessage('Preencha marca, modelo e ano do carro.')
        return
      }

      if (!cnhFacePhotoFile || !vehicleDocumentFile) {
        setErrorMessage('Anexe CNH com facial e documento do carro.')
        return
      }
    }

    const result = registerUser({
      role,
      accountName: effectiveAccountName,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: registerEmail.trim(),
      password: registerPassword,
      cpf: registerCpf,
      birthDate: registerBirthDate,
      age: registerAge,
      profilePhotoUrl,
      profilePhotoName: profilePhotoFile.name,
      minBudget: 0,
      maxBudget: 0,
      ratePerKm: 0,
      providerDetails: {
        plate: '',
        year: role === 'provider' ? vehicleYear.trim() : '',
        brand: role === 'provider' ? brand.trim() : '',
        model: role === 'provider' ? model.trim() : '',
        vehicleDocumentName: role === 'provider' ? vehicleDocumentFile?.name ?? '' : '',
        cnhDocumentName: '',
        cnhFacePhotoName: role === 'provider' ? cnhFacePhotoFile?.name ?? '' : '',
      },
    })

    if (!result.ok) {
      setErrorMessage(result.message)
      setAccountNameSuggestions(result.suggestions ?? [])
      return
    }

    onSubmit(result.user)
  }

  return (
    <main className="mx-auto flex min-h-screen w-full items-center px-4 py-8 sm:px-6">
      <form
        onSubmit={mode === 'login' ? handleLogin : handleRegister}
        className={`w-full rounded-[2rem] bg-white shadow-xl ring-1 ring-slate-200 ${
          mode === 'login' ? 'mx-auto max-w-xl p-4 sm:p-5' : 'mx-auto max-w-5xl p-5 sm:p-8'
        }`}
        aria-label="Acesso e cadastro"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Bem-vindo a Truckly</p>

        {mode === 'login' ? (
          <>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Entrar na plataforma</h1>
            <p className="mt-1 text-sm text-slate-600">Use seu e-mail e senha.</p>

            <section className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
              <div className="grid gap-3">
                <label className="text-sm font-medium text-slate-700" htmlFor="loginEmail">
                  E-mail
                  <input
                    id="loginEmail"
                    type="email"
                    aria-label="E-mail para login"
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                    placeholder="voce@email.com"
                  />
                </label>

                <label className="text-sm font-medium text-slate-700" htmlFor="loginPassword">
                  Senha
                  <input
                    id="loginPassword"
                    type="password"
                    aria-label="Senha para login"
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                    placeholder="Digite sua senha"
                  />
                </label>
              </div>
            </section>

            {errorMessage ? <p className="mt-4 text-sm font-medium text-red-600">{errorMessage}</p> : null}

            <button
              type="submit"
              aria-label="Entrar na plataforma"
              className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-2.5 font-semibold text-white transition hover:bg-slate-800"
            >
              Entrar
            </button>

            <p className="mt-2 text-center text-sm text-slate-600">
              Nao possui cadastro?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register')
                  setErrorMessage('')
                }}
                aria-label="Ir para cadastro"
                className="font-semibold text-amber-700 hover:text-amber-800"
              >
                Cadastrar
              </button>
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Solicitante de Frete ou Transportador Parceiro</h1>
            <p className="mt-2 text-sm text-slate-600">Escolha o perfil e preencha os dados para criar sua conta.</p>

            <section className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tipo de conta</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {ROLE_OPTIONS.map((option) => {
                  const selected = role === option.id

                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-label={`Selecionar perfil ${option.title}`}
                      onClick={() => {
                        setRole(option.id)
                        setErrorMessage('')
                      }}
                      className={`rounded-2xl border px-4 py-4 text-left transition ${
                        selected
                          ? 'border-amber-500 bg-amber-50 text-slate-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <p className="font-semibold">{option.title}</p>
                      <p className="mt-1 text-sm">{option.description}</p>
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Dados obrigatorios</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-24 w-24 overflow-hidden rounded-full border border-slate-300 bg-slate-100">
                    {profilePhotoUrl ? (
                      <img src={profilePhotoUrl} alt="Foto de perfil" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">Sem foto</div>
                    )}
                  </div>
                  <label
                    className="cursor-pointer rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:border-slate-400"
                    htmlFor="profilePhoto"
                  >
                    Foto de perfil
                    <input
                      id="profilePhoto"
                      type="file"
                      accept="image/*"
                      aria-label="Foto de perfil"
                      onChange={(event) => {
                        void handleProfilePhotoChange(event.target.files?.[0])
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="fullName">
                    Nome completo
                    <input
                      id="fullName"
                      aria-label="Nome completo"
                      value={fullName}
                      onChange={(event) => {
                        setFullName(event.target.value)
                        setAccessNameOverride('')
                        setAccountNameSuggestions([])
                      }}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                      placeholder="Seu nome"
                    />
                  </label>

                  <label className="text-sm font-medium text-slate-700" htmlFor="phone">
                    Telefone
                    <input
                      id="phone"
                      aria-label="Telefone"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                      placeholder="(11) 99999-9999"
                    />
                  </label>

                  <label className="text-sm font-medium text-slate-700" htmlFor="registerCpf">
                    CPF
                    <input
                      id="registerCpf"
                      aria-label="CPF para cadastro"
                      value={registerCpf}
                      onChange={(event) => setRegisterCpf(event.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                      placeholder="000.000.000-00"
                    />
                  </label>

                  <label className="text-sm font-medium text-slate-700" htmlFor="registerBirthDate">
                    Data de nascimento
                    <input
                      id="registerBirthDate"
                      type="date"
                      aria-label="Data de nascimento para cadastro"
                      value={registerBirthDate}
                      onChange={(event) => setRegisterBirthDate(event.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                    />
                  </label>

                  <label className="text-sm font-medium text-slate-700" htmlFor="registerEmail">
                    E-mail
                    <input
                      id="registerEmail"
                      type="email"
                      aria-label="E-mail para cadastro"
                      value={registerEmail}
                      onChange={(event) => setRegisterEmail(event.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                      placeholder="voce@email.com"
                    />
                  </label>

                  <label className="text-sm font-medium text-slate-700" htmlFor="registerPassword">
                    Senha
                    <input
                      id="registerPassword"
                      type="password"
                      aria-label="Senha para cadastro"
                      value={registerPassword}
                      onChange={(event) => setRegisterPassword(event.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                      placeholder="Crie sua senha"
                    />
                  </label>
                </div>
              </div>
            </section>

            {role === 'provider' ? (
              <section className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Dados do veiculo e documentos</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <label className="text-sm font-medium text-slate-700" htmlFor="brand">
                    Marca
                    <input
                      id="brand"
                      aria-label="Marca do carro"
                      value={brand}
                      onChange={(event) => setBrand(event.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                      placeholder="Ex: Fiat"
                    />
                  </label>

                  <label className="text-sm font-medium text-slate-700" htmlFor="model">
                    Modelo
                    <input
                      id="model"
                      aria-label="Modelo do carro"
                      value={model}
                      onChange={(event) => setModel(event.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                      placeholder="Ex: Fiorino"
                    />
                  </label>

                  <label className="text-sm font-medium text-slate-700" htmlFor="vehicleYear">
                    Ano
                    <input
                      id="vehicleYear"
                      aria-label="Ano do carro"
                      value={vehicleYear}
                      onChange={(event) => setVehicleYear(event.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                      placeholder="Ex: 2022"
                    />
                  </label>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="cnhFacePhoto">
                    CNH com facial
                    <input
                      id="cnhFacePhoto"
                      type="file"
                      accept="image/*,.pdf"
                      aria-label="CNH com facial"
                      onChange={(event) => setCnhFacePhotoFile(event.target.files?.[0] ?? null)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-slate-100 file:px-2 file:py-1 file:text-xs file:font-medium"
                    />
                  </label>

                  <label className="text-sm font-medium text-slate-700" htmlFor="vehicleDocument">
                    Documento do carro
                    <input
                      id="vehicleDocument"
                      type="file"
                      accept="image/*,.pdf"
                      aria-label="Documento do carro"
                      onChange={(event) => setVehicleDocumentFile(event.target.files?.[0] ?? null)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-slate-100 file:px-2 file:py-1 file:text-xs file:font-medium"
                    />
                  </label>
                </div>
              </section>
            ) : null}

            {accountNameSuggestions.length > 0 ? (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm font-semibold text-amber-800">
                  Este nome ja existe. Escolha uma sugestao para seu nome de acesso:
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {accountNameSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      aria-label={`Usar nome sugerido ${suggestion}`}
                      onClick={() => {
                        setAccessNameOverride(suggestion)
                        setAccountNameSuggestions([])
                        setErrorMessage('')
                      }}
                      className="rounded-lg border border-amber-300 bg-white px-3 py-1 text-sm font-medium text-amber-800 hover:bg-amber-100"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {accessNameOverride ? (
              <p className="mt-3 text-sm font-medium text-slate-700">Nome de acesso selecionado: {accessNameOverride}</p>
            ) : null}

            {errorMessage ? <p className="mt-4 text-sm font-medium text-red-600">{errorMessage}</p> : null}

            <button
              type="submit"
              aria-label="Finalizar cadastro"
              className="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Finalizar cadastro
            </button>

            <p className="mt-3 text-center text-sm text-slate-600">
              Ja possui conta?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login')
                  setErrorMessage('')
                }}
                aria-label="Voltar para entrar"
                className="font-semibold text-amber-700 hover:text-amber-800"
              >
                Entrar
              </button>
            </p>
          </>
        )}
      </form>
    </main>
  )
}

export default UserRoleOnboarding
