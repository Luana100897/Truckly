export const VEHICLE_OPTIONS = [
  {
    id: 'fiorino',
    name: 'Fiorino',
    factor: 1.5,
    capacity: '400kg',
    eta: '30-45 min',
    etaMinutes: 38,
    image: '/vehicles/fiorino.png',
  },
  {
    id: 'van',
    name: 'Van de Carga',
    factor: 2.1,
    capacity: '900kg',
    eta: '40-60 min',
    etaMinutes: 50,
    image: '/vehicles/van-carga.png',
  },
  {
    id: 'bau',
    name: 'Caminhao Bau',
    factor: 2.8,
    capacity: '1800kg',
    eta: '50-75 min',
    etaMinutes: 62,
    image: '/vehicles/caminhao-bau.png',
  },
]

const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
})

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
})

const DAILY_SLOT_TEMPLATES = [
  ['08:00', '09:00', '10:00', '11:00'],
  ['10:00', '11:00', '12:00', '14:00', '16:00'],
  ['09:30', '11:30', '13:30', '15:30', '17:30'],
  ['08:30', '10:30', '12:30', '15:00', '18:00'],
]

function normalizeDate(date) {
  const localDate = new Date(date)
  localDate.setHours(0, 0, 0, 0)
  return localDate
}

function createAvailableSchedules(daysAhead = 10) {
  const now = new Date()
  const schedules = []

  for (let offset = 0; offset < daysAhead; offset += 1) {
    const date = normalizeDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset))
    const weekday = date.getDay()

    if (weekday === 0) {
      continue
    }

    const slotsTemplate = DAILY_SLOT_TEMPLATES[offset % DAILY_SLOT_TEMPLATES.length]

    schedules.push({
      id: date.toISOString().slice(0, 10),
      dateLabel: DATE_FORMATTER.format(date),
      weekdayLabel: WEEKDAY_FORMATTER.format(date).replace('.', ''),
      slots: slotsTemplate,
    })
  }

  return schedules
}

export const AVAILABLE_SCHEDULES = createAvailableSchedules()
