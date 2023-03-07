import type { ComputedRef } from "@vue/reactivity"
import { computed } from "@vue/reactivity"
import { watchEffect } from "src/fns/watch"

import type { CommonGroupAttrs } from "../Group"
import { Group } from "../Group"
import { BOUNCE_CLIENT_RECT, CHILD_NODE, SCOPE } from "../symbols"
import type { CommonShapeAttrs } from "../type/CommonShapeAttrs"
import type { TorFnT } from "../type/TorFnT"
import type { ReactiveType } from "../type/fn/ReactiveType"

import { Tag } from "./Tag"
import { Text } from "./Text"

export class Label extends Group<Tag | Text> {
  private readonly text: ComputedRef<Text | void>

  private readonly tag: ComputedRef<Tag | void>

  constructor(
    attrs: TorFnT<ReactiveType<CommonShapeAttrs<CommonGroupAttrs>>, Label>
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super(attrs as unknown as any)

    this[SCOPE].fOn()

    this.text = computed<Text | void>(() => {
      for (const node of this[CHILD_NODE]) if (node instanceof Text) return node
    })
    this.tag = computed<Tag | void>(() => {
      for (const node of this[CHILD_NODE]) if (node instanceof Tag) return node
    })
    watchEffect(this.sync.bind(this))

    this[SCOPE].fOff()
  }

  private sync() {
    const text = this.text.value
    const tag = this.tag.value

    if (text && tag) {
      const { width, height } = text[BOUNCE_CLIENT_RECT].value
      const { pointerDirection, pointerWidth = 20, pointerHeight = 20 } = tag.$

      // eslint-disable-next-line functional/no-let
      let x = 0
      // eslint-disable-next-line functional/no-let
      let y = 0

      switch (pointerDirection) {
        case "up":
          x = width / 2
          y = -1 * pointerHeight
          break
        case "right":
          x = width + pointerWidth
          y = height / 2
          break
        case "down":
          x = width / 2
          y = height + pointerHeight
          break
        case "left":
          x = -1 * pointerWidth
          y = height / 2
          break
      }

      tag.$.x = -x
      tag.$.y = -y
      tag.$.width = width
      tag.$.height = height

      text.$.x = -x
      text.$.y = -y
    }
  }
}
