import { AVAILABLE_SLOTS } from '../../data/constants.js'

function toMinutes(slot) {
  const [hour, minute] = slot.split(':').map(Number)
  return hour * 60 + minute
}

function getCurrentMinutes() {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

function ScheduleGrid({ selectedSlot, onSelect }) {
  const currentMinutes = getCurrentMinutes()

  return (
    <div className="grid grid-cols-3 gap-2" role="group" aria-label="Horarios disponiveis">
      {AVAILABLE_SLOTS.map((slot) => {
        const selected = slot === selectedSlot
        const disabled = toMinutes(slot) < currentMinutes

        return (
          <button
            key={slot}
            type="button"
            aria-label={`Selecionar horario ${slot}`}
            aria-disabled={disabled}
            disabled={disabled}
            onClick={() => onSelect(slot)}
            className={`rounded-xl border px-2 py-3 text-sm font-medium transition ${
              selected
                ? 'border-amber-500 bg-amber-400 text-slate-900'
                : 'border-slate-200 bg-white text-slate-700'
            } ${disabled ? 'cursor-not-allowed opacity-45' : 'hover:border-amber-300'}`}
          >
            {slot}
          </button>
        )
      })}
    </div>
  )
}

export default ScheduleGrid
