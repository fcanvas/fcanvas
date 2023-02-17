// eslint-disable-next-line functional/no-mixed-type
interface Looper {
  (): void
  stopped: boolean
}

export function loop(fn: (stop: () => void) => void): Looper {
  // eslint-disable-next-line functional/no-let
  let idRq: number | null = null

  const stop = (() => {
    if (idRq) cancelAnimationFrame(idRq)
    stop.stopped = true
  }) as Looper
  stop.stopped = false

  function draw() {
    if (stop.stopped) return

    fn(stop)
    idRq = requestAnimationFrame(draw)
  }
  draw()

  return stop
}
