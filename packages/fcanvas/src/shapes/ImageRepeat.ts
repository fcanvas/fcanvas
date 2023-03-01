import type { ComputedRef } from "@vue/reactivity"
import { computed } from "@vue/reactivity"
import { watch } from "src/fns/watch"

import { Shape } from "../Shape"
import { CONFIGS } from "../configs"
import { getImage, loadImage } from "../fns/loadImage"
import { SCOPE } from "../symbols"
import type { CommonShapeAttrs } from "../type/CommonShapeAttrs"
import type { Rect } from "../type/Rect"
import type { TorFnT } from "../type/TorFnT"
import type { ReactiveType } from "../type/fn/ReactiveType"

import { getSizeImageApplyRatio, getValFromSource } from "./Image"

type PersonalAttrs = {
  image: CanvasImageSource | string
  crop?: Rect
} & Partial<{
  width: number
  height: number

  scrollWidth: number
  scrollHeight: number
  scrollTop: number
  scrollLeft: number

  whileDraw: boolean
}>

export class ImageRepeat extends Shape<PersonalAttrs> {
  static readonly type = "ImageRepeat"
  static readonly fromURL = loadImage

  private readonly _image: ComputedRef<CanvasImageSource>
  private readonly _cacheImageRepeat: Map<
    string,
    {
      r: HTMLCanvasElement
      t: number
      l: number
    }
  > = new Map()

  private createImageRepeat(
    image: CanvasImageSource,
    imageWidth: number,
    imageHeight: number,
    scrollTop: number | undefined,
    scrollLeft: number | undefined,
    scrollWidth: number,
    scrollHeight: number,
    cache?: false
  ): HTMLCanvasElement | OffscreenCanvas
  private createImageRepeat(
    image: CanvasImageSource,
    imageWidth: number,
    imageHeight: number,
    scrollTop: number | undefined,
    scrollLeft: number | undefined,
    scrollWidth: number,
    scrollHeight: number,
    cache?: true
  ): {
    r: HTMLCanvasElement | OffscreenCanvas
    t: number
    l: number
  }
  private createImageRepeat(
    image: CanvasImageSource,
    imageWidth: number,
    imageHeight: number,
    scrollTop: number | undefined,
    scrollLeft: number | undefined,
    scrollWidth: number,
    scrollHeight: number,
    cache?: boolean
  ):
    | HTMLCanvasElement
    | OffscreenCanvas
    | {
        r: HTMLCanvasElement | OffscreenCanvas
        t: number
        l: number
      } {
    // eslint-disable-next-line functional/no-let
    let id: string
    if (cache) {
      id = `${scrollWidth}x${scrollHeight}`
      const inCache = this._cacheImageRepeat.get(id)

      if (inCache) {
        if (__DEV__) console.log("[cache]: cache by createImageRepeat used!")
        return {
          r: inCache.r,
          t: scrollTop ? -scrollTop + inCache.t : 0,
          l: scrollLeft ? -scrollLeft + inCache.l : 0
        }
      }
    }

    const ctx = CONFIGS.createOffscreenCanvas().getContext(
      "2d"
    ) as OffscreenCanvasRenderingContext2D

    if (cache) {
      if (scrollWidth) scrollWidth += imageWidth * 2
      if (scrollHeight) scrollHeight += imageHeight * 2
    }

    ctx.canvas.width = scrollWidth ?? imageWidth
    ctx.canvas.height = scrollHeight ?? imageHeight

    // eslint-disable-next-line functional/no-let
    let canvasRepeatX: OffscreenCanvasRenderingContext2D | null = null
    if (scrollWidth) {
      scrollLeft ??= 0
      const axisY = scrollHeight ? 0 : -(scrollTop ?? 0)

      // eslint-disable-next-line functional/no-let
      let ctxScoop: OffscreenCanvasRenderingContext2D
      if (scrollHeight) {
        canvasRepeatX = CONFIGS.createOffscreenCanvas().getContext(
          "2d"
        ) as OffscreenCanvasRenderingContext2D
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        canvasRepeatX!.canvas.width = scrollWidth
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        canvasRepeatX!.canvas.height = imageHeight
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ctxScoop = canvasRepeatX!
      } else {
        ctxScoop = ctx
      }

      // const offsetTop = imageWidth %
      const offsetLeft = scrollLeft % imageWidth
      // eslint-disable-next-line functional/no-let
      let currentX = offsetLeft
      const maxX = scrollWidth

      while (true) {
        if (currentX > maxX) break

        ctxScoop.drawImage(image, currentX, axisY)
        currentX += imageWidth
      }
    }
    if (scrollHeight) {
      scrollTop ??= 0
      const axisX = scrollWidth ? 0 : -(scrollLeft ?? 0)

      const imageScoop = canvasRepeatX?.canvas ?? image

      const offsetTop = scrollTop % imageHeight
      // eslint-disable-next-line functional/no-let
      let currentY = offsetTop
      const maxY = scrollHeight

      while (true) {
        if (currentY > maxY) break

        ctx.drawImage(imageScoop, axisX, currentY)
        currentY += imageHeight
      }
    }

    if (cache) {
      const inCache = {
        r: ctx.canvas,
        t: scrollTop ?? 0,
        l: scrollLeft ?? 0
      }
      this._cacheImageRepeat.clear()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      this._cacheImageRepeat.set(id, inCache)

      return inCache
    }

    return ctx.canvas
  }

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    const image = this._image.value

