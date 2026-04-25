import { useBooking } from '../../hooks/useBooking.js'
import { formatCurrency } from '../../utils/formatCurrency.js'

function DynamicSummaryCard() {
  const {
    userProfile,
    selectedDateId,
    selectedDate,
    selectedSlot,
    selectedVehicle,
    selectedOrigin,
    selectedDestination,
    freightEstimate,
  } = useBooking()

  const isRequester = userProfile.role === 'requester'
  const canConfirm = Boolean(selectedOrigin && selectedDestination && selectedDateId && selectedSlot)
  const infoCardClass = 'rounded-xl bg-white p-2.5 shadow-sm'

  return (
    <div className="mt-2 rounded-2xl bg-slate-50/70 p-2.5" aria-live="polite">
      <p className="text-xs uppercase tracking-wider text-slate-500">Resumo dinamico</p>

      <div className="mt-1.5 grid grid-cols-[1.22fr_0.78fr] items-start gap-2">
        <div className="space-y-1.5">
          <div className={infoCardClass}>
            <p className="text-xs text-slate-600">Origem</p>
            <p className="text-sm font-semibold text-slate-900">
              {selectedOrigin ? `${selectedOrigin.city}, ${selectedOrigin.country}` : 'Nao definida'}
            </p>
          </div>

          <div className={infoCardClass}>
            <p className="text-xs text-slate-600">Destino</p>
            <p className="text-sm font-semibold text-slate-900">
              {selectedDestination ? `${selectedDestination.city}, ${selectedDestination.country}` : 'Nao definido'}
            </p>
          </div>

          <div className={infoCardClass}>
            <p className="text-xs text-slate-600">Distancia estimada</p>
            <p className="text-lg font-semibold text-slate-900">{freightEstimate.distanceKm.toFixed(2)} km</p>
          </div>
        </div>

        <div className="self-stretch rounded-xl bg-white p-2.5 shadow-sm">
          <p className="text-xs text-slate-600">Veiculo selecionado</p>
          <p className="text-sm font-semibold text-slate-900">{selectedVehicle?.name}</p>
          <div className="mt-1 min-h-28 rounded-lg bg-white p-0.5">
            <img
              src={selectedVehicle?.image}
              alt={`Imagem de ${selectedVehicle?.name}`}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-1.5 grid grid-cols-[1.16fr_0.84fr] gap-2">
        <div className={`${infoCardClass} col-start-1`}>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Data do agendamento</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-900">
            {selectedDate ? `${selectedDate.weekdayLabel}, ${selectedDate.dateLabel}` : 'Sem data disponivel'}
            {selectedSlot ? ` as ${selectedSlot}` : ''}
          </p>
        </div>

        <div className="col-start-2 w-full justify-self-stretch rounded-xl border border-amber-200 bg-amber-50 p-2.5">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-700">Valor estimado</p>
          {isRequester ? (
            <p className="mt-0.5 whitespace-nowrap text-[0.95rem] font-semibold text-slate-900">
              {formatCurrency(userProfile.minBudget)} ate {formatCurrency(userProfile.maxBudget)}
            </p>
          ) : (
            <p className="mt-0.5 whitespace-nowrap text-[0.95rem] font-semibold text-slate-900">{formatCurrency(userProfile.ratePerKm)} por km</p>
          )}
        </div>
      </div>

      {!isRequester ? (
        <p className="mt-2 text-xs text-slate-600">
          Veiculo cadastrado: {userProfile.providerDetails.brand} {userProfile.providerDetails.model} ({userProfile.providerDetails.year}) - {userProfile.providerDetails.plate}
        </p>
      ) : null}

      <div className="mt-1.5">
        <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Valor total</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(freightEstimate.total)}</p>
        </div>

        <button
          type="button"
          aria-label="Agenda frete"
          disabled={!canConfirm}
          className="mt-2 w-full rounded-xl bg-slate-900 px-4 py-2.5 font-semibold text-white transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Agenda frete
        </button>
      </div>
    </div>
  )
}

export default DynamicSummaryCard
