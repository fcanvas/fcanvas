import type {
  ComputedRef,
  ShallowReactive,
  UnwrapNestedRefs
} from "@vue/reactivity"
import { computed, EffectScope, reactive } from "@vue/reactivity"
import { watchEffect } from "@vue-reactivity/watch"

import type { Shape } from "./Shape"
import { APIGroup } from "./apis/APIGroup"
import { isDev } from "./env"
import type { DrawLayerAttrs } from "./helpers/drawLayer"
import { drawLayer } from "./helpers/drawLayer"
import {
  BOUNCE_CLIENT_RECT,
  BOUNDING_CLIENT_RECT,
  CHILD_NODE,
  COMPUTED_CACHE,
  CONTEXT_CACHE,
  CONTEXT_CACHE_SIZE,
  DRAW_CONTEXT_ON_SANDBOX,
  SCOPE
} from "./symbols"
import type { CommonShapeAttrs } from "./type/CommonShapeAttrs"
import type { Offset } from "./type/Offset"
import type { Rect } from "./type/Rect"
import type { Size } from "./type/Size"
import type { ReactiveType } from "./type/fn/ReactiveType"
import { extendTarget } from "./utils/extendTarget"

export type PersonalAttrs = Partial<Offset> &
  DrawLayerAttrs & {
    width?: number
    height?: number
    visible?: boolean
  }

export class Group<ChildNode extends Shape = Shape> extends APIGroup<
  ChildNode,
  {
    resize: Event
  }
> {
  static readonly type: string = "Group"

  // How many fathers does this shape have?
  public _parents = 0

  public readonly $: UnwrapNestedRefs<PersonalAttrs>
  public get attrs() {
    return this.$
  }

  public readonly [BOUNCE_CLIENT_RECT]: ComputedRef<Rect>
  public readonly [BOUNDING_CLIENT_RECT]: ComputedRef<Rect>

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private readonly [CONTEXT_CACHE] = document
    .createElement("canvas")
    .getContext("2d")!

  private readonly [COMPUTED_CACHE]: ComputedRef<boolean>
  private readonly [CONTEXT_CACHE_SIZE]: ComputedRef<Size>

  private readonly [SCOPE] = new EffectScope(true) as unknown as {
    active: boolean
    on: () => void
    off: () => void
    stop: () => void
  }

  constructor(
    attrs: ReactiveType<PersonalAttrs> & {
      setup?: (attrs: UnwrapNestedRefs<CommonShapeAttrs<PersonalAttrs>>) => void
    } & ThisType<Group> = {}
  ) {
    super()
    this[SCOPE].on()

    this.$ = reactive(attrs)

    this[BOUNCE_CLIENT_RECT] = computed<Rect>(() => this.getClientRect())
    this[BOUNDING_CLIENT_RECT] = computed<Rect>(() => {
      const { x = 0, y = 0 } = this.$
      const { x: offX, y: offY, width, height } = this[BOUNCE_CLIENT_RECT].value

      return {
        x: x + offX,
        y: y + offY,
        width,
        height
      }
    })
    this[COMPUTED_CACHE] = computed<boolean>(() => {
      // ...
      const ctx = this[CONTEXT_CACHE]

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      this[DRAW_CONTEXT_ON_SANDBOX](ctx)

      return false
    })

    this[CONTEXT_CACHE_SIZE] = computed(() => {
      const useConfig =
        this.$.width !== undefined && this.$.height !== undefined

      if (useConfig) {
        return {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          width: this.$.width!,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          height: this.$.height!
        }
      }

      const { width, height } = this[BOUNCE_CLIENT_RECT].value

      return {
        width,
        height
      }
    })

    // try watchEffect
    watchEffect(
      () => {
        // reactive
        const ctx = this[CONTEXT_CACHE]
        const { width, height } = this[CONTEXT_CACHE_SIZE].value
        ;[ctx.canvas.width, ctx.canvas.height] = [width, height]

        this.emit("resize", extendTarget(new UIEvent("resize"), ctx.canvas))
        if (isDev) {
          console.log(
            "[cache::group]: size changed %sx%s",
            ctx.canvas.width,
            ctx.canvas.height
          )
        }
      },
      {
        flush: "post"
      }
    )

    this[SCOPE].off()
  }

  private [DRAW_CONTEXT_ON_SANDBOX](context: CanvasRenderingContext2D) {
    if (isDev) console.log("[sandbox::group]: draw context on sandbox")

    const clientRect = this[BOUNCE_CLIENT_RECT].value
    const useTranslate = clientRect.x !== 0 || clientRect.y !== 0

    if (useTranslate) context.translate(-clientRect.x, -clientRect.y)

    drawLayer(context, this.$, this[CHILD_NODE], this)

    if (useTranslate) context.translate(clientRect.x, clientRect.y)
  }

  public draw(context: CanvasRenderingContext2D) {
    if (this.$.visible === false) return

    const { x, y } = this[BOUNCE_CLIENT_RECT].value
    // eslint-disable-next-line no-unused-expressions
    this[COMPUTED_CACHE].value // get by draw cache

    context.drawImage(
      this[CONTEXT_CACHE].canvas,
      (this.$.x ?? 0) + x,
      (this.$.y ?? 0) + y
    )
  }

  public getBoundingClientRect() {
    return this[BOUNDING_CLIENT_RECT].value
  }

  public isPressedPoint(x: number, y: number): boolean {
    for (const node of this[CHILD_NODE].values())
      if (node.isPressedPoint(x, y)) return true

    return false
  }

  public add(node: ChildNode) {
    // eslint-disable-next-line functional/no-let
    let results: ShallowReactive<Set<ChildNode>>
    if (this[CHILD_NODE].size < (results = super.add(node)).size) {
      // success
      node._parents++
    }

    return results
  }

  public delete(node: ChildNode) {
    if (super.delete(node)) {
      // success
      node._parents--
      if (node._parents <= 0) node.destroy()

      return true
    }

    return false
  }

  public destroy() {
    super.destroy()
    this[SCOPE].stop()
  }
}
