import type {
  CbUseIntervalFn,
  IntervalUseIntervalFn,
  OptionsUseIntervalFn
} from "./useIntervalFn"
import { useIntervalFn } from "./useIntervalFn"

interface ReturnUseIntervalFnPipe extends ReturnType<typeof useIntervalFn> {
  // eslint-disable-next-line functional/no-method-signature
  pipe(fn: () => void): void
}

export function useIntervalFnPipe(
  cb: CbUseIntervalFn,
  interval?: IntervalUseIntervalFn,
  options?: OptionsUseIntervalFn
): ReturnUseIntervalFnPipe
// eslint-disable-next-line no-redeclare
export function useIntervalFnPipe(
  interval?: IntervalUseIntervalFn,
  options?: OptionsUseIntervalFn
): ReturnUseIntervalFnPipe

// eslint-disable-next-line no-redeclare
export function useIntervalFnPipe(
  cb?: CbUseIntervalFn | IntervalUseIntervalFn,
  interval?: IntervalUseIntervalFn | OptionsUseIntervalFn,
  options?: OptionsUseIntervalFn
): ReturnUseIntervalFnPipe {
  if (typeof cb !== "function") {
    ;[interval, options] = [cb, interval as OptionsUseIntervalFn]
    options = undefined
  }

  const callbacks = new Set<CbUseIntervalFn>()
  if (typeof cb === "function") callbacks.add(cb)
  const result = {
    ...useIntervalFn(
      () => {
        callbacks.forEach((cb) => cb())
      },
      <IntervalUseIntervalFn>interval,
      options
    ),
    pipe
  }

  function pipe(cb: CbUseIntervalFn) {
    callbacks.add(cb)
    return result
  }

  return result
}
