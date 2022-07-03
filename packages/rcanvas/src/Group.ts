import type { ComputedRef } from "@vue/reactivity"
import { computed, EffectScope, reactive } from "@vue/reactivity"
import { watchPostEffect } from "vue"

import type { Container } from "./Container"
import type { ReactiveType } from "./ReactiveType"
import type { Shape } from "./Shape"
import { APIGroup } from "./apis/APIGroup"
import type { DrawLayerAttrs } from "./helpers/drawLayer"
import { drawLayer } from "./helpers/drawLayer"
import {
  BOUNCE_CLIENT_RECT,
  CHILD_NODE,
  COMPUTED_CACHE,
  CONTEXT_CACHE,
  CONTEXT_CACHE_SIZE,
  DRAW_CONTEXT_ON_SANDBOX,
  SCOPE
} from "./symbols"
import type { Offset } from "./type/Offset"
import type { Rect } from "./type/Rect"
import { extendTarget } from "./utils/extendTarget"

type PersonalAttrs = Offset &
  DrawLayerAttrs & {
    width?: number
    height?: number
    visible?: boolean
  }

export function createContextCacheSize(group: {
  attrs: Partial<Pick<Rect, "width" | "height">>
  [BOUNCE_CLIENT_RECT]: ComputedRef<Rect>
}) {
  return computed(() => {
    const useConfig =
      group.attrs.width !== undefined && group.attrs.height !== undefined

    if (useConfig) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        width: group.attrs.width!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        height: group.attrs.height!
      }
    }

    const { width, height } = group[BOUNCE_CLIENT_RECT].value

    return {
      width,
      height
    }
  })
}

export class Group<ChildNode extends Shape = Shape>
  extends APIGroup<ChildNode, {
  resize: Event
}>
  // prettier-ignore
  implements Container {
  static readonly type: string = "Group"

  public readonly attrs: ReturnType<typeof reactive<PersonalAttrs>>

  public readonly [BOUNCE_CLIENT_RECT]: ComputedRef<Rect>

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private readonly [CONTEXT_CACHE] = document
    .createElement("canvas")
    .getContext("2d")!

  private readonly [COMPUTED_CACHE]: ComputedRef<boolean>
  private readonly [CONTEXT_CACHE_SIZE]: ComputedRef<
    Pick<Rect, "width" | "height">
  >

  private readonly [SCOPE] = new EffectScope(true) as unknown as {
    active: boolean
    on: () => void
    off: () => void
    stop: () => void
  }

  constructor(attrs: ReactiveType< PersonalAttrs >) {
    super()
    this[SCOPE].on()

    this.attrs = reactive(attrs)

    this[COMPUTED_CACHE] = computed<boolean>(() => {
      // ...
      const ctx = this[CONTEXT_CACHE]

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      this[DRAW_CONTEXT_ON_SANDBOX](ctx)

      return false
    })

    this[BOUNCE_CLIENT_RECT] = computed<Rect>(() => this.getClientRect())
    this[CONTEXT_CACHE_SIZE] = createContextCacheSize(this)

    // try watchEffect
    watchPostEffect(() => {
      // reactive
      const ctx = this[CONTEXT_CACHE]
      const { width, height } = this[CONTEXT_CACHE_SIZE].value
      ;[ctx.canvas.width, ctx.canvas.height] = [width, height]

      this.emit("resize", extendTarget(new UIEvent("resize"), ctx.canvas))
      console.log(
        "[cache::group]: size changed %sx%s",
        ctx.canvas.width,
        ctx.canvas.height
      )
    })

    this[SCOPE].off()
  }

  private [DRAW_CONTEXT_ON_SANDBOX](context: CanvasRenderingContext2D) {
    console.log("[sandbox::group]: draw context on sandbox")

    const clientRect = this[BOUNCE_CLIENT_RECT].value
    const useTranslate = clientRect.x !== 0 || clientRect.y !== 0

    if (useTranslate) context.translate(-clientRect.x, -clientRect.y)

    drawLayer(context, this.attrs, this[CHILD_NODE], this)

    if (useTranslate) context.translate(clientRect.x, clientRect.y)
  }

  public draw(context: CanvasRenderingContext2D) {
    if (this.attrs.visible === false) return

    const { x, y } = this[BOUNCE_CLIENT_RECT].value
    // eslint-disable-next-line no-unused-expressions
    this[COMPUTED_CACHE].value // get by draw cache

    context.drawImage(
      this[CONTEXT_CACHE].canvas,
      this.attrs.x + x,
      this.attrs.y + y
    )
  }

  public isPressedPoint(x: number, y: number): boolean {
    for (const node of this[CHILD_NODE].values())
      if (node.isPressedPoint(x, y)) return true

    return false
  }

  public destroy() {
    this[SCOPE].stop()
  }
}
