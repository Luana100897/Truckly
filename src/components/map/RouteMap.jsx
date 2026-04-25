import { useEffect } from 'react'
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
})

const DEFAULT_CENTER = [-23.5505, -46.6333]

function getMapCenter(originCoords, destinationCoords) {
  if (originCoords && destinationCoords) {
    return [
      (originCoords[0] + destinationCoords[0]) / 2,
      (originCoords[1] + destinationCoords[1]) / 2,
    ]
  }

  return originCoords ?? destinationCoords ?? DEFAULT_CENTER
}

function ViewportController({ originCoords, destinationCoords }) {
  const map = useMap()

  useEffect(() => {
    const center = getMapCenter(originCoords, destinationCoords)

    if (originCoords && destinationCoords) {
      const bounds = L.latLngBounds([originCoords, destinationCoords])
      map.fitBounds(bounds.pad(0.35))
      return
    }

    map.setView(center, originCoords || destinationCoords ? 14 : 12)
  }, [map, originCoords, destinationCoords])

  return null
}

function RouteMap({ originCoords, destinationCoords }) {
  const center = getMapCenter(originCoords, destinationCoords)

  return (
    <section className="relative h-[20vh] w-full overflow-hidden lg:h-[34%]" aria-label="Mapa da rota">
      <MapContainer center={center} zoom={12} scrollWheelZoom className="h-full w-full" aria-label="Mapa Leaflet">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ViewportController originCoords={originCoords} destinationCoords={destinationCoords} />

        {originCoords ? <Marker position={originCoords} /> : null}
        {destinationCoords ? <Marker position={destinationCoords} /> : null}
        {originCoords && destinationCoords ? (
          <Polyline positions={[originCoords, destinationCoords]} pathOptions={{ color: '#fbbf24', weight: 6 }} />
        ) : null}
      </MapContainer>

      <div className="pointer-events-none absolute left-4 top-4 rounded-2xl bg-white/90 px-3 py-2 shadow lg:left-5 lg:top-5 lg:px-4 lg:py-3">
        <p className="text-xs font-medium text-slate-500">Mapa em tempo real</p>
        <p className="text-sm font-semibold text-slate-900 lg:text-base">Truckly Urbano</p>
      </div>
    </section>
  )
}

export default RouteMap
