import { watch } from "@vue-reactivity/watch"
import type { ComputedRef, reactive } from "@vue/reactivity"
import { computed } from "@vue/reactivity"

import { Shape } from "../Shape"
import { isDev } from "../env"
import { getImage, loadImage } from "../methods/loadImage"
import { SCOPE } from "../symbols"
import type { CommonShapeAttrs } from "../type/CommonShapeAttrs"
import type { Rect } from "../type/Rect"
import type { ReactiveType } from "../type/fn/ReactiveType"

import { getValFromSource } from "./Image"

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
    scrollTop?: number,
    scrollLeft?: number,
    scrollWidth?: number,
    scrollHeight?: number,
    cache?: false
  ): HTMLCanvasElement
  private createImageRepeat(
    image: CanvasImageSource,
    imageWidth: number,
    imageHeight: number,
    scrollTop?: number,
    scrollLeft?: number,
    scrollWidth?: number,
    scrollHeight?: number,
    cache?: true
  ): {
    r: HTMLCanvasElement
    t: number
    l: number
  }
  private createImageRepeat(
    image: CanvasImageSource,
    imageWidth: number,
    imageHeight: number,
    scrollTop?: number,
    scrollLeft?: number,
    scrollWidth?: number,
    scrollHeight?: number,
    cache?: boolean
  ):
    | HTMLCanvasElement
    | {
        r: HTMLCanvasElement
        t: number
        l: number
      } {
    // eslint-disable-next-line functional/no-let
    let id: string
    if (cache) {
      id = `${scrollWidth}x${scrollHeight}`
      const inCache = this._cacheImageRepeat.get(id)

      if (inCache) {
        if (isDev) console.log("[cache]: cache by createImageRepeat used!")
        return {
          r: inCache.r,
          t: scrollTop ? -scrollTop + inCache.t : 0,
          l: scrollLeft ? -scrollLeft + inCache.l : 0
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const ctx = document.createElement("canvas").getContext("2d")!

    if (cache) {
      if (scrollWidth) scrollWidth += imageWidth * 2
      if (scrollHeight) scrollHeight += imageHeight * 2
    }

    ctx.canvas.width = scrollWidth ?? imageWidth
    ctx.canvas.height = scrollHeight ?? imageHeight

    // eslint-disable-next-line functional/no-let
    let canvasRepeatX: CanvasRenderingContext2D | null = null
    if (scrollWidth) {
      scrollLeft ??= 0
      const axisY = scrollHeight ? 0 : -(scrollTop ?? 0)

      // eslint-disable-next-line functional/no-let
      let ctxScoop: CanvasRenderingContext2D
      if (scrollHeight) {
        canvasRepeatX = document.createElement("canvas").getContext("2d")
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
      console.warn("sscae")
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
    attrs: ReactiveType<
      CommonShapeAttrs<PersonalAttrs> & {
        setup?: (
          attrs: ReturnType<typeof reactive<CommonShapeAttrs<PersonalAttrs>>>
        ) => void
      } & ThisType<ImageRepeat>
    >
  ) {
    super(attrs)

    this[SCOPE].on()

    this._image = computed<CanvasImageSource>(() => {
      // eslint-disable-next-line functional/no-let
      let { image: _image } = this.$

      if (typeof _image === "string") _image = getImage(_image)

      const { crop, width, height } = this.$

      // eslint-disable-next-line functional/no-let
      let image: CanvasImageSource
      if (crop) {
        image = document.createElement("canvas")
        image.width = width ?? crop.width
        image.height = height ?? crop.height
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        image
          .getContext("2d")!
          .drawImage(
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
      } else if (width !== undefined && height !== undefined) {
        image = document.createElement("canvas")
        ;[image.width, image.height] = [width, height]
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        image
          .getContext("2d")!
          .drawImage(this._image.value, 0, 0, width, height)
      } else {
        image = _image
        // image.drawImage(this._image.value, 0, 0);
      }

      return image
    })
    watch(this._image, () => this._cacheImageRepeat.clear())

    this[SCOPE].off()
  }

  protected getSize() {
    return {
      width:
        this.$.scrollWidth ??
        this.$.width ??
        this.$.crop?.width ??
        getValFromSource(
          typeof this.$.image === "object"
            ? this.$.image.width
            : this._image?.value.width ?? 0
        ),
      height:
        this.$.scrollHeight ??
        this.$.height ??
        this.$.crop?.height ??
        getValFromSource(
          typeof this.$.image === "object"
            ? this.$.image.height
            : this._image?.value.height ?? 0
        )
    }
  }
}