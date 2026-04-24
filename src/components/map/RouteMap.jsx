import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { DESTINATION_POINTS, PICKUP_POINTS } from '../../data/constants.js'

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
})

function findCoords(points, selectedId) {
  return points.find((point) => point.id === selectedId)?.coords
}

function RouteMap({ pickupId, destinationId }) {
  const pickupCoords = findCoords(PICKUP_POINTS, pickupId)
  const destinationCoords = findCoords(DESTINATION_POINTS, destinationId)

  if (!pickupCoords || !destinationCoords) {
    return null
  }

  const center = [
    (pickupCoords[0] + destinationCoords[0]) / 2,
    (pickupCoords[1] + destinationCoords[1]) / 2,
  ]

  return (
    <section className="relative h-[45vh] w-full overflow-hidden rounded-b-[2rem]" aria-label="Mapa da rota">
      <MapContainer center={center} zoom={12} scrollWheelZoom={false} className="h-full w-full" aria-label="Mapa Leaflet">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={pickupCoords} />
        <Marker position={destinationCoords} />
        <Polyline positions={[pickupCoords, destinationCoords]} pathOptions={{ color: '#fbbf24', weight: 6 }} />
      </MapContainer>

      <div className="pointer-events-none absolute left-4 top-4 rounded-2xl bg-white/90 px-3 py-2 shadow">
        <p className="text-xs font-medium text-slate-500">Rota simulada</p>
        <p className="text-sm font-semibold text-slate-900">Truckly Urbano</p>
      </div>
    </section>
  )
}

export default RouteMap
