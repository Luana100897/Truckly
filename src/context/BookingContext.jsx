import { useMemo, useState } from 'react'
import { DESTINATION_POINTS, PICKUP_POINTS, VEHICLE_OPTIONS } from '../data/constants.js'
import { getFreightEstimate } from '../services/freightService.js'
import { BookingContext } from './booking-context.js'

function findById(items, id) {
  return items.find((item) => item.id === id)
}

export function BookingProvider({ children }) {
  const [pickupId, setPickupId] = useState(PICKUP_POINTS[0].id)
  const [destinationId, setDestinationId] = useState(DESTINATION_POINTS[0].id)
  const [vehicleId, setVehicleId] = useState(VEHICLE_OPTIONS[0].id)
  const [selectedSlot, setSelectedSlot] = useState('')

  const selectedPickup = findById(PICKUP_POINTS, pickupId)
  const selectedDestination = findById(DESTINATION_POINTS, destinationId)
  const selectedVehicle = findById(VEHICLE_OPTIONS, vehicleId)

  const freightEstimate = getFreightEstimate(
    selectedPickup?.coords,
    selectedDestination?.coords,
    selectedVehicle?.factor,
  )

  const value = useMemo(
    () => ({
      pickupId,
      destinationId,
      vehicleId,
      selectedSlot,
      selectedPickup,
      selectedDestination,
      selectedVehicle,
      freightEstimate,
      setPickupId,
      setDestinationId,
      setVehicleId,
      setSelectedSlot,
    }),
    [
      pickupId,
      destinationId,
      vehicleId,
      selectedSlot,
      selectedPickup,
      selectedDestination,
      selectedVehicle,
      freightEstimate,
    ],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}
