import type { WatchSource } from "@vue-reactivity/watch"
import { watch, watchEffect } from "@vue-reactivity/watch"
import type { Ref } from "@vue/reactivity"

import type { Shape } from "../Shape"
import { getCurrentShape } from "../currentShape"
import { haveIntersection } from "../methods/haveIntersection"
import type { BOUNCE_CLIENT_RECT } from "../symbols"

interface HasForEach<T> {
  has?: (val: T) => boolean
  includes?: (val: T) => boolean
  forEach: (cb: (el: T, index: number) => void) => void
}

type Checks<T> = HasForEach<T> | Ref<HasForEach<T>> | (() => T)

interface Cb<T> {
  (el: T, index: number): void
}

function onCollide<T extends Pick<Shape, typeof BOUNCE_CLIENT_RECT>>(
  checks: Checks<T>,
  cb: Cb<T>
): void
// eslint-disable-next-line no-redeclare
function onCollide<T extends Pick<Shape, typeof BOUNCE_CLIENT_RECT>>(
  target: Shape,
  checks: Checks<T>,
  cb: Cb<T>
): void

// eslint-disable-next-line no-redeclare
function onCollide<T extends Pick<Shape, typeof BOUNCE_CLIENT_RECT>>(
  target: Shape | Checks<T>,
  checks: Checks<T> | Cb<T>,
  cb?: Cb<T>
) {
  if (cb === undefined) {
    ;[target, checks, cb] = [
      getCurrentShape(),
      target as Checks<T>,
      checks as Cb<T>
    ]
  }

  const effectMap: Map<T, ReturnType<typeof watchEffect>> = new Map()
  const watcher = watch(checks as WatchSource<HasForEach<T>>, (value) => {
    // change
    // cancel effect removed
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const has = (value.has || value.includes)!.bind(value)
    effectMap.forEach((effect, el) => {
      if (!has(el)) {
        effect()
        effectMap.delete(el)
      }
    })
    // watchEffect
    ;(value as HasForEach<T>).forEach((el, index) => {
      if (effectMap.has(el)) return

      const effect = watchEffect(
        () => {
          if (haveIntersection(target as Shape, el)) {
            // ok
            ;(cb as Cb<T>)(el, index)
          }
        },
        {
          flush: "post"
        }
      )

      effectMap.set(el, effect)
    })
  })

  return () => {
    effectMap.forEach((effect) => effect())
    effectMap.clear()
    watcher()
  }
}

export { onCollide }
