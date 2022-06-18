import { Shape } from "../Shape"
import type { Offset } from "../types/Offset"
import type { Size } from "../types/Size"
import { loadImage } from "../utils/loadImage"

type AttrsCustom = {
  // eslint-disable-next-line no-undef
  image: CanvasImageSource
  crop?: Offset & Size
} & Partial<Size>

function getValFromSource(val: SVGAnimatedLength | number) {
  if (typeof val === "number") return val

  return val.baseVal.value
}

export class Image<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  EventsCustom extends Record<string, any> = {},
  AttrsRefs extends Record<string, unknown> = Record<string, unknown>,
  AttrsRaws extends Record<string, unknown> = Record<string, unknown>
> extends Shape<AttrsCustom, EventsCustom, AttrsRefs, AttrsRaws> {
  static readonly type = "Image"
  static readonly noRefs = ["image"]
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

  protected size() {
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
