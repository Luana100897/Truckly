import { useBooking } from '../../hooks/useBooking.js'
import { usePageVisibilityAlert } from '../../hooks/usePageVisibilityAlert.js'
import DateSelector from './DateSelector.jsx'
import RoutePicker from './RoutePicker.jsx'
import ScheduleGrid from './ScheduleGrid.jsx'
import VehicleSelector from './VehicleSelector.jsx'

function BookingBottomSheet() {
  const {
    vehicleId,
    selectedDateId,
    selectedSlot,
    selectedOrigin,
    selectedDestination,
    originInput,
    destinationInput,
    originSuggestions,
    destinationSuggestions,
    isSearchingOrigin,
    isSearchingDestination,
    isLiveLocationEnabled,
    geoError,
    vehicleQuotes,
    cheapestVehicleId,
    availableDates,
    availableSlots,
    setVehicleId,
    onOriginInputChange,
    onDestinationInputChange,
    selectOrigin,
    selectDestination,
    startLiveLocation,
    stopLiveLocation,
    setSelectedDateId,
    setSelectedSlot,
  } = useBooking()

  const canConfirm = Boolean(selectedOrigin && selectedDestination && selectedDateId && selectedSlot)

  usePageVisibilityAlert(canConfirm)

  return (
    <section
      className="relative flex h-full flex-col rounded-[2rem] bg-white px-4 pb-7 pt-5 shadow-xl ring-1 ring-slate-200/80 lg:rounded-[2.25rem] lg:px-6 lg:pt-6"
      aria-label="Painel de agendamento"
    >
      <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-slate-300 lg:hidden" />
      <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">Agende seu frete</h1>
      <p className="mb-4 text-sm text-slate-600 lg:mb-5">Digite origem e destino com endereco real, depois escolha veiculo, data e horario.</p>

      <div className="space-y-5 overflow-auto pr-1 lg:pb-2">
        <RoutePicker
          originInput={originInput}
          destinationInput={destinationInput}
          originSuggestions={originSuggestions}
          destinationSuggestions={destinationSuggestions}
          isSearchingOrigin={isSearchingOrigin}
          isSearchingDestination={isSearchingDestination}
          selectedOrigin={selectedOrigin}
          selectedDestination={selectedDestination}
          isLiveLocationEnabled={isLiveLocationEnabled}
          geoError={geoError}
          onOriginInputChange={onOriginInputChange}
          onDestinationInputChange={onDestinationInputChange}
          onSelectOrigin={selectOrigin}
          onSelectDestination={selectDestination}
          onStartLiveLocation={startLiveLocation}
          onStopLiveLocation={stopLiveLocation}
        />

        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Veiculo</h2>
          <VehicleSelector
            selectedVehicleId={vehicleId}
            vehicleQuotes={vehicleQuotes}
            cheapestVehicleId={cheapestVehicleId}
            onSelect={setVehicleId}
          />
        </div>

        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Datas</h2>
          <DateSelector availableDates={availableDates} selectedDateId={selectedDateId} onSelect={setSelectedDateId} />
        </div>

        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Horarios</h2>
          <ScheduleGrid availableSlots={availableSlots} selectedSlot={selectedSlot} onSelect={setSelectedSlot} />
        </div>
      </div>

    </section>
  )
}

export default BookingBottomSheet
