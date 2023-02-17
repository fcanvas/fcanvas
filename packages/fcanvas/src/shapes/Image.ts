import type { ComputedRef } from "@vue/reactivity"
import { computed } from "@vue/reactivity"

import { Shape } from "../Shape"
import { getImage, loadImage } from "../fns/loadImage"
import { getSizeApplyRatio } from "../logic/getSizeApplyRatio"
import { SCOPE } from "../symbols"
import type { CommonShapeAttrs } from "../type/CommonShapeAttrs"
import type { Rect } from "../type/Rect"
import type { TorFnT } from "../type/TorFnT"
import type { ReactiveType } from "../type/fn/ReactiveType"

type PersonalAttrs = {
  image: CanvasImageSource | string
  crop?: Rect
} & Partial<{
  width: number
  height: number
}>

export function getValFromSource(val: SVGAnimatedLength | number) {
  if (typeof val === "number") return val

  return val.baseVal.value
}
export function getSizeImageApplyRatio(
  width: number | undefined,
  height: number | undefined,
  _image: CanvasImageSource
): {
  width: number
  height: number
} {
  const wIsUndef = width === undefined
  const hIsUndef = height === undefined

  if (wIsUndef && hIsUndef) {
    return {
      width: getValFromSource(_image.width),
      height: getValFromSource(_image.height)
    }
  }
  if (!wIsUndef && !hIsUndef) return { width, height }

  if (!hIsUndef) {
    // height is ready, width is undefined
    return {
      width: getSizeApplyRatio(
        height,
        false,
        getValFromSource(_image.width) / getValFromSource(_image.height)
      ),
      height
    }
  }

  return {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    width: width!,
    height: getSizeApplyRatio(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      width!,
      true,
      getValFromSource(_image.width) / getValFromSource(_image.height)
    )
  }
}

export class Image extends Shape<PersonalAttrs> {
  static readonly type = "Image"
  static readonly fromURL = loadImage

  private readonly _image: ComputedRef<CanvasImageSource>

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    const { crop } = this.$
    const { width, height } = this.getSize()

    if (crop) {
      context.drawImage(
        this._image.value,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        width,
        height
      )
    } else if (width !== undefined || height !== undefined) {
      context.drawImage(this._image.value, 0, 0, width, height)
    } else {
      context.drawImage(this._image.value, 0, 0)
    }
    this.fillStrokeScene(context)
  }

  constructor(
    attrs: TorFnT<ReactiveType<CommonShapeAttrs<PersonalAttrs>>, Image>
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super(attrs as unknown as any)

    this[SCOPE].fOn()

    this._image = computed<CanvasImageSource>(() => {
      const { image } = this.$

      if (typeof image === "string") return getImage(image)

      return image
    })

    this[SCOPE].fOff()
  }

  protected getSize() {
    const { image, width, height, crop } = this.$

    return getSizeImageApplyRatio(
      width ?? crop?.width,
      height ?? crop?.height,
      typeof image === "string" ? getImage(image) : image
    )
  }
}
