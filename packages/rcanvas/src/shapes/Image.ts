import { Shape } from "../Shape"
import { loadImage } from "../utils/loadImage"

type PersonalAttrs = {
  // eslint-disable-next-line no-undef
  image: CanvasImageSource
  crop?: {
    x: number
    y: number
    width: number
    height: number
  }
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
    if (this.attrs.crop) {
      context.drawImage(
        this.attrs.image,
        this.attrs.crop.x,
        this.attrs.crop.y,
        this.attrs.crop.width,
        this.attrs.crop.height,
        0,
        0,
        this.attrs.width ?? this.attrs.crop.width,
        this.attrs.height ?? this.attrs.crop.height
      )
    } else if (
      this.attrs.width !== undefined &&
      this.attrs.height !== undefined
    ) {
      context.drawImage(
        this.attrs.image,
        0,
        0,
        this.attrs.width,
        this.attrs.height
      )
    } else {
      context.drawImage(this.attrs.image, 0, 0)
    }
    this.fillStrokeScene(context)
  }

  protected getSize() {
    return {
      width:
        this.attrs.width ??
        this.attrs.crop?.width ??
        getValFromSource(this.attrs.image.width),
      height:
        this.attrs.height ??
        this.attrs.crop?.height ??
        getValFromSource(this.attrs.image.height)
    }
  }
}
