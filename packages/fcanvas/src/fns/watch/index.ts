/* eslint-disable indent */
/* eslint-disable array-callback-return */
/* eslint-disable functional/no-let */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-redeclare */
import type {
  ComputedRef,
  DebuggerOptions,
  EffectScheduler,
  Ref
} from "@vue/reactivity"
import { isReactive, isRef, isShallow, ReactiveEffect } from "@vue/reactivity"
import {
  EMPTY_OBJ,
  extend,
  hasChanged,
  isArray,
  isFunction,
  isMap,
  isObject,
  isPlainObject,
  isSet,
  NOOP
} from "@vue/shared"

import {
  callWithAsyncErrorHandling,
  callWithErrorHandling,
  warn
} from "./errorHandling"
import type { SchedulerJob } from "./scheduler"
import { queueJob } from "./scheduler"

type OnCleanup = (cleanupFn: () => void) => void

export type WatchEffect = (onCleanup: OnCleanup) => void

export type WatchSource<T = any> = Ref<T> | ComputedRef<T> | (() => T)

export type WatchCallback<V = any, OV = any> = (
  value: V,
  oldValue: OV,
  onCleanup: OnCleanup
) => any

type MapSources<T, Immediate> = {
  [K in keyof T]: T[K] extends WatchSource<infer V>
    ? Immediate extends true
      ? V | undefined
      : V
    : T[K] extends object
    ? Immediate extends true
      ? T[K] | undefined
      : T[K]
    : never
}

export interface WatchOptionsBase extends DebuggerOptions {
  flush?: "pre" | "post" | "sync"
}

export interface WatchOptions<Immediate = boolean> extends WatchOptionsBase {
  immediate?: Immediate
  deep?: boolean
}

export type WatchStopHandle = () => void

// Simple effect.
export function watchEffect(
  effect: WatchEffect,
  options?: WatchOptionsBase
): WatchStopHandle {
  return doWatch(effect, null, options)
}

export function watchPostEffect(
  effect: WatchEffect,
  options?: DebuggerOptions
) {
  return doWatch(
    effect,
    null,
    __DEV__ ? extend({}, options as any, { flush: "post" }) : { flush: "post" }
  )
}

export function watchSyncEffect(
  effect: WatchEffect,
  options?: DebuggerOptions
) {
  return doWatch(
    effect,
    null,
    __DEV__ ? extend({}, options as any, { flush: "sync" }) : { flush: "sync" }
  )
}

// initial value for watchers to trigger on undefined initial values
const INITIAL_WATCHER_VALUE = {}

type MultiWatchSources = (WatchSource<unknown> | object)[]

// overload: array of multiple sources + cb
export function watch<
  T extends MultiWatchSources,
  Immediate extends Readonly<boolean> = false
>(
  sources: [...T],
  cb: WatchCallback<MapSources<T, false>, MapSources<T, Immediate>>,
  options?: WatchOptions<Immediate>
): WatchStopHandle

// overload: multiple sources w/ `as const`
// watch([foo, bar] as const, () => {})
// somehow [...T] breaks when the type is readonly
export function watch<
  T extends Readonly<MultiWatchSources>,
  Immediate extends Readonly<boolean> = false
>(
  source: T,
  cb: WatchCallback<MapSources<T, false>, MapSources<T, Immediate>>,
  options?: WatchOptions<Immediate>
): WatchStopHandle

// overload: single source + cb
export function watch<T, Immediate extends Readonly<boolean> = false>(
  source: WatchSource<T>,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: WatchOptions<Immediate>
): WatchStopHandle

// overload: watching reactive object w/ cb
export function watch<
  T extends object,
  Immediate extends Readonly<boolean> = false
>(
  source: T,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: WatchOptions<Immediate>
): WatchStopHandle

// implementation
export function watch<T = any, Immediate extends Readonly<boolean> = false>(
  source: T | WatchSource<T>,
  cb: any,
  options?: WatchOptions<Immediate>
): WatchStopHandle {
  if (__DEV__ && !isFunction(cb)) {
    warn(
      "`watch(fn, options?)` signature has been moved to a separate API. " +
        "Use `watchEffect(fn, options?)` instead. `watch` now only " +
        "supports `watch(source, cb, options?) signature."
    )
  }
  return doWatch(source as any, cb, options)
}

