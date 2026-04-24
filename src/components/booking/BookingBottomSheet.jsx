import { useBooking } from '../../hooks/useBooking.js'
import { usePageVisibilityAlert } from '../../hooks/usePageVisibilityAlert.js'
import { formatCurrency } from '../../utils/formatCurrency.js'
import RoutePicker from './RoutePicker.jsx'
import ScheduleGrid from './ScheduleGrid.jsx'
import VehicleSelector from './VehicleSelector.jsx'

function BookingBottomSheet() {
  const {
    pickupId,
    destinationId,
    vehicleId,
    selectedSlot,
    selectedVehicle,
    freightEstimate,
    setPickupId,
    setDestinationId,
    setVehicleId,
    setSelectedSlot,
  } = useBooking()

  usePageVisibilityAlert(Boolean(selectedSlot))

  return (
    <section
      className="relative -mt-8 flex-1 rounded-t-[2rem] bg-white px-4 pb-8 pt-5 shadow-[0_-10px_30px_rgba(17,24,39,0.2)]"
      aria-label="Painel de agendamento"
    >
      <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-slate-300" />
      <h1 className="text-2xl font-bold text-slate-900">Agende seu frete</h1>
      <p className="mb-4 text-sm text-slate-600">Escolha rota, veiculo e horario.</p>

      <RoutePicker
        pickupId={pickupId}
        destinationId={destinationId}
        onPickupChange={setPickupId}
        onDestinationChange={setDestinationId}
      />

      <h2 className="mb-2 mt-5 text-sm font-semibold uppercase tracking-wide text-slate-500">Veiculo</h2>
      <VehicleSelector selectedVehicleId={vehicleId} onSelect={setVehicleId} />

      <h2 className="mb-2 mt-5 text-sm font-semibold uppercase tracking-wide text-slate-500">Horarios</h2>
      <ScheduleGrid selectedSlot={selectedSlot} onSelect={setSelectedSlot} />

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4" aria-live="polite">
        <p className="text-xs uppercase tracking-wider text-slate-500">Resumo dinamico</p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm text-slate-600">Distancia estimada</p>
            <p className="text-lg font-semibold text-slate-900">{freightEstimate.distanceKm.toFixed(2)} km</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">Veiculo</p>
            <p className="text-base font-semibold text-slate-900">{selectedVehicle?.name}</p>
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold text-slate-900">{formatCurrency(freightEstimate.total)}</p>
      </div>

      <button
        type="button"
        aria-label="Confirmar agendamento"
        disabled={!selectedSlot}
        className="mt-5 w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {selectedSlot ? `Confirmar para ${selectedSlot}` : 'Escolha um horario para continuar'}
      </button>
    </section>
  )
}

export default BookingBottomSheet
