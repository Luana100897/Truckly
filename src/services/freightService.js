export function toRadians(value) {
  return (value * Math.PI) / 180
}

export function calculateDistanceKm(originCoords, destinationCoords) {
  if (!originCoords || !destinationCoords) {
    return 0
  }

  const [lat1, lon1] = originCoords
  const [lat2, lon2] = destinationCoords

  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const rawDistance = 6371 * c

  return Number(rawDistance.toFixed(2))
}

export function calculateFreightPrice(distanceKm, vehicleFactor, customRatePerKm) {
  if (!distanceKm) {
    return 0
  }

  const appliedRate = customRatePerKm && customRatePerKm > 0 ? customRatePerKm : vehicleFactor

  if (!appliedRate) {
    return 0
  }

  return Number((distanceKm * appliedRate).toFixed(2))
}

export function getFreightEstimate(originCoords, destinationCoords, vehicleFactor, customRatePerKm) {
  const distanceKm = calculateDistanceKm(originCoords, destinationCoords)
  const total = calculateFreightPrice(distanceKm, vehicleFactor, customRatePerKm)

  return {
    distanceKm,
    total,
    appliedRatePerKm: customRatePerKm && customRatePerKm > 0 ? customRatePerKm : vehicleFactor,
  }
}