    // done. image (croped) ready!
    this.fillStrokeScene(context)

    const imageWidth = getValFromSource(image.width)
    const imageHeight = getValFromSource(image.height)

    // image = 7 x 5
    // const scrollTop = 0;
    // const scrollLeft = 50;
    // const scrollWidth = imageWidth * 2;
    // const scrollHeight = imageHeight * 2;
    const {
      scrollTop,
      scrollLeft,
      scrollWidth = imageWidth,
      scrollHeight = imageHeight
    } = this.$

    if (this.$.whileDraw !== true) {
      // eslint-disable-next-line functional/no-let
      let {
        r,
        t: y,
        l: x
      } = this.createImageRepeat(
        image,
        imageWidth,
        imageHeight,
        scrollTop,
        scrollLeft,
        scrollWidth,
        scrollHeight,
        true
      )

      if (x) {
        // x = 50
        x %= imageWidth
        x -= imageWidth
      }
      if (y) {
        y %= imageHeight
        y -= imageHeight
      }

      context.drawImage(r, x, y)
    } else {
      /// kfoprekgo
      const r = this.createImageRepeat(
        image,
        imageWidth,
        imageHeight,
        scrollTop,
        scrollLeft,
        scrollWidth,
        scrollHeight,
        false
      )

      context.drawImage(r, 0, 0)
    }
  }

  constructor(
    attrs: TorFnT<ReactiveType<CommonShapeAttrs<PersonalAttrs>>, ImageRepeat>
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super(attrs as unknown as any)

    this[SCOPE].fOn()

    this._image = computed<CanvasImageSource>(() => {
      // eslint-disable-next-line functional/no-let
      let { image: _image } = this.$

      if (typeof _image === "string") _image = getImage(_image)

      const { crop, width, height } = this.$

      // eslint-disable-next-line functional/no-let
      let image: CanvasImageSource
      if (crop) {
        image = CONFIGS.createOffscreenCanvas(
          width ?? crop.width,
          height ?? crop.height
        )
        const ctx = image.getContext("2d") as OffscreenCanvasRenderingContext2D

        ctx.drawImage(
          _image,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          width ?? crop.width,
          height ?? crop.height
        )
      } else if (width !== undefined || height !== undefined) {
        const { width: rW, height: rH } = getSizeImageApplyRatio(
          width,
          height,
          _image
        )
        image = CONFIGS.createOffscreenCanvas(rW, rH)
        const ctx = image.getContext("2d") as OffscreenCanvasRenderingContext2D

        ctx.drawImage(this._image.value, 0, 0, rW, rH)
      } else {
        image = _image
        // image.drawImage(this._image.value, 0, 0);
      }

      return image
    })
    watch(this._image, () => this._cacheImageRepeat.clear())

    this[SCOPE].fOff()
  }

  protected getSize() {
    const { image, width, height, crop, scrollWidth, scrollHeight } = this.$

    return getSizeImageApplyRatio(
      scrollWidth ?? width ?? crop?.width,
      scrollHeight ?? height ?? crop?.height,
      typeof image === "string" ? getImage(image) : image
    )
  }
}
