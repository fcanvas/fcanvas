import { Easing, getAll, Tween as TweenJS, update } from "@tweenjs/tween.js"
import clonedeep from "lodash.clonedeep"

import type { Group } from "./Group"
import type { Layer } from "./Layer"
import { createProxy } from "./helpers/createProxy"
import type { Label } from "./shapes/Label"
import type AllShape from "./types/AllShape"

function assign<T>(obj1: T, obj2: T) {
  for (const prop in obj2) {
    if (typeof obj2[prop] === "object" && obj2[prop] !== null) {
      assign(obj1[prop], obj2[prop])
      continue
    }
    // eslint-disable-next-line functional/immutable-data
    obj1[prop] = obj2[prop]
  }
}

function startTween() {
  if (getAll().length) {
    update()
    requestAnimationFrame(startTween)
  }
}
export class Tween<Node extends AllShape | Group | Label | Layer> {
  private tween!: TweenJS<Node["attrs"]>

  private attrsStart!: TweenJS<Node["attrs"]>
  constructor(
    private readonly attrs: {
      node: Node

      attrs: Node["attrs"]

      duration: number

      easing?: (k: number) => number

      onUpdate?: () => void

      onFinish?: () => void
    }
  ) {
    this.resetTween()

    this.attrs = createProxy(
      attrs,
      (prop, val) => {
        if (prop === "attrs" || prop === "node") this.resetTween()

        if (prop === "duration") {
          this.tween.duration(val)
          return
        }
        if (prop === "easing") this.tween.easing(val)
      },
      ["node", "onUpdate", "onFinish"]
    )
  }

  private resetTween() {
    this.attrsStart = clonedeep(this.attrs.node.attrs)

    this.tween = new TweenJS(this.attrsStart)
      .to(this.attrs.attrs)
      .duration(this.attrs.duration)
      .easing(this.attrs.easing ?? Easing.Linear.None)
      .onUpdate((attrs) => {
        this.attrs.onUpdate?.()
        assign(this.attrs.node.attrs, attrs)
      })
      .onComplete((attrs) => {
        this.attrs.onFinish?.()
        this.attrsStart = clonedeep(attrs)
      })
  }

  public destroy() {
    this.tween.stop()
  }

  public finish() {
    this.tween.end()
  }

  public pause() {
    this.tween.pause()
  }

  public play() {
    if (this.tween.isPaused()) {
      this.tween.start()
      startTween()
    } else {
      this.tween.resume()
    }
  }

  public reset() {
    this.resetTween()
  }

  public seek(time: number) {
    this.tween.update(time)
  }
}
