import { DESTINATION_POINTS, PICKUP_POINTS } from '../../data/constants.js'

function RoutePicker({ pickupId, destinationId, onPickupChange, onDestinationChange }) {
  return (
    <div className="grid grid-cols-1 gap-3">
      <label className="text-sm font-medium text-slate-700" htmlFor="pickup">
        Origem
        <select
          id="pickup"
          aria-label="Selecionar origem"
          value={pickupId}
          onChange={(event) => onPickupChange(event.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
        >
          {PICKUP_POINTS.map((point) => (
            <option key={point.id} value={point.id}>
              {point.label}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-medium text-slate-700" htmlFor="destination">
        Destino
        <select
          id="destination"
          aria-label="Selecionar destino"
          value={destinationId}
          onChange={(event) => onDestinationChange(event.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
        >
          {DESTINATION_POINTS.map((point) => (
            <option key={point.id} value={point.id}>
              {point.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

export default RoutePicker
