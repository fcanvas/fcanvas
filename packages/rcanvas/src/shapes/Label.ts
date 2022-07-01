import { Group } from "../Group"

import type { Tag } from "./Tag"
import type { Text } from "./Text"

export class Label extends Group<Tag | Text> {
  private getText() {
    return this.find<Text>("text")[0]
  }

  private getTag() {
    return this.find<Tag>("tag")[0]
  }

  // eslint-disable-next-line functional/functional-parameters
  public add(...nodes: (Tag | Text)[]): void {
    nodes.forEach((node) => {
      this.children.add(node)
      node._onAddToParent(this)
    })
    this.currentNeedReload = true
    this.sync()
  }

  // eslint-disable-next-line functional/functional-parameters
  public delete(...nodes: readonly (Tag | Text)[]): void {
    nodes.forEach((node) => {
      this.children.delete(node)
      node._onDeleteParent(this)
    })
    this.currentNeedReload = true
    this.sync()
  }

  private sync() {
    const text = this.getText()
    const tag = this.getTag()
    // eslint-disable-next-line functional/no-let
    let width, height, pointerDirection, pointerWidth, x, y, pointerHeight

    if (text && tag) {
      ;({ width, height } = text.getSelfRect())
      ;({ pointerDirection, pointerWidth = 20, pointerHeight = 20 } = tag.attrs)
      x = 0
      y = 0

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
