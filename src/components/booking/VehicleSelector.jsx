import { VEHICLE_OPTIONS } from '../../data/constants.js'

function VehicleSelector({ selectedVehicleId, onSelect }) {
  return (
    <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2" aria-label="Selecao de veiculos">
      {VEHICLE_OPTIONS.map((vehicle) => {
        const selected = vehicle.id === selectedVehicleId

        return (
          <button
            key={vehicle.id}
            type="button"
            aria-label={`Selecionar veiculo ${vehicle.name}`}
            onClick={() => onSelect(vehicle.id)}
            className={`min-w-40 rounded-2xl border px-4 py-3 text-left transition ${
              selected
                ? 'border-amber-400 bg-amber-50 text-slate-900'
                : 'border-slate-200 bg-white text-slate-600'
            }`}
          >
            <p className="font-semibold">{vehicle.name}</p>
            <p className="text-xs">{vehicle.capacity}</p>
            <p className="text-xs">ETA {vehicle.eta}</p>
          </button>
        )
      })}
    </div>
  )
}

export default VehicleSelector
