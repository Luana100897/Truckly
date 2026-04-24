function HeaderMapPlaceholder() {
  return (
    <section
      className="relative h-[45vh] w-full rounded-b-[2rem] bg-gradient-to-br from-amber-300 to-amber-500 p-4"
      aria-label="Área do mapa"
    >
      <div className="h-full w-full rounded-3xl border border-white/30 bg-white/30 backdrop-blur-sm" />
      <div className="absolute left-8 top-8 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow">
        Truckly MVP
      </div>
    </section>
  )
}

export default HeaderMapPlaceholder
