import { Shape } from "../Shape";
import { Offset } from "../types/Offset";
import { Size } from "../types/Size";
import { loadImage } from "../utils/loadImage";

type AttrsCustom = {
  // eslint-disable-next-line functional/prefer-readonly-type
  image: CanvasImageSource;
  // eslint-disable-next-line functional/prefer-readonly-type
  crop?: Offset & Size;
} & Partial<Size>;

function getValFromSource(val: SVGAnimatedLength | number) {
  if (typeof val === "number") return val;

  return val.baseVal.value;
}

export class Image<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  EventsCustom extends Record<string, any> = {},
  AttrsRefs extends Record<string, unknown> = Record<string, unknown>,
  AttrsRaws extends Record<string, unknown> = Record<string, unknown>
> extends Shape<AttrsCustom, EventsCustom, AttrsRefs, AttrsRaws> {
  static readonly type = "Image";
  static readonly noRefs = ["image"];
  static readonly fromURL = loadImage;

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    if (this.attrs.crop) {
      context.drawImage(
        this.attrs.image,
        this.attrs.crop.x,
        this.attrs.crop.y,
        this.attrs.crop.width,
        this.attrs.crop.height,
        this.attrs.x,
        this.attrs.y,
        this.attrs.width ?? this.attrs.crop.width,
        this.attrs.height ?? this.attrs.crop.height
      );
    } else if (this.attrs.width !== void 0 && this.attrs.height !== void 0) {
      context.drawImage(
        this.attrs.image,
        this.attrs.x,
        this.attrs.y,
        this.attrs.width,
        this.attrs.height
      );
    } else {
      console.log(this.attrs.image);
      context.drawImage(this.attrs.image, this.attrs.x, this.attrs.y);
    }

    this.fillStrokeScene(context);
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
        getValFromSource(this.attrs.image.height),
    };
  }
}
