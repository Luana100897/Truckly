import BookingBottomSheet from './components/booking/BookingBottomSheet.jsx'
import RouteMap from './components/map/RouteMap.jsx'
import { useBooking } from './hooks/useBooking.js'

function App() {
  const { pickupId, destinationId } = useBooking()

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white/80 shadow-xl backdrop-blur-sm">
      <RouteMap pickupId={pickupId} destinationId={destinationId} />
      <BookingBottomSheet />
    </main>
  )
}

export default App
