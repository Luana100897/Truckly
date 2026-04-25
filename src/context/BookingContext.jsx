import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AVAILABLE_SCHEDULES, VEHICLE_OPTIONS } from '../data/constants.js'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'
import { clearSessionUser, getSessionUser } from '../services/authService.js'
import { getFreightEstimate } from '../services/freightService.js'
import { reverseGeocode, searchAddresses } from '../services/geocodingService.js'
import { BookingContext } from './booking-context.js'

function findById(items, id) {
  return items.find((item) => item.id === id)
}

function toMinutes(slot) {
  const [hour, minute] = slot.split(':').map(Number)
  return hour * 60 + minute
}

function getCurrentMinutes() {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

function getVisibleSlots(schedule) {
  if (!schedule) {
    return []
  }

  const todayId = new Date().toISOString().slice(0, 10)

  if (schedule.id !== todayId) {
    return schedule.slots
  }

  const currentMinutes = getCurrentMinutes()
  return schedule.slots.filter((slot) => toMinutes(slot) >= currentMinutes)
}

function getVehicleRecommendations(vehicleQuotes, userProfile) {
  if (vehicleQuotes.length === 0) {
    return { bestValueVehicleId: null, cheapestVehicleId: null }
  }

  const cheapestVehicleId = [...vehicleQuotes].sort((a, b) => a.total - b.total)[0]?.id ?? null

  if (userProfile.role !== 'requester') {
    return { bestValueVehicleId: cheapestVehicleId, cheapestVehicleId }
  }

  const minBudget = userProfile.minBudget
  const maxBudget = userProfile.maxBudget
  const budgetMidpoint = (minBudget + maxBudget) / 2

  const insideBudget = vehicleQuotes.filter((quote) => quote.total >= minBudget && quote.total <= maxBudget)

  if (insideBudget.length === 0) {
    return { bestValueVehicleId: cheapestVehicleId, cheapestVehicleId }
  }

  const bestValue = [...insideBudget].sort((a, b) => {
    const diffA = Math.abs(a.total - budgetMidpoint)
    const diffB = Math.abs(b.total - budgetMidpoint)

    if (diffA !== diffB) {
      return diffA - diffB
    }

    return a.etaMinutes - b.etaMinutes
  })[0]

  return {
    bestValueVehicleId: bestValue?.id ?? cheapestVehicleId,
    cheapestVehicleId,
  }
}

const EMPTY_PROFILE = {
  role: 'requester',
  accountName: '',
  fullName: '',
  phone: '',
  email: '',
  password: '',
  cpf: '',
  birthDate: '',
  age: 0,
  profilePhotoUrl: '',
  profilePhotoName: '',
  minBudget: 0,
  maxBudget: 0,
  ratePerKm: 0,
  providerDetails: {
    plate: '',
    year: '',
    brand: '',
    model: '',
    vehicleDocumentName: '',
    cnhDocumentName: '',
    cnhFacePhotoName: '',
  },
}

export function BookingProvider({ children }) {
  const [vehicleId, setVehicleId] = useState(VEHICLE_OPTIONS[0].id)

  const [originInput, setOriginInput] = useState('')
  const [destinationInput, setDestinationInput] = useState('')
  const [selectedOrigin, setSelectedOrigin] = useState(null)
  const [selectedDestination, setSelectedDestination] = useState(null)

  const [originSuggestions, setOriginSuggestions] = useState([])
  const [destinationSuggestions, setDestinationSuggestions] = useState([])
  const [isSearchingOrigin, setIsSearchingOrigin] = useState(false)
  const [isSearchingDestination, setIsSearchingDestination] = useState(false)
  const [geoError, setGeoError] = useState('')

  const [isLiveLocationEnabled, setIsLiveLocationEnabled] = useState(false)
  const watchIdRef = useRef(null)
  const lastReverseLookupRef = useRef(0)

  const [selectedDateId, setSelectedDateId] = useState(AVAILABLE_SCHEDULES[0]?.id ?? '')
  const [selectedSlot, setSelectedSlot] = useState('')

  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [userProfile, setUserProfile] = useState(EMPTY_PROFILE)

  const debouncedOriginInput = useDebouncedValue(originInput)
  const debouncedDestinationInput = useDebouncedValue(destinationInput)

  const selectedVehicle = findById(VEHICLE_OPTIONS, vehicleId)

  const selectOrigin = useCallback((place) => {
    setOriginInput(place.displayName)
    setSelectedOrigin(place)
    setOriginSuggestions([])
    setGeoError('')
  }, [])

  const selectDestination = useCallback((place) => {
    setDestinationInput(place.displayName)
    setSelectedDestination(place)
    setDestinationSuggestions([])
  }, [])

  const completeUserProfile = useCallback((profile) => {
    setUserProfile(profile)
    setIsProfileComplete(true)
  }, [])

  const logoutUser = useCallback(() => {
    clearSessionUser()
    setIsProfileComplete(false)
    setUserProfile(EMPTY_PROFILE)
    setVehicleId(VEHICLE_OPTIONS[0].id)
    setOriginInput('')
    setDestinationInput('')
    setSelectedOrigin(null)
    setSelectedDestination(null)
    setOriginSuggestions([])
    setDestinationSuggestions([])
    setGeoError('')
    setIsSearchingOrigin(false)
    setIsSearchingDestination(false)
    setSelectedDateId(AVAILABLE_SCHEDULES[0]?.id ?? '')
    setSelectedSlot('')

    if (watchIdRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }

    setIsLiveLocationEnabled(false)
  }, [])

  useEffect(() => {
    const sessionUser = getSessionUser()
    if (sessionUser) {
      setUserProfile(sessionUser)
      setIsProfileComplete(true)
    }
  }, [])

  const stopLiveLocation = useCallback(() => {
    if (watchIdRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }

    setIsLiveLocationEnabled(false)
  }, [])

  const startLiveLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError('Seu navegador nao suporta geolocalizacao.')
      return
    }

    setGeoError('')
    setIsLiveLocationEnabled(true)

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const coords = [position.coords.latitude, position.coords.longitude]

        const fallbackPlace = {
          id: `live-${Date.now()}`,
          displayName: 'Minha localizacao em tempo real',
          city: 'Atualizando cidade...',
          country: 'Brasil',
          coords,
        }

        selectOrigin(fallbackPlace)

        const now = Date.now()

        if (now - lastReverseLookupRef.current < 12000) {
          return
        }

        lastReverseLookupRef.current = now

        try {
          const place = await reverseGeocode(coords)
          if (place) {
            selectOrigin(place)
          }
        } catch {
          // Keep fallback location when reverse lookup fails.
        }
      },
      (error) => {
        setGeoError(error.message || 'Nao foi possivel obter sua localizacao.')
        stopLiveLocation()
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      },
    )

    watchIdRef.current = watchId
  }, [selectOrigin, stopLiveLocation])

  const onOriginInputChange = useCallback(
    (value) => {
      setOriginInput(value)
      setGeoError('')

      if (value.trim().length < 3) {
        setOriginSuggestions([])
        setIsSearchingOrigin(false)
      }

      if (selectedOrigin && value !== selectedOrigin.displayName) {
        setSelectedOrigin(null)
      }
    },
    [selectedOrigin],
  )

  const onDestinationInputChange = useCallback(
    (value) => {
      setDestinationInput(value)

      if (value.trim().length < 3) {
        setDestinationSuggestions([])
        setIsSearchingDestination(false)
      }

      if (selectedDestination && value !== selectedDestination.displayName) {
        setSelectedDestination(null)
      }
    },
    [selectedDestination],
  )

  useEffect(() => {
    const query = debouncedOriginInput?.trim() ?? ''

    if (query.length < 3) {
      return undefined
    }

    if (selectedOrigin && query === selectedOrigin.displayName) {
      return undefined
    }

    const controller = new AbortController()

    async function runSearch() {
      try {
        setIsSearchingOrigin(true)
        const suggestions = await searchAddresses(query, controller.signal)
        setOriginSuggestions(suggestions)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setOriginSuggestions([])
        }
      } finally {
        setIsSearchingOrigin(false)
      }
    }

    runSearch()

    return () => {
      controller.abort()
    }
  }, [debouncedOriginInput, selectedOrigin])

  useEffect(() => {
    const query = debouncedDestinationInput?.trim() ?? ''

    if (query.length < 3) {
      return undefined
    }

    if (selectedDestination && query === selectedDestination.displayName) {
      return undefined
    }

    const controller = new AbortController()

    async function runSearch() {
      try {
        setIsSearchingDestination(true)
        const suggestions = await searchAddresses(query, controller.signal)
        setDestinationSuggestions(suggestions)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setDestinationSuggestions([])
        }
      } finally {
        setIsSearchingDestination(false)
      }
    }

    runSearch()

    return () => {
      controller.abort()
    }
  }, [debouncedDestinationInput, selectedDestination])

  useEffect(
    () => () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    },
    [],
  )

  const availableDates = useMemo(
    () => AVAILABLE_SCHEDULES.filter((schedule) => getVisibleSlots(schedule).length > 0),
    [],
  )

  const normalizedSelectedDateId =
    availableDates.find((schedule) => schedule.id === selectedDateId)?.id ?? availableDates[0]?.id ?? ''

  const selectedDate = findById(availableDates, normalizedSelectedDateId)
  const availableSlots = useMemo(() => getVisibleSlots(selectedDate), [selectedDate])

  const normalizedSelectedSlot = availableSlots.includes(selectedSlot) ? selectedSlot : ''
  const customRatePerKm = isProfileComplete && userProfile.role === 'provider' ? userProfile.ratePerKm : null

  const vehicleQuotes = useMemo(
    () =>
      VEHICLE_OPTIONS.map((vehicle) => {
        const estimate = getFreightEstimate(
          selectedOrigin?.coords,
          selectedDestination?.coords,
          vehicle.factor,
          customRatePerKm,
        )

        return {
          ...vehicle,
          total: estimate.total,
          distanceKm: estimate.distanceKm,
        }
      }),
    [selectedOrigin, selectedDestination, customRatePerKm],
  )

  const { bestValueVehicleId, cheapestVehicleId } = useMemo(
    () => getVehicleRecommendations(vehicleQuotes, userProfile),
    [vehicleQuotes, userProfile],
  )

  const freightEstimate = getFreightEstimate(
    selectedOrigin?.coords,
    selectedDestination?.coords,
    selectedVehicle?.factor,
    customRatePerKm,
  )

  const value = useMemo(
    () => ({
      vehicleId,
      selectedVehicle,
      originInput,
      destinationInput,
      selectedOrigin,
      selectedDestination,
      originSuggestions,
      destinationSuggestions,
      isSearchingOrigin,
      isSearchingDestination,
      isLiveLocationEnabled,
      geoError,
      isProfileComplete,
      userProfile,
      selectedDateId: normalizedSelectedDateId,
      selectedDate,
      selectedSlot: normalizedSelectedSlot,
      availableDates,
      availableSlots,
      vehicleQuotes,
      bestValueVehicleId,
      cheapestVehicleId,
      freightEstimate,
      setVehicleId,
      onOriginInputChange,
      onDestinationInputChange,
      selectOrigin,
      selectDestination,
      startLiveLocation,
      stopLiveLocation,
      completeUserProfile,
      logoutUser,
      setSelectedDateId,
      setSelectedSlot,
    }),
    [
      vehicleId,
      selectedVehicle,
      originInput,
      destinationInput,
      selectedOrigin,
      selectedDestination,
      originSuggestions,
      destinationSuggestions,
      isSearchingOrigin,
      isSearchingDestination,
      isLiveLocationEnabled,
      geoError,
      isProfileComplete,
      userProfile,
      normalizedSelectedDateId,
      selectedDate,
      normalizedSelectedSlot,
      availableDates,
      availableSlots,
      vehicleQuotes,
      bestValueVehicleId,
      cheapestVehicleId,
      freightEstimate,
      onOriginInputChange,
      onDestinationInputChange,
      selectOrigin,
      selectDestination,
      startLiveLocation,
      stopLiveLocation,
      completeUserProfile,
      logoutUser,
    ],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}
