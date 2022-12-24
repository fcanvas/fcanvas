import type { ComputedRef, reactive } from "@vue/reactivity";
import { computed } from "@vue/reactivity";
import { watch } from "@vue-reactivity/watch"

import { Shape } from "../Shape";
import { getImage, loadImage } from "../methods/loadImage";
import { SCOPE } from "../symbols";
import type { CommonShapeAttrs } from "../type/CommonShapeAttrs";
import type { Rect } from "../type/Rect";
import type { ReactiveType } from "../type/fn/ReactiveType";

type PersonalAttrs = {
  // eslint-disable-next-line no-undef
  image: CanvasImageSource | string;
  crop?: Rect;
} & Partial<{
  width: number;
  height: number;

  scrollWidth: number;
  scrollHeight: number;
  scrollTop: number;
  scrollLeft: number;

  whileDraw: boolean;
}>;

function getValFromSource(val: SVGAnimatedLength | number) {
  if (typeof val === "number") return val;

  return val.baseVal.value;
}

export class ImageRepeat extends Shape<PersonalAttrs> {
  static readonly type = "Image";
  static readonly fromURL = loadImage;

  // eslint-disable-next-line no-undef
  private readonly _image: ComputedRef<CanvasImageSource>;
  private readonly _cacheImageRepeat: Map<
    string,
    {
      r: HTMLCanvasElement;
      t: number;
      l: number;
    }
  > = new Map();

  private createImageRepeat(
    image: HTMLCanvasElement | HTMLImageElement,
    scrollTop?: number,
    scrollLeft?: number,
    scrollWidth?: number,
    scrollHeight?: number,
    cache?: false
  ): HTMLCanvasElement;
  private createImageRepeat(
    image: HTMLCanvasElement | HTMLImageElement,
    scrollTop?: number,
    scrollLeft?: number,
    scrollWidth?: number,
    scrollHeight?: number,
    cache: true
  ): {
    r: HTMLCanvasElement;
    t: number;
    l: number;
  };
  private createImageRepeat(
    image: HTMLCanvasElement | HTMLImageElement,
    scrollTop?: number,
    scrollLeft?: number,
    scrollWidth?: number,
    scrollHeight?: number,
    cache?: boolean
  ):
    | HTMLCanvasElement
    | {
        r: HTMLCanvasElement;
        t: number;
        l: number;
      } {
    const { width: imageWidth, height: imageHeight } = image;

    let id: string;
    if (cache) {
      id = `${scrollWidth}x${scrollHeight}`;
      const inCache = this._cacheImageRepeat.get(id);

      if (inCache) {
        console.log("[cache]: cache by createImageRepeat used!");
        return {
          r: inCache.r,
          t: scrollTop ? scrollTop - inCache.t : 0,
          l: scrollLeft ? scrollLeft - inCache.l : 0,
        };
      }
    }

    const ctx = document.createElement("canvas").getContext("2d");

    if (cache) {
      if (scrollWidth) scrollWidth += imageWidth * 2;
      if (scrollHeight) scrollHeight += imageHeight * 2;
    }

    ctx.canvas.width = scrollWidth ?? imageWidth;
    ctx.canvas.height = scrollHeight ?? imageHeight;

    let canvasRepeatX: CanvasRenderingContext2D | null = null;
    if (scrollWidth) {
      scrollLeft ??= 0;
      const axisY = scrollHeight ? 0 : scrollTop ?? 0;

      let ctxScoop;
      if (scrollHeight) {
        canvasRepeatX = document.createElement("canvas").getContext("2d");
        canvasRepeatX.canvas.width = scrollWidth;
        canvasRepeatX.canvas.height = imageHeight;
        ctxScoop = canvasRepeatX;
      } else {
        ctxScoop = ctx;
      }

      // const offsetTop = imageWidth %
      const offsetLeft = -(scrollLeft % imageWidth);
      let currentX = offsetLeft;
      const maxX = scrollWidth;

      while (true) {
        if (currentX > maxX) break;

        ctxScoop.drawImage(image, currentX, axisY);
        currentX += imageWidth;
      }
    }
    if (scrollHeight) {
      scrollTop ??= 0;
      const axisX = scrollWidth ? 0 : scrollLeft ?? 0;

      const imageScoop = canvasRepeatX?.canvas ?? image;

      const offsetTop = -(scrollTop % imageHeight);
      let currentY = offsetTop;
      const maxY = scrollHeight;

      while (true) {
        if (currentY > maxY) break;

        ctx.drawImage(imageScoop, axisX, currentY);
        currentY += imageHeight;
      }
    }

    if (cache) {
      const inCache = {
        r: ctx.canvas,
        t: 0,
        l: 0,
      };
      this._cacheImageRepeat.clear();
      this._cacheImageRepeat.set(id, inCache);

      return inCache;
    }

    return ctx.canvas;
  }

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    let image: HTMLCanvasElement | HTMLImageElement;
    if (this.$.crop) {
      image = document.createElement("canvas");
      image.width = this.$.width ?? this.$.crop.width;
      image.height = this.$.height ?? this.$.crop.height;
      image
        .getContext("2d")!
        .drawImage(
          this._image.value,
          this.$.crop.x,
          this.$.crop.y,
          this.$.crop.width,
          this.$.crop.height,
          0,
          0,
          this.$.width ?? this.$.crop.width,
          this.$.height ?? this.$.crop.height
        );
    } else if (this.$.width !== undefined && this.$.height !== undefined) {
      image = document.createElement("canvas");
      [image.width, image.height] = [this.$.width, this.$.height];
      image
        .getContext("2d")!
        .drawImage(this._image.value, 0, 0, this.$.width, this.$.height);
    } else {
      image = this._image.value;
      // image.drawImage(this._image.value, 0, 0);
    }

