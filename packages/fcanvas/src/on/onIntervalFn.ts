import { watch } from "@vue-reactivity/watch"
import type { Ref } from "@vue/reactivity"
import { isRef, ref } from "@vue/reactivity"
import { isFunction } from "@vue/shared"

import { tryOnScopeDispose } from "../logic/tryOnScopeDispose"

export function useIntervalFn(
  cb: () => void,
  interval: number | Ref<number> = 1000,
  options: {
    immediate?: boolean
    immediateCallback?: boolean
  } = {}
) {
  const { immediate = true, immediateCallback = false } = options

  // eslint-disable-next-line functional/no-let
  let timer: ReturnType<typeof setInterval> | null = null
  const isActive = ref(false)

  function clean() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function pause() {
    isActive.value = false
    clean()
  }

  function resume() {
    const intervalValue = isRef(interval) ? interval.value : interval

    if (intervalValue <= 0) return
    isActive.value = true
    if (immediateCallback) cb()
    clean()
    timer = setInterval(cb, intervalValue)
  }

  if (immediate) resume()

  if (isRef(interval) || isFunction(interval)) {
    const stopWatch = watch(interval, () => {
      if (isActive.value) resume()
    })
    tryOnScopeDispose(stopWatch)
  }

  tryOnScopeDispose(pause)

  return {
    isActive,
    pause,
    resume
  }
}
