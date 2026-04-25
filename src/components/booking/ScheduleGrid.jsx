function ScheduleGrid({ availableSlots, selectedSlot, onSelect }) {
  if (availableSlots.length === 0) {
    return (
      <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
        Nenhum horario disponivel para esta data.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-2 lg:grid-cols-4" role="group" aria-label="Horarios disponiveis">
      {availableSlots.map((slot) => {
        const selected = slot === selectedSlot

        return (
          <button
            key={slot}
            type="button"
            aria-label={`Selecionar horario ${slot}`}
            onClick={() => onSelect(slot)}
            className={`rounded-xl border px-2 py-3 text-sm font-medium transition ${
              selected
                ? 'border-amber-500 bg-amber-400 text-slate-900'
                : 'border-slate-200 bg-white text-slate-700 hover:border-amber-300'
            }`}
          >
            {slot}
          </button>
        )
      })}
    </div>
  )
}

export default ScheduleGrid
