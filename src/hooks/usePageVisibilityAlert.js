import { useEffect } from 'react'

export function usePageVisibilityAlert(isBookingInProgress) {
  useEffect(() => {
    if (!isBookingInProgress) {
      return undefined
    }

    function onVisibilityChange() {
      if (document.hidden) {
        window.alert('Seu agendamento esta em andamento. Volte para finalizar na Truckly.')
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [isBookingInProgress])
}
