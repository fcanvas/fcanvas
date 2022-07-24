import type { ComputedRef, reactive } from "@vue/reactivity"
import { computed } from "@vue/reactivity"

import { Shape } from "../Shape"
import { getImage, loadImage } from "../methods/loadImage"
import { SCOPE } from "../symbols"
import type { CommonShapeAttrs } from "../type/CommonShapeAttrs"
import type { Rect } from "../type/Rect"
import type { ReactiveType } from "../type/fn/ReactiveType"

type PersonalAttrs = {
  // eslint-disable-next-line no-undef
  image: CanvasImageSource | string
  crop?: Rect
} & Partial<{
  width: number
  height: number
}>

function getValFromSource(val: SVGAnimatedLength | number) {
  if (typeof val === "number") return val

  return val.baseVal.value
}

export class Image extends Shape<PersonalAttrs> {
  static readonly type = "Image"
  static readonly fromURL = loadImage

  // eslint-disable-next-line no-undef
  private readonly _image: ComputedRef<CanvasImageSource>

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    if (this.$.crop) {
      context.drawImage(
        this._image.value,
        this.$.crop.x,
        this.$.crop.y,
        this.$.crop.width,
        this.$.crop.height,
        0,
        0,
        this.$.width ?? this.$.crop.width,
        this.$.height ?? this.$.crop.height
      )
    } else if (this.$.width !== undefined && this.$.height !== undefined) {
      context.drawImage(this._image.value, 0, 0, this.$.width, this.$.height)
    } else {
      context.drawImage(this._image.value, 0, 0)
    }
    this.fillStrokeScene(context)
  }

  constructor(
    attrs: ReactiveType<
      CommonShapeAttrs<PersonalAttrs> & {
        setup?: (
          attrs: ReturnType<typeof reactive<CommonShapeAttrs<PersonalAttrs>>>
        ) => void
      } & ThisType<Image>
    >
  ) {
    super(attrs)

    this[SCOPE].on()

    // eslint-disable-next-line no-undef
    this._image = computed<CanvasImageSource>(() => {
      const { image } = this.$

      if (typeof image === "string") return getImage(image)

      return image
    })

    this[SCOPE].off()
  }

  protected getSize() {
    return {
      width:
        this.$.width ??
        this.$.crop?.width ??
        getValFromSource(this._image.value.width),
      height:
        this.$.height ??
        this.$.crop?.height ??
        getValFromSource(this._image.value.height)
    }
  }
}
