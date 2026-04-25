function DateSelector({ availableDates, selectedDateId, onSelect }) {
  if (availableDates.length === 0) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
        Sem datas disponiveis no momento.
      </p>
    )
  }

  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 lg:mx-0 lg:px-0" aria-label="Selecao de datas">
      {availableDates.map((date) => {
        const selected = date.id === selectedDateId

        return (
          <button
            key={date.id}
            type="button"
            aria-label={`Selecionar data ${date.dateLabel}`}
            onClick={() => onSelect(date.id)}
            className={`min-w-24 rounded-xl border px-3 py-2 text-left transition ${
              selected
                ? 'border-amber-500 bg-amber-400 text-slate-900'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <p className="text-xs uppercase tracking-wide">{date.weekdayLabel}</p>
            <p className="text-sm font-semibold">{date.dateLabel}</p>
          </button>
        )
      })}
    </div>
  )
}

export default DateSelector
