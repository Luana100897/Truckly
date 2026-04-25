import { formatCurrency } from '../../utils/formatCurrency.js'

function VehicleSelector({
  selectedVehicleId,
  vehicleQuotes,
  cheapestVehicleId,
  onSelect,
}) {
  return (
    <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0" aria-label="Selecao de veiculos">
      {vehicleQuotes.map((vehicle) => {
        const selected = vehicle.id === selectedVehicleId
        const isCheapest = vehicle.id === cheapestVehicleId

        return (
          <button
            key={vehicle.id}
            type="button"
            aria-label={`Selecionar veiculo ${vehicle.name}`}
            onClick={() => onSelect(vehicle.id)}
            className={`min-w-44 rounded-2xl border text-left transition lg:min-w-0 ${
              selected
                ? 'border-amber-400 bg-amber-50 text-slate-900 shadow'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <img
              src={vehicle.image}
              alt={`Imagem ilustrativa de ${vehicle.name}`}
              className="h-32 w-full rounded-t-2xl bg-slate-100 object-scale-down p-1"
            />

            <div className="px-4 py-3">
              <div className="mb-2 flex flex-wrap gap-1">
                {isCheapest ? (
                  <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-700">Mais barato</span>
                ) : null}
              </div>

              <p className="font-semibold">{vehicle.name}</p>
              <p className="text-xs">{vehicle.capacity}</p>
              <p className="text-xs">ETA {vehicle.eta}</p>
              <p className="mt-1 text-xs font-semibold text-amber-600">Fator x{vehicle.factor}</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{formatCurrency(vehicle.total)}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default VehicleSelector
