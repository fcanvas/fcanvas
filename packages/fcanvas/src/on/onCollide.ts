import type { WatchStopHandle } from "@vue-reactivity/watch"
import { watch, watchEffect } from "@vue-reactivity/watch"
import type { Ref, UnwrapRef } from "@vue/reactivity"
import { isReactive, isRef, shallowRef } from "@vue/reactivity"

import type { Group } from "../Group"
import type { Shape } from "../Shape"
import { getCurrentShape } from "../currentShape"
import { isBoxClientRect } from "../logic/isBoxClientRect"
import { haveIntersection } from "../methods/haveIntersection"
import type { Offset } from "../type/Offset"

function onCollide<T extends Shape | Group | Offset | Ref<Offset>>(
  targets: T | Array<T> | Ref<UnwrapRef<T> | Array<UnwrapRef<T>>>,
  cb: (target: UnwrapRef<T>) => void
): WatchStopHandle
// eslint-disable-next-line no-redeclare
function onCollide<T extends Shape | Group | Offset | Ref<Offset>>(
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
function onCollide<T extends Shape | Group | Offset | Ref<Offset>>(
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

  const watchers = new Map<UnwrapRef<T>, WatchStopHandle>()

  if (!isReactive(targets) && !isRef(targets))
    targets = shallowRef(targets) as Ref<UnwrapRef<T>>

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
        let watcher: WatchStopHandle
        if (isBoxClientRect(target)) {
          watcher = watchEffect(
            () => {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              if (haveIntersection($this as Shape, target)) cb!(target)
            },
            {
              flush: "post"
            }
          )
        } else {
          watcher = watchEffect(
            () => {
              if (($this as Shape).isPressedPoint(target.x, target.y))
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                cb!(target)
            },
            {
              flush: "post"
            }
          )
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(target as unknown as any)?.on("destroy", () => {
          watcher()
          watchers.delete(target)
        })

        watchers.set(target, watcher)
      })
    }
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
