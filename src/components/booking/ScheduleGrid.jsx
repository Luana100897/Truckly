import { AVAILABLE_SLOTS } from '../../data/constants.js'

function ScheduleGrid({ selectedSlot, onSelect }) {
  return (
    <div className="grid grid-cols-3 gap-2" role="group" aria-label="Horarios disponiveis">
      {AVAILABLE_SLOTS.map((slot) => {
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
                : 'border-slate-200 bg-white text-slate-700'
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
