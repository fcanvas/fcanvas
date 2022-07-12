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

  // eslint-disable-next-line functional/functional-parameters
  public add(...nodes: (Tag | Text)[]): void {
    nodes.forEach((node) => this[CHILD_NODE].add(node))
    this.sync()
  }

  // eslint-disable-next-line functional/functional-parameters
  public delete(...nodes: readonly (Tag | Text)[]): void {
    nodes.forEach((node) => this[CHILD_NODE].delete(node))
    this.sync()
  }

  private sync() {
    const text = this.text.value
    const tag = this.tag.value

    if (text && tag) {
      const { width, height } = text[BOUNCE_CLIENT_RECT].value
      const {
        pointerDirection,
        pointerWidth = 20,
        pointerHeight = 20
      } = tag.attrs

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

      // eslint-disable-next-line functional/immutable-data
      tag.attrs.x = -x
      // eslint-disable-next-line functional/immutable-data
      tag.attrs.y = -y
      // eslint-disable-next-line functional/immutable-data
      tag.attrs.width = width
      // eslint-disable-next-line functional/immutable-data
      tag.attrs.height = height

      // eslint-disable-next-line functional/immutable-data
      text.attrs.x = -x
      // eslint-disable-next-line functional/immutable-data
      text.attrs.y = -y
    }
  }
}
