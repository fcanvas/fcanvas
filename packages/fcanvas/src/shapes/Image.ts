import { Shape } from "../Shape"
import { loadImage } from "../methods/loadImage"
import type { Rect } from "../type/Rect"

type PersonalAttrs = {
  // eslint-disable-next-line no-undef
  image: CanvasImageSource
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

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    if (this.$.crop) {
      context.drawImage(
        this.$.image,
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
      context.drawImage(this.$.image, 0, 0, this.$.width, this.$.height)
    } else {
      context.drawImage(this.$.image, 0, 0)
    }
    this.fillStrokeScene(context)
  }

  protected getSize() {
    return {
      width:
        this.$.width ??
        this.$.crop?.width ??
        getValFromSource(this.$.image.width),
      height:
        this.$.height ??
        this.$.crop?.height ??
        getValFromSource(this.$.image.height)
    }
  }
}
