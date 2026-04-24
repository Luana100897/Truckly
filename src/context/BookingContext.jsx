import { createContext, useMemo, useState } from 'react'
import { DESTINATION_POINTS, PICKUP_POINTS, VEHICLE_OPTIONS } from '../data/constants.js'

export const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [pickupId, setPickupId] = useState(PICKUP_POINTS[0].id)
  const [destinationId, setDestinationId] = useState(DESTINATION_POINTS[0].id)
  const [vehicleId, setVehicleId] = useState(VEHICLE_OPTIONS[0].id)
  const [selectedSlot, setSelectedSlot] = useState('')

  const value = useMemo(
    () => ({
      pickupId,
      destinationId,
      vehicleId,
      selectedSlot,
      setPickupId,
      setDestinationId,
      setVehicleId,
      setSelectedSlot,
    }),
    [pickupId, destinationId, vehicleId, selectedSlot],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}