    // done. image (croped) ready!
    this.fillStrokeScene(context);

    const { width: imageWidth, height: imageHeight } = image;

    // image = 7 x 5
    // const scrollTop = 0;
    // const scrollLeft = 50;
    // const scrollWidth = imageWidth * 2;
    // const scrollHeight = imageHeight * 2;
    const { scrollTop, scrollLeft, scrollWidth, scrollHeight } = this.$;

    if (this.$.whileDraw !== true) {
      let {
        r,
        t: y,
        l: x,
      } = this.createImageRepeat(
        image,
        scrollTop,
        scrollLeft,
        scrollWidth,
        scrollHeight,
        true
      );

      if (x) {
        if (x > 0) {
          x = -r.width;
        } else if (-x > scrollWidth) {
          x = -imageWidth;
        }
      }
      if (y) {
        if (y > 0) {
          y = -r.height;
        } else if (-y > scrollHeight) {
          y = -imageHeight;
        }
      }

      context.drawImage(r, x, y);
    } else {
      /// kfoprekgo
      const r = this.createImageRepeat(
        image,
        scrollTop,
        scrollLeft,
        scrollWidth,
        scrollHeight,
        false
      );

      context.drawImage(r, 0, 0);
    }
  }

  constructor(
    attrs: ReactiveType<
      CommonShapeAttrs<PersonalAttrs> & {
        setup?: (
          attrs: ReturnType<typeof reactive<CommonShapeAttrs<PersonalAttrs>>>
        ) => void;
      } & ThisType<Image>
    >
  ) {
    super(attrs);

    this[SCOPE].on();

    // eslint-disable-next-line no-undef
    this._image = computed<CanvasImageSource>(() => {
      const { image } = this.$;

      if (typeof image === "string") return getImage(image);

      return image;
    });
    watch(this._image, () => this._cacheImageRepeat.clear());

    this[SCOPE].off();
  }

  protected getSize() {
    return {
      width:
        this.$.scrollWidth ??
        this.$.width ??
        this.$.crop?.width ??
        getValFromSource(this._image.value.width),
      height:
        this.$.scrollHeight ??
        this.$.height ??
        this.$.crop?.height ??
        getValFromSource(this._image.value.height),
    };
  }
}
