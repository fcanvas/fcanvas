const callbacks = new Set<() => void>();
// eslint-disable-next-line functional/no-let
let cbNow;

function _loop() {
  callbacks.forEach((cb) => ((cbNow = cb)(), (cbNow = void 0)));

  if (callbacks.size === 0) {
    return;
  }

  requestAnimationFrame(_loop);
}

export function rqaf(callback: () => void): void {
  callbacks.add(callback);
  _loop();
}

export function stop(all: true): void;
export function stop(callback?: () => void): voud;
export function stop(callback?: (() => void) | true) {
  if (callback === true) {
    callbacks.clear();
    return;
  }

  if (callback) {
    callbacks.delete(callback);
    return;
  }

  callbacks.delete(cbNow);
}
