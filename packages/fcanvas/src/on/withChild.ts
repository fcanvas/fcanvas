import type { ShallowRef } from "@vue/reactivity"
import { computed, isRef, shallowReactive, shallowRef } from "@vue/reactivity"
import { watch } from "@vue-reactivity/watch"

import type { Group } from "../Group"
import type { Layer } from "../Layer"
import { toReactive } from "../fns/toReactive"
import type { Rect } from "../type/Rect"
import type { MayBeShallowRef } from "../type/fn/MayBeShallowRef"

/**
 * It takes a layer or group and returns a computed property that returns the bounding client rects of
 * all of its children
 *
 * This function will first add the function of handling children of `Group` to the function `onCollide`
 * @param group - MayBeShallowRef<Layer | Group>
 * @returns An array of objects with x, y, width, and height properties.
 */
export function withChild(group: MayBeShallowRef<Layer | Group>) {
  if (!isRef(group)) group = shallowRef(group)

  const results = shallowReactive(new Set<Rect>())
  watch(
    () => (group as ShallowRef<Layer | Group>).value.children,
    (children) => {
      results.clear()
      children.forEach((child) => {
        results.add(
          toReactive(
            computed(() => {
              const { x: gX, y: gY } = (
                group as ShallowRef<Layer | Group>
              ).value.getBoundingClientRect()
              const { x, y, width, height } = child.getBoundingClientRect()

              return {
                x: gX + x,
                y: gY + y,
                width,
                height
              }
            })
          )
        )
      })
    },
    { immediate: true, deep: true }
  )

  return results
}
