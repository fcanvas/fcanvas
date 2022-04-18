import { Group } from "../Group";
import { Layer } from "../Layer";
import { AttrsShapeSelf, Shape } from "../Shape";
import { cropImage } from "../methods/cropImage";

type AttrsCustom = {
  // eslint-disable-next-line functional/prefer-readonly-type
  image: HTMLImageElement;
  // eslint-disable-next-line functional/prefer-readonly-type
  animations: Record<string, number[]>;
  // eslint-disable-next-line functional/prefer-readonly-type
  animation: string;
  // eslint-disable-next-line functional/prefer-readonly-type
  frameIndex?: number; // 0
  // eslint-disable-next-line functional/prefer-readonly-type
  frameRate?: number; // 17
  infinite?: boolean; // true
};

export class Sprite<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  EventsCustom extends Record<string, any> = {},
  AttrsRefs extends Record<string, unknown> = Record<string, unknown>,
  AttrsRaws extends Record<string, unknown> = Record<string, unknown>
> extends Shape<
  AttrsCustom,
  EventsCustom,
  AttrsRefs,
  AttrsRaws,
  Layer | Group
> {
  static readonly type = "Sprite";
  static readonly noRefs = ["image"];
  static readonly sizes = [
    "image",
    "animations",
    "animation",
    "frameIndex",
    "frameRate",
  ];

  private readonly cropImageCache = new Map<
    string,
    // eslint-disable-next-line functional/prefer-readonly-type
    Map<number, HTMLCanvasElement>
  >();
  // eslint-disable-next-line functional/prefer-readonly-type
  private interval?: number;
  // eslint-disable-next-line functional/prefer-readonly-type
  private _isRunning = false;
  private get frameIndex(): number {
    const _frameIndex = this.attrs.frameIndex ?? 0;

    const frameLength =
      ~~this.attrs.animations[this.attrs.animation].length / 4;
    const frameIndex =
      _frameIndex > frameLength
        ? (_frameIndex % frameLength) - 1
        : _frameIndex < 0
        ? frameLength + _frameIndex + 1
        : _frameIndex;

    return frameIndex;
  }

  private createCropImage(): HTMLCanvasElement {
    const indexStart = this.frameIndex * 4;
    const cropImageInCache = this.cropImageCache
      .get(this.attrs.animation)
      ?.get(indexStart);

    if (cropImageInCache) return cropImageInCache;

    if (!this.cropImageCache.has(this.attrs.animation)) {
      this.cropImageCache.set(this.attrs.animation, new Map());
    }

    const animation = this.attrs.animations[this.attrs.animation];

    const cropImageNow = cropImage(
      this.attrs.image,
      ...animation.slice(indexStart, indexStart + 4)
    );

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.cropImageCache
      .get(this.attrs.animation)!
      .set(indexStart, cropImageNow);

    return cropImageNow;
  }

  constructor(attrs: AttrsShapeSelf<AttrsCustom, AttrsRefs, AttrsRaws>) {
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

  public animation(name: string) {
    // eslint-disable-next-line functional/immutable-data
    this.attrs.animation = name;
  }
  public start(): void {
    if (this._isRunning) return;

    this._isRunning = true;
    this.interval = setInterval(() => {
      const { frameIndex } = this;
      const countFrame =
        ~~this.attrs.animations[this.attrs.animation].length / 4;

      if (
        this.attrs.infinite !== false &&
        this.attrs.frameIndex === countFrame - 1
      ) {
        // last frame repeat -> reset;
        this.attrs.frameIndex = 0;
        return;
      }
      if (this.attrs.infinite === false && frameIndex === countFrame - 2) {
        // this frame last
        this.stop();
      }

      this.attrs.frameIndex = frameIndex + 1;
    }, 1000 / (this.attrs.frameRate ?? 17)) as unknown as number;
  }
  public stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = void 0;
    }
    //// eslint-disable-next-line functional/immutable-data
    // this.attrs.frameIndex =
    //   ~~this.attrs.animations[this.attrs.animation].length / 4;
    this._isRunning = false;
  }
  public isRunning() {
    return this._isRunning;
  }

  protected size() {
    const indexStart = this.frameIndex * 4;
    const [width, height] = this.attrs.animations[this.attrs.animation].slice(
      indexStart + 2,
      indexStart + 4
    );

    return {
      width,
      height,
    };
  }
}
