import type { Ref, UnwrapRef } from "@vue/reactivity"
import { isReactive, isRef, shallowRef } from "@vue/reactivity"
import type { WatchStopHandle } from "@vue-reactivity/watch"
import { watch, watchEffect } from "@vue-reactivity/watch"

import type { Group } from "../Group"
import type { Shape } from "../Shape"
import { getCurrentShape } from "../currentShape"
import { isArc } from "../logic/isArc"
import { isBoxClientRect } from "../logic/isBoxClientRect"
import { isCircle } from "../logic/isCircle"
import { isCircleRaw } from "../logic/isCircleRaw"
import { isRectRaw } from "../logic/isRectRaw"
import { checkRect, haveIntersection } from "../methods/haveIntersection"
import type { Arc } from "../shapes/Arc"
import type { Circle } from "../shapes/Circle"
import { BOUNDING_CLIENT_RECT } from "../symbols"
import type { Offset } from "../type/Offset"
import type { Rect } from "../type/Rect"
import { Size } from "../type/Size"

function onCollide<
  T extends Shape | Group | Offset | Rect | Ref<Offset | Rect>
>(
  targets: T | Array<T> | Ref<UnwrapRef<T> | Array<UnwrapRef<T>>>,
  cb: (target: UnwrapRef<T>) => void
): WatchStopHandle
// eslint-disable-next-line no-redeclare
function onCollide<
  T extends Shape | Group | Offset | Rect | Ref<Offset | Rect>
>(
  $this: Shape | Group,
  targets: T | Array<T> | Ref<UnwrapRef<T> | Array<UnwrapRef<T>>>,
  cb: (target: UnwrapRef<T>) => void
): WatchStopHandle

/**
 *
 * @param targets Shape or Group or Array<Shape | Group>
 * @param cb this function will be called every time `this` collides with one of the `targets`
 * @description collide test
 */
// eslint-disable-next-line no-redeclare
function onCollide<
  T extends Shape | Group | Offset | Rect | Ref<Offset | Rect>
>(
  $this:
    | Shape
    | Group
    | (T | Array<T> | Ref<UnwrapRef<T> | Array<UnwrapRef<T>>>),
  targets:
    | T
    | Array<T>
    | Ref<UnwrapRef<T> | Array<UnwrapRef<T>>>
    | ((target: UnwrapRef<T>) => void),
  cb?: (target: UnwrapRef<T>) => void
): WatchStopHandle {
  if (cb === undefined) {
    ;[$this, targets, cb] = [
      getCurrentShape(),
      $this as T | Array<T> | Ref<UnwrapRef<T> | Array<UnwrapRef<T>>>,
      targets as (target: UnwrapRef<T>) => void
    ]
  }

  const checker = $this as Shape | Group

  const watchers = new Map<UnwrapRef<T>, WatchStopHandle>()

  if (!isReactive(targets) && !isRef(targets))
    targets = shallowRef(targets) as Ref<UnwrapRef<T>>

  const storeCheckCallOnce = new WeakMap<UnwrapRef<T>, boolean>()
  const setCalled = (target: UnwrapRef<T>) =>
    storeCheckCallOnce.set(target, true)
  const setReseed = (target: UnwrapRef<T>) => storeCheckCallOnce.delete(target)
  const hasCalled = (target: UnwrapRef<T>) => storeCheckCallOnce.has(target)

  const watcherTargets = watch(
    targets as UnwrapRef<T>[] | UnwrapRef<T>,
    (targets) => {
      if (!Array.isArray(targets)) targets = [targets]

      const exists = new WeakSet<UnwrapRef<T>>()
      watchers.forEach((watcher, key) => {
        if (!(targets as UnwrapRef<T>[]).includes(key as UnwrapRef<T>)) {
          watcher()
          watchers.delete(key)
        } else {
          exists.add(key)
        }
      })
      targets.forEach((target) => {
        if (exists.has(target)) return

        // eslint-disable-next-line functional/no-let
        let effect: () => void
        if (isBoxClientRect(target)) {
          effect = () => {
            if (haveIntersection(checker, target)) {
              if (!hasCalled(target)) {
 cb!(target)
 setCalled(target)
              }
            } else { setReseed(target) }
          }
        } else if (isRectRaw(target)) {
          effect = () => {
            if (checkRect(checker[BOUNDING_CLIENT_RECT].value, target)) {
              if (!hasCalled(target)) {
 cb!(target)
 setCalled(target)
              }
            } else { setReseed(target) }
          }
        } else if (
          (isArc(checker) || isCircle(checker)) &&
          isCircleRaw(target)
        ) {
          effect = () => {
            const rd1 =
              (checker as Arc).$.outerRadius ?? (checker as Circle).$.radius
            const { x: x1, y: y1 } = checker.$
            const { radius: rd2, x: x2, y: y2 } = target

            if ((rd1 + rd2) ** 2 >= (x1 - y1) ** 2 + (x2 - y2) ** 2) {
              if (!hasCalled(target)) {
 cb!(target)
 setCalled(target)
              }
            } else { setReseed(target) }
          }
        } else {
          effect = () => {
            if (checker.isPressedPoint(target.x, target.y)) {
              if (!hasCalled(target)) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                cb!(target)
                setCalled(target)
              }
            } else { setReseed(target) }
          }
        }

        const watcher = watchEffect(effect, {
          flush: "post"
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(target as unknown as any).on?.("destroy", () => {
          watcher()
          watchers.delete(target)
        })

        watchers.set(target, watcher)
      })
    },
    { immediate: true }
  )

  const stop = () => {
    watcherTargets()
    watchers.forEach((watcher) => watcher())
    watchers.clear()
  }

  ;($this as Shape).on("destroy", stop)

  return stop
}

export { onCollide }
export { onCollide as onIntersection }
