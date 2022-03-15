import { Shape } from "../Shape";
import { Offset } from "../types/Offset";
import { Size } from "../types/Size";

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
  EventsCustom extends Record<string, any> = {}
> extends Shape<AttrsCustom, EventsCustom> {
  static readonly type = "Image";
  static fromURL(url: string): Promise<HTMLImageElement> {
    const img = new self.Image();

    return new Promise((resolve, reject) => {
      function done() {
        resolve(img);
        img.removeEventListener("load", done);
        img.removeEventListener("error", fail);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function fail(err: any) {
        reject(err);
        img.removeEventListener("load", done);
        img.removeEventListener("error", fail);
      }

      img.addEventListener("load", done);
      img.addEventListener("error", fail);

      // eslint-disable-next-line functional/immutable-data
      img.src = url;
    });
  }

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

      return;
    }
    if (this.attrs.width !== void 0 && this.attrs.height !== void 0) {
      context.drawImage(
        this.attrs.image,
        this.attrs.x,
        this.attrs.y,
        this.attrs.width,
        this.attrs.height
      );

      return;
    }

    context.drawImage(this.attrs.image, this.attrs.x, this.attrs.y);
  }

  public size() {
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