function doWatch(
  source: WatchSource | WatchSource[] | WatchEffect | object,
  cb: WatchCallback | null,
  { immediate, deep, flush, onTrack, onTrigger }: WatchOptions = EMPTY_OBJ
): WatchStopHandle {
  if (__DEV__ && !cb) {
    if (immediate !== undefined) {
      warn(
        'watch() "immediate" option is only respected when using the ' +
          "watch(source, callback, options?) signature."
      )
    }
    if (deep !== undefined) {
      warn(
        'watch() "deep" option is only respected when using the ' +
          "watch(source, callback, options?) signature."
      )
    }
  }

  const warnInvalidSource = (s: unknown) => {
    warn(
      "Invalid watch source: " +
        s +
        "A watch source can only be a getter/effect function, a ref, " +
        "a reactive object, or an array of these types."
    )
  }

  // const instance = currentInstance
  let getter: () => any
  let forceTrigger = false
  let isMultiSource = false

  if (isRef(source)) {
    getter = () => source.value
    forceTrigger = isShallow(source)
  } else if (isReactive(source)) {
    getter = () => source
    deep = true
  } else if (isArray(source)) {
    isMultiSource = true
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s))
    getter = () =>
      source.map((s) => {
        if (isRef(s)) return s.value
        else if (isReactive(s)) return traverse(s)
        else if (isFunction(s)) return callWithErrorHandling(s, "watch_getter")
        else __DEV__ && warnInvalidSource(s)
      })
  } else if (isFunction(source)) {
    if (cb) {
      // getter with cb
      getter = () => callWithErrorHandling(source, "watch_getter")
    } else {
      // no cb -> simple effect
      getter = () => {
        if (cleanup) cleanup()

        return callWithAsyncErrorHandling(source, "watch_callback", [onCleanup])
      }
    }
  } else {
    getter = NOOP
    __DEV__ && warnInvalidSource(source)
  }

  if (cb && deep) {
    const baseGetter = getter
    getter = () => traverse(baseGetter())
  }

  let cleanup: () => void
  const onCleanup: OnCleanup = (fn: () => void) => {
    cleanup = effect.onStop = () => {
      callWithErrorHandling(fn, "watch_cleanup")
    }
  }

  let oldValue: any = isMultiSource
    ? new Array((source as []).length).fill(INITIAL_WATCHER_VALUE)
    : INITIAL_WATCHER_VALUE
  const job: SchedulerJob = () => {
    if (!effect.active) return

    if (cb) {
      // watch(source, cb)
      const newValue = effect.run()
      if (
        deep ||
        forceTrigger ||
        (isMultiSource
          ? (newValue as any[]).some((v, i) =>
              hasChanged(v, (oldValue as any[])[i])
            )
          : hasChanged(newValue, oldValue))
      ) {
        // cleanup before running cb again
        if (cleanup) cleanup()

        callWithAsyncErrorHandling(cb, "watch_callback", [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE
            ? undefined
            : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE
            ? []
            : oldValue,
          onCleanup
        ])
        oldValue = newValue
      }
    } else {
      // watchEffect
      effect.run()
    }
  }

  // important: mark the job as a watcher callback so that scheduler knows
  // it is allowed to self-trigger (#1727)
  job.allowRecurse = !!cb

  let scheduler: EffectScheduler
  if (flush === "sync") {
    scheduler = job as any // the scheduler function gets called directly
  } else {
    // default: 'pre'
    job.pre = true
    scheduler = () => queueJob(job)
  }

  const effect = new ReactiveEffect(getter, scheduler)

  if (__DEV__) {
    effect.onTrack = onTrack
    effect.onTrigger = onTrigger
  }

  // initial run
  if (cb) {
    if (immediate) job()
    else oldValue = effect.run()
  } else {
    effect.run()
  }

  const unwatch = () => {
    effect.stop()
  }

  return unwatch
}

export function createPathGetter(ctx: any, path: string) {
  const segments = path.split(".")
  return () => {
    let cur = ctx
    for (let i = 0; i < segments.length && cur; i++) cur = cur[segments[i]]

    return cur
  }
}

export function traverse(value: unknown, seen?: Set<unknown>) {
  // eslint-disable-next-line dot-notation
  if (!isObject(value) || (value as any)["__v_skip"]) return value

  seen = seen || new Set()
  if (seen.has(value)) return value

  seen.add(value)
  if (isRef(value)) {
    traverse(value.value, seen)
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) traverse(value[i], seen)
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v: any) => {
      traverse(v, seen)
    })
  } else if (isPlainObject(value)) {
    for (const key in value) traverse((value as any)[key], seen)
  }
  return value
}
