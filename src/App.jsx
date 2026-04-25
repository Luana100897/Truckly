import { useEffect, useState } from 'react'
import BookingBottomSheet from './components/booking/BookingBottomSheet.jsx'
import DynamicSummaryCard from './components/booking/DynamicSummaryCard.jsx'
import RouteMap from './components/map/RouteMap.jsx'
import UserRoleOnboarding from './components/profile/UserRoleOnboarding.jsx'
import { useBooking } from './hooks/useBooking.js'

function App() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isOnlineNow, setIsOnlineNow] = useState(true)

  const {
    isProfileComplete,
    userProfile,
    completeUserProfile,
    logoutUser,
    selectedOrigin,
    selectedDestination,
    freightEstimate,
  } = useBooking()

  useEffect(() => {
    function refreshOnlineStatus() {
      setIsOnlineNow(window.navigator.onLine)
    }

    refreshOnlineStatus()
    window.addEventListener('online', refreshOnlineStatus)
    window.addEventListener('offline', refreshOnlineStatus)

    return () => {
      window.removeEventListener('online', refreshOnlineStatus)
      window.removeEventListener('offline', refreshOnlineStatus)
    }
  }, [])

  if (!isProfileComplete) {
    return <UserRoleOnboarding onSubmit={completeUserProfile} />
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-5 sm:py-5 lg:h-screen lg:py-6">
      <div className="grid min-h-[calc(100vh-1.5rem)] gap-4 lg:h-full lg:min-h-0 lg:grid-cols-[1.35fr_0.65fr] lg:gap-6">
        <section className="overflow-hidden rounded-[2rem] bg-white/70 shadow-xl ring-1 ring-white/60 backdrop-blur-sm lg:rounded-[2.25rem]">
          <RouteMap originCoords={selectedOrigin?.coords} destinationCoords={selectedDestination?.coords} />
          <div className="border-t border-slate-200/80 px-5 py-3 lg:px-6 lg:py-3">
            <div className="grid grid-cols-[1fr_auto] items-center gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(true)}
                  aria-label="Ver detalhes do perfil"
                  className="relative h-12 w-12 flex-none rounded-full border border-slate-300 bg-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                  {userProfile.profilePhotoUrl ? (
                    <img
                      src={userProfile.profilePhotoUrl}
                      alt={`Foto de perfil de ${userProfile.fullName}`}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-600">
                      {userProfile.fullName?.[0] ?? 'U'}
                    </span>
                  )}
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                      isOnlineNow ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                    aria-label={isOnlineNow ? 'Online' : 'Offline'}
                    title={isOnlineNow ? 'Online' : 'Offline'}
                  />
                </button>

                <div className="min-w-0">
                  <p className="text-sm text-slate-600">Perfil ativo</p>
                  <div className="flex items-center gap-2">
                    <p className="truncate text-lg font-semibold text-slate-900">{userProfile.fullName}</p>
                    <span className="flex-none rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                      {userProfile.age} anos
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right whitespace-nowrap">
                <p className="text-sm text-slate-600">Distancia</p>
                <p className="text-lg font-semibold text-slate-900">{freightEstimate.distanceKm.toFixed(2)} km</p>
              </div>
            </div>

            <DynamicSummaryCard />
          </div>
        </section>

        <BookingBottomSheet />
      </div>

      {isProfileModalOpen ? (
        <div
          className="fixed inset-0 z-[1400] flex items-center justify-center bg-slate-900/45 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Detalhes do perfil"
          onClick={() => setIsProfileModalOpen(false)}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">Perfil ativo</h2>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                aria-label="Fechar perfil"
                className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:border-slate-300"
              >
                Fechar
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3">
              {userProfile.profilePhotoUrl ? (
                <img
                  src={userProfile.profilePhotoUrl}
                  alt={`Foto de ${userProfile.fullName}`}
                  className="h-20 w-20 rounded-full border border-slate-200 object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-2xl font-semibold text-slate-600">
                  {userProfile.fullName?.[0] ?? 'U'}
                </div>
              )}
              <div>
                <p className="text-base font-semibold text-slate-900">{userProfile.fullName}</p>
                <p className="text-sm text-slate-600">{userProfile.age} anos</p>
                <p className={`text-sm font-medium ${isOnlineNow ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {isOnlineNow ? 'Online agora' : 'Offline'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsProfileModalOpen(false)
                logoutUser()
              }}
              aria-label="Sair da conta"
              className="mt-5 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
            >
              Sair da conta
            </button>
          </div>
        </div>
      ) : null}
    </main>
  )
}

export default App
