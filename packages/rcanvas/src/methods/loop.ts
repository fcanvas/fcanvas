const callbacks = new Set<() => void>()
// eslint-disable-next-line functional/no-let
let cbNow: (() => void) | void

function _loop() {
  // eslint-disable-next-line no-sequences
  callbacks.forEach((cb) => ((cbNow = cb)(), (cbNow = undefined)))

  if (callbacks.size === 0) return

  requestAnimationFrame(_loop)
}

export function loop(callback: () => void): void {
  callbacks.add(callback)
  _loop()
}

export function stop(all: true): void
// eslint-disable-next-line no-redeclare
export function stop(callback?: () => void): void
// eslint-disable-next-line no-redeclare
export function stop(callback?: (() => void) | true) {
  if (callback === true) {
    callbacks.clear()
    return
  }

  if (callback) {
    callbacks.delete(callback)
    return
  }

  if (cbNow) callbacks.delete(cbNow)
}
