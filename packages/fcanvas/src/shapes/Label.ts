import { computed } from "@vue/reactivity"

import { Group } from "../Group"
import { BOUNCE_CLIENT_RECT, CHILD_NODE } from "../symbols"

import { Tag } from "./Tag"
import { Text } from "./Text"

export class Label extends Group<Tag | Text> {
  private readonly text = computed<Text | void>(() => {
    for (const node of this[CHILD_NODE]) if (node instanceof Text) return node
  })

  private readonly tag = computed<Tag | void>(() => {
    for (const node of this[CHILD_NODE]) if (node instanceof Tag) return node
  })

  public add(node: Tag | Text) {
    const result = this[CHILD_NODE].add(node)
    this.sync()

    return result
  }

  public delete(node: Tag | Text) {
    const result = this[CHILD_NODE].delete(node)
    this.sync()

    return result
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
