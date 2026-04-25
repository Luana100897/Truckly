const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org'

function mapPlace(place) {
  const address = place.address ?? {}

  return {
    id: place.place_id?.toString() ?? `${place.lat}-${place.lon}`,
    displayName: place.display_name,
    city: address.city ?? address.town ?? address.village ?? address.municipality ?? 'Cidade nao identificada',
    country: address.country ?? 'Pais nao identificado',
    coords: [Number(place.lat), Number(place.lon)],
  }
}

export async function searchAddresses(query, signal) {
  if (!query || query.trim().length < 3) {
    return []
  }

  const params = new URLSearchParams({
    q: query.trim(),
    format: 'jsonv2',
    addressdetails: '1',
    limit: '5',
    countrycodes: 'br',
  })

  const response = await fetch(`${NOMINATIM_BASE_URL}/search?${params}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  if (!response.ok) {
    throw new Error('Nao foi possivel buscar os enderecos agora.')
  }

  const results = await response.json()
  return results.map(mapPlace)
}

export async function reverseGeocode(coords, signal) {
  if (!coords) {
    return null
  }

  const [lat, lon] = coords

  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    format: 'jsonv2',
    addressdetails: '1',
  })

  const response = await fetch(`${NOMINATIM_BASE_URL}/reverse?${params}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  if (!response.ok) {
    throw new Error('Nao foi possivel converter sua localizacao em endereco.')
  }

  const result = await response.json()
  return mapPlace(result)
}
