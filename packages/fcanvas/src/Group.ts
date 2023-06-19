import type {
  ComputedRef,
  ShallowReactive,
  UnwrapNestedRefs
} from "@vue/reactivity"
import { computed, reactive, unref } from "@vue/reactivity"
import { watch } from "src/fns/watch"

import type { Layer } from "./Layer"
import type { Shape } from "./Shape"
import { APIGroup } from "./apis/APIGroup"
import { UIEvent } from "./apis/UIEvent"
import { effectScopeFlat } from "./apis/effectScopeFlat"
import { createContext2D, isDOM } from "./configs"
import { _setCurrentShape } from "./currentShape"
import type { DrawLayerAttrs } from "./helpers/drawLayer"
import { drawLayer } from "./helpers/drawLayer"
import {
  BOUNCE_CLIENT_RECT,
  BOUNDING_CLIENT_RECT,
  CANVAS_ELEMENT,
  CHILD_NODE,
  COMPUTED_CACHE,
  CONTEXT_CACHE,
  CONTEXT_CACHE_SIZE,
  DRAW_CONTEXT_ON_SANDBOX,
  SCOPE
} from "./symbols"
import type { CommonShapeAttrs } from "./type/CommonShapeAttrs"
import type { CommonShapeEvents } from "./type/CommonShapeEvents"
import type { Offset } from "./type/Offset"
import type { Rect } from "./type/Rect"
import type { Size } from "./type/Size"
import type { TorFnT } from "./type/TorFnT"
import type { ReactiveType } from "./type/fn/ReactiveType"
import { extendTarget } from "./utils/extendTarget"

export type CommonGroupAttrs = Partial<Offset> &
  DrawLayerAttrs & {
    width?: number
    height?: number
    visible?: boolean
    offscreen?: boolean
    sync?: boolean
    // zIndex?: number
  }

export class Group<
  // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-explicit-any
  ChildNode extends Shape | Group = Shape | Group<any, any>,
  PersonalAttrs extends CommonGroupAttrs = CommonGroupAttrs
> extends APIGroup<
  ChildNode,
  CommonShapeEvents & {
    resize: Event
  }
> {
  static readonly type: string = "Group"

  // How many fathers does this shape have?
  public _parents = 0

  public readonly $: UnwrapNestedRefs<PersonalAttrs> &
    // eslint-disable-next-line no-use-before-define
    ThisType<Group<ChildNode, PersonalAttrs>>

  public get attrs() {
    return this.$
  }

  public readonly [BOUNCE_CLIENT_RECT]: ComputedRef<Rect>
  public readonly [BOUNDING_CLIENT_RECT]: ComputedRef<Rect>
  public readonly [CANVAS_ELEMENT]: HTMLCanvasElement | OffscreenCanvas

  private readonly [CONTEXT_CACHE]: ReturnType<typeof createContext2D>

  private readonly [COMPUTED_CACHE]: ComputedRef<boolean>
  private readonly [CONTEXT_CACHE_SIZE]: ComputedRef<Size>

  private readonly [SCOPE] = effectScopeFlat()

  constructor(
    attrs: TorFnT<
      ReactiveType<PersonalAttrs>,
      Group<ChildNode, PersonalAttrs>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    > = {} as unknown as any
  ) {
    super()
    this[SCOPE].fOn()

    if (typeof attrs === "function") {
      // =========== current shape ===========
      _setCurrentShape(this)
      // =====================================
      this.$ = reactive(attrs(this) as CommonShapeAttrs<PersonalAttrs>)
      // =========== current shape ===========
      _setCurrentShape(null)
      // =====================================
    } else {
      this.$ = reactive(attrs as CommonShapeAttrs<PersonalAttrs>)
    }

    this[CONTEXT_CACHE] = createContext2D(
      (!isDOM || unref(this.$.offscreen) !== false) as boolean
    )
    this[CANVAS_ELEMENT] = this[CONTEXT_CACHE].canvas

    this[BOUNCE_CLIENT_RECT] = computed<Rect>(() => this.getClientRect())
    this[BOUNDING_CLIENT_RECT] = computed<Rect>(() => {
      const { x = 0, y = 0 } = this.$
      const { width, height } = this[BOUNCE_CLIENT_RECT].value

      return {
        x,
        y,
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

    watch(
      this[CONTEXT_CACHE_SIZE],
      ({ width, height }) => {
        // reactive
        const ctx = this[CONTEXT_CACHE]
        if (ctx.canvas.width === width && ctx.canvas.height === height) return
        ;[ctx.canvas.width, ctx.canvas.height] = [width, height]

        this.emit("resize", extendTarget(new UIEvent("resize"), ctx.canvas))
        if (__DEV_LIB__) {
          console.log(
            "[cache::group]: size changed %sx%s",
            ctx.canvas.width,
            ctx.canvas.height
          )
        }
      },
      {
        immediate: true,
        flush: this.$.sync ? "sync" : undefined
      }
    )

    this[SCOPE].fOff()
  }

  private [DRAW_CONTEXT_ON_SANDBOX](
    context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
  ) {
    if (__DEV_LIB__) console.log("[sandbox::group]: draw context on sandbox")

    const clientRect = this[BOUNCE_CLIENT_RECT].value
    const useTranslate = clientRect.x !== 0 || clientRect.y !== 0

    if (useTranslate) context.translate(-clientRect.x, -clientRect.y)

    drawLayer(context, this.$, this[CHILD_NODE], this)

    if (useTranslate) context.translate(clientRect.x, clientRect.y)
  }

  public draw(
    context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
  ) {
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

  public addTo(parent: Layer | Group) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parent.add(this as unknown as any)
    return this
  }

  public destroy() {
    super.destroy()
    this[SCOPE].stop()
  }
}
