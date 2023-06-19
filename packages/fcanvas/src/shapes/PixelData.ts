import type { ComputedRef, Ref } from "@vue/reactivity"
import { computed, ref } from "@vue/reactivity"
import { createContext2D } from "src/configs"

import type { Group } from "../Group"
import type { Layer } from "../Layer"
import { Shape } from "../Shape"
import { drawLayer } from "../helpers/drawLayer"
import { CANVAS_ELEMENT, CHILD_NODE, CONTEXT_CACHE } from "../symbols"
import type { CommonShapeAttrs } from "../type/CommonShapeAttrs"
import type { TorFnT } from "../type/TorFnT"
import type { ReactiveType } from "../type/fn/ReactiveType"

// loadPixels, set, updatePixels
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type PersonalAttrs = {
  src: Layer | Shape | Group
  sx?: number
  sy?: number
  sw?: number
  sh?: number
  width?: number
  height?: number
}
const resolved = Promise.resolve()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isLayerOrGroup = (o: any): o is Layer | Group => CHILD_NODE in o

export class PixelData extends Shape<PersonalAttrs> {
  static readonly type = "PixelData"

  private readonly _imageData: ComputedRef<ImageData>
  private readonly _canvas: ComputedRef<HTMLCanvasElement | OffscreenCanvas>
  private readonly _size: ComputedRef<number>
  private readonly _deps: Ref<number>
  private readonly _markAsync: () => void

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    // eslint-disable-next-line no-unused-expressions
    this._deps.value
    if (!this._imageData.value) return

    context.putImageData(this._imageData.value, 0, 0)
  }

  constructor(
    attrs: TorFnT<ReactiveType<CommonShapeAttrs<PersonalAttrs>>, PixelData>
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super(attrs as unknown as any)

    const _canvas = computed(() => {
      return (this.$.src as Layer)[CANVAS_ELEMENT] ?? (this.$.src as Shape)[CONTEXT_CACHE].canvas
    })
    this._canvas = _canvas

    this._imageData = computed(() => {
      const ctx = createContext2D()
      ;[ctx.canvas.width, ctx.canvas.height] = [
        _canvas.value.width,
        _canvas.value.height
      ]

      const source = this.$.src
      if (isLayerOrGroup(source)) {
        const child = new Set(source[CHILD_NODE])
        child.delete(this)
        drawLayer(ctx, this.$.src.$, child, this.$.src)
      } else {
        source.draw(ctx)
      }
      return ctx.getImageData(
        this.$.sx ?? 0,
        this.$.sy ?? 0,
        this.$.sw ?? ctx.canvas.width,
        this.$.sy ?? ctx.canvas.height
      )
    })
    this._size = computed(() => (this._imageData.value?.data.length ?? 0) / 4)
    this._deps = ref(0)

    // eslint-disable-next-line functional/no-let
    let marked = false
    this._markAsync = () => {
      if (marked) return
      marked = true
      this._deps.value++
      // eslint-disable-next-line promise/catch-or-return
      resolved.then(() => (marked = false))
    }
  }

  public get size(): number {
    return this._size.value
  }

  public set(pixel: number, r: number, g: number, b: number, a = 255) {
    const ps = pixel * 4
    this._imageData.value.data[ps + 0] = r
    this._imageData.value.data[ps + 1] = g
    this._imageData.value.data[ps + 2] = b
    this._imageData.value.data[ps + 3] = a
    this._markAsync()
  }

  public setL(x: number, y: number, r: number, g: number, b: number, a = 255) {
    this.set(x + y * this._imageData.value.width, r, g, b, a)
  }

  public get(pixel: number): [number, number, number, number] {
    const ps = pixel * 4
    return [
      this._imageData.value.data[ps + 0],
      this._imageData.value.data[ps + 1],
      this._imageData.value.data[ps + 2],
      this._imageData.value.data[ps + 3]
    ]
  }

  public getL(x: number, y: number) {
    return this.get(x + y * this._imageData.value.width)
  }

  public markChange() {
    this._deps.value++
  }

  public getRect() {
    return {
      x: 0,
      y: 0,
      width: this.$.width ?? this.$.sw ?? this._canvas.value.width,
      height: this.$.height ?? this.$.sh ?? this._canvas.value.height
    }
  }
}
