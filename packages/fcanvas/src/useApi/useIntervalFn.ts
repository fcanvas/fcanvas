/**
 * Code from: https://raw.githubusercontent.com/vueuse/vueuse/main/packages/shared/useIntervalFn
 */

import type { Ref } from "@vue/reactivity"
import { isRef, ref } from "@vue/reactivity"
import { isFunction } from "@vue/shared"
import { watch } from "@vue-reactivity/watch"

import { tryOnScopeDispose } from "../logic/tryOnScopeDispose"

export type CbUseIntervalFn = () => void
export type IntervalUseIntervalFn = number | Ref<number>
export interface OptionsUseIntervalFn {
  immediate?: boolean
  immediateCallback?: boolean
}
export interface Pausable {
  isActive: Ref<boolean>
  pause: () => void
  resume: () => void
}
export function useIntervalFn(
  cb: CbUseIntervalFn,
  interval: IntervalUseIntervalFn = 1000,
  options: OptionsUseIntervalFn = {}
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
