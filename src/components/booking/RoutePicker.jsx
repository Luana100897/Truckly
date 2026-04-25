import AddressAutocompleteField from './AddressAutocompleteField.jsx'

function RoutePicker({
  originInput,
  destinationInput,
  originSuggestions,
  destinationSuggestions,
  isSearchingOrigin,
  isSearchingDestination,
  selectedOrigin,
  selectedDestination,
  isLiveLocationEnabled,
  geoError,
  onOriginInputChange,
  onDestinationInputChange,
  onSelectOrigin,
  onSelectDestination,
  onStartLiveLocation,
  onStopLiveLocation,
}) {
  function handleLiveLocationClick() {
    if (!isLiveLocationEnabled) {
      const shouldEnable = window.confirm(
        'Deseja utilizar sua localizacao em tempo real para definir a origem automaticamente? Voce pode desativar quando quiser.',
      )

      if (shouldEnable) {
        onStartLiveLocation()
      }

      return
    }

    const shouldDisable = window.confirm('Deseja desativar a localizacao em tempo real?')

    if (shouldDisable) {
      onStopLiveLocation()
    }
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto] md:items-start">
      <AddressAutocompleteField
        id="origin"
        label="Origem"
        value={originInput}
        onChange={onOriginInputChange}
        suggestions={originSuggestions}
        isLoading={isSearchingOrigin}
        onSelect={onSelectOrigin}
        confirmation={selectedOrigin ? `${selectedOrigin.city}, ${selectedOrigin.country}` : ''}
        placeholder="Digite a rua, numero ou bairro"
      />

      <AddressAutocompleteField
        id="destination"
        label="Destino"
        value={destinationInput}
        onChange={onDestinationInputChange}
        suggestions={destinationSuggestions}
        isLoading={isSearchingDestination}
        onSelect={onSelectDestination}
        confirmation={selectedDestination ? `${selectedDestination.city}, ${selectedDestination.country}` : ''}
        placeholder="Para onde vamos?"
      />

      <div className="flex flex-wrap gap-2 md:pt-7">
        <button
          type="button"
          aria-label={isLiveLocationEnabled ? 'Desativar localizacao em tempo real' : 'Ativar localizacao em tempo real'}
          title={isLiveLocationEnabled ? 'Desativar localizacao em tempo real' : 'Ativar localizacao em tempo real'}
          onClick={handleLiveLocationClick}
          className={`group inline-flex h-9 w-9 items-center justify-center rounded-lg border transition ${
            isLiveLocationEnabled
              ? 'border-amber-300 bg-amber-50 shadow-[0_4px_10px_rgba(251,191,36,0.25)]'
              : 'border-slate-300 bg-white shadow-sm hover:border-slate-400'
          }`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
            <path
              d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
              fill={isLiveLocationEnabled ? '#f59e0b' : '#3b82f6'}
              stroke={isLiveLocationEnabled ? '#b45309' : '#1d4ed8'}
              strokeWidth="1.2"
            />
            <circle cx="12" cy="10" r="2.8" fill="#ffffff" />
          </svg>
        </button>
      </div>

      {geoError ? <p className="text-xs font-medium text-red-600 md:col-span-3">{geoError}</p> : null}
    </div>
  )
}

export default RoutePicker
