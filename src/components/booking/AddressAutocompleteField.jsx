function AddressAutocompleteField({
  id,
  label,
  value,
  onChange,
  suggestions,
  isLoading,
  onSelect,
  confirmation,
  placeholder,
}) {
  return (
    <div className="relative">
      <label className="text-sm font-medium text-slate-700" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        aria-label={`Digite o endereco de ${label.toLowerCase()}`}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
      />

      {isLoading ? <p className="mt-1 text-xs text-slate-500">Buscando endereco...</p> : null}

      {confirmation ? <p className="mt-1 text-xs font-medium text-slate-600">Confirmacao: {confirmation}</p> : null}

      {suggestions.length > 0 ? (
        <div className="absolute z-[1200] mt-1 max-h-56 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              type="button"
              aria-label={`Selecionar endereco ${suggestion.displayName}`}
              onClick={() => onSelect(suggestion)}
              className="w-full rounded-lg px-3 py-2 text-left transition hover:bg-slate-100"
            >
              <p className="text-sm font-medium text-slate-800">{suggestion.displayName}</p>
              <p className="text-xs text-slate-500">
                {suggestion.city}, {suggestion.country}
              </p>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default AddressAutocompleteField
