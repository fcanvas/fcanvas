export function useIntervalFnPipe(
  cb: CbUseIntervalFn,
  interval?: IntervalUseIntervalFn,
  options?: OptionsUseIntervalFn
)
export function useIntervalFnPipe(
  interval?: IntervalUseIntervalFn,
  options?: OptionsUseIntervalFn
)


export function useIntervalFnPipe(
  cb?: CbUseIntervalFn | IntervalUseIntervalFn,
  interval?: IntervalUseIntervalFn | OptionsUseIntervalFn,
  options?: OptionsUseIntervalFn
) {
  if (typeof cb !== "function") {
    [interval, options] = [cb, interval]
    options = undefined
  }
  
  const callbacks = new Set<CbUseIntervalFn>()
  const result = {
    
    ...useIntervalFn(() => {
    callbacks.forEach(cb => cb())
  }, interval, options),
  pipe
  }
  
  function pipe(cb: CbUseIntervalFn) {
    callbacks.add(cb)
    return result
  }
  
  return result
}