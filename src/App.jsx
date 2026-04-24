import BookingBottomSheet from './components/booking/BookingBottomSheet.jsx'
import HeaderMapPlaceholder from './components/layout/HeaderMapPlaceholder.jsx'

function App() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white/80 shadow-xl backdrop-blur-sm">
      <HeaderMapPlaceholder />
      <BookingBottomSheet />
    </main>
  )
}

export default App
