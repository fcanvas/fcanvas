import { AttrsShapeSelf, Shape } from "../Shape";
import { cropImage } from "../methods/cropImage";

type AttrsCustom<Animations> = {
  // eslint-disable-next-line functional/prefer-readonly-type
  image: HTMLImageElement;
  // eslint-disable-next-line functional/prefer-readonly-type
  animations: Animations;
  // eslint-disable-next-line functional/prefer-readonly-type
  animation: keyof Animations;
  // eslint-disable-next-line functional/prefer-readonly-type
  frameIndex?: number; // 0
  // eslint-disable-next-line functional/prefer-readonly-type
  frameRate?: number; // 17
};

export class Sprite<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  EventsCustom extends Record<string, any> = {},
  // eslint-disable-next-line functional/prefer-readonly-type, @typescript-eslint/ban-types
  Animations extends Record<string, number[]> = {}
> extends Shape<AttrsCustom<Animations>, EventsCustom> {
  static readonly type = "Sprite";
  static readonly attrsReactSize = [
    "image",
    "animations",
    "animation",
    "frameIndex",
    "frameRate",
  ];

  private readonly cropImageCache = new Map<
    keyof Animations,
    // eslint-disable-next-line functional/prefer-readonly-type
    Map<number, HTMLCanvasElement>
  >();
  // eslint-disable-next-line functional/prefer-readonly-type
  private timeout?: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  private _isRunning = false;

  private createCropImage(): HTMLCanvasElement {
    const _frameIndex = this.attrs.frameIndex ?? 0;
    const cropImageInCache = this.cropImageCache
      .get(this.attrs.animation)
      ?.get(_frameIndex);

    if (cropImageInCache) return cropImageInCache;

    if (!this.cropImageCache.has(this.attrs.animation)) {
      this.cropImageCache.set(this.attrs.animation, new Map());
    }
    const animation = this.attrs.animations[this.attrs.animation];
    const frameLength = ~~animation.length / 4;
    const frameIndex =
      _frameIndex > frameLength
        ? (_frameIndex % frameLength) - 1
        : _frameIndex < 0
        ? frameLength + _frameIndex + 1
        : _frameIndex;

    const cropImageNow = cropImage(
      this.attrs.image,
      ...animation.slice(frameIndex, frameIndex + 4)
    );

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.cropImageCache
      .get(this.attrs.animation)!
      .set(_frameIndex, cropImageNow);

    return cropImageNow;
  }

  constructor(attrs: AttrsShapeSelf<AttrsCustom<Animations>>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super(attrs as unknown as any);

    this.watch("animations", (_n, _o, prop) => {
      if (prop.startsWith("animations.")) {
        // example: animations.moving.0
        // example: animations.moving.1
        // example: animations.moving.2
        // example: animations.moving.3
        const spl = prop.split(".");
        if (spl.length === 2) {
          this.cropImageCache.get(spl[1])?.clear();
        } else if (spl.length === 3) {
          this.cropImageCache.get(spl[1])?.delete(+spl[2]);
        }
      }
    });
  }

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    if (
      (this.attrs.fillEnabled ?? true) ||
      (this.attrs.strokeEnabled ?? true)
    ) {
      context.beginPath();
      const { width, height } = this.size();
      context.rect(0, 0, width, height);
      context.closePath();
      this.fillStrokeScene(context);
    }

    const crop = this.createCropImage();
    context.drawImage(crop, 0, 0);
  }

  public animation(name: keyof Animations) {
    // eslint-disable-next-line functional/immutable-data
    this.attrs.animation = name;
  }
  public start(): void {
    if (this._isRunning) return;

    this._isRunning = true;
    this.timeout = setTimeout(() => {
      // eslint-disable-next-line functional/no-let
      let index = (this.attrs.frameIndex ?? 0) + 1;
      if (index > ~~this.attrs.animations[this.attrs.animation].length / 4) {
        index = 0;
      }

      // eslint-disable-next-line functional/immutable-data
      this.attrs.frameIndex = index;
    }, 1000 / (this.attrs.frameRate ?? 17)) as unknown as number;
  }
  public stop(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = void 0;
    }
    // eslint-disable-next-line functional/immutable-data
    this.attrs.frameIndex =
      ~~this.attrs.animations[this.attrs.animation].length / 4;
    this._isRunning = false;
  }
  public isRunning() {
    return this._isRunning;
  }

  protected size() {
    const { width, height } = this.createCropImage();
    return {
      width,
      height,
    };
  }
}
