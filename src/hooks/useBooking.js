import { useContext } from 'react'
import { BookingContext } from '../context/BookingContext.jsx'

export function useBooking() {
  const booking = useContext(BookingContext)

  if (!booking) {
    throw new Error('useBooking deve ser usado dentro de BookingProvider')
  }

  return booking
}
