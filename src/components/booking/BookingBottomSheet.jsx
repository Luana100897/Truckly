import RoutePicker from './RoutePicker.jsx'
import ScheduleGrid from './ScheduleGrid.jsx'
import VehicleSelector from './VehicleSelector.jsx'
import { useBooking } from '../../hooks/useBooking.js'

function BookingBottomSheet() {
  const {
    pickupId,
    destinationId,
    vehicleId,
    selectedSlot,
    setPickupId,
    setDestinationId,
    setVehicleId,
    setSelectedSlot,
  } = useBooking()

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
    </section>
  )
}

export default BookingBottomSheet
