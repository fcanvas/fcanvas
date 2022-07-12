import { Shape } from "../Shape"
import { cropImage } from "../methods/cropImage"

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type PersonalAttrs = {
  image: HTMLImageElement
  animations: Record<
    string,
    | number[]
    | {
        frames: number[]
        /**
         * @default: 0
         * */

        frameIndex?: number
        /**
         * @default: 17
         * */

        frameRate?: number
      }
  >
  animation: string
  frameIndex?: number // 0
  frameRate?: number // 17
  infinite?: boolean // true
}

export class Sprite extends Shape<PersonalAttrs> {
  static readonly type = "Sprite"

  private readonly cropImageCache = new Map<
    string,
    Map<number, HTMLCanvasElement>
  >()

  private interval?: number

  private _isRunning = false

  private get _anim(): typeof this.attrs.animations["*"] {
    return this.attrs.animations[this.attrs.animation]
  }

  private get _frames(): readonly number[] {
    return "frames" in this._anim ? this._anim.frames : this._anim
  }

  private get frameIndex(): number {
    const _frameIndex = this.attrs.frameIndex ?? 0

    const frameLength = ~~this._frames.length / 4
    const frameIndex =
      _frameIndex > frameLength
        ? (_frameIndex % frameLength) - 1
        : _frameIndex < 0
          ? frameLength + _frameIndex + 1
          : _frameIndex

    return frameIndex
  }

  private createCropImage(): HTMLCanvasElement {
    const indexStart = this.frameIndex * 4
    const cropImageInCache = this.cropImageCache
      .get(this.attrs.animation)
      ?.get(indexStart)

    if (cropImageInCache) return cropImageInCache

    if (!this.cropImageCache.has(this.attrs.animation))
      this.cropImageCache.set(this.attrs.animation, new Map())

    const cropImageNow = cropImage(
      this.attrs.image,
      ...this._frames.slice(indexStart, indexStart + 4)
    )

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.cropImageCache.get(this.attrs.animation)!.set(indexStart, cropImageNow)

    return cropImageNow
  }

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    if (
      this.attrs.fillEnabled !== false ||
      this.attrs.strokeEnabled !== false
    ) {
      context.beginPath()
      const { width, height } = this.getSize()
      context.rect(0, 0, width, height)
      context.closePath()
      this.fillStrokeScene(context)
    }

    const crop = this.createCropImage()
    context.drawImage(crop, 0, 0)
  }

  public animation(name: string) {
    // eslint-disable-next-line functional/immutable-data
    this.attrs.animation = name
  }

  public start(): void {
    if (this._isRunning) return

    this._isRunning = true
    this.interval = setInterval(() => {
      const { frameIndex } = this
      const countFrame = ~~this._frames.length / 4

      if (
        this.attrs.infinite !== false &&
        this.attrs.frameIndex === countFrame - 1
      ) {
        // last frame repeat -> reset;
        // eslint-disable-next-line functional/immutable-data
        this.attrs.frameIndex = 0
        return
      }
      if (this.attrs.infinite === false && frameIndex === countFrame - 2) {
        // this frame last
        this.stop()
      }

      // eslint-disable-next-line functional/immutable-data
      this.attrs.frameIndex = frameIndex + 1
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, 1000 / ((this._anim as any).frameRate ?? this.attrs.frameRate ?? 17)) as unknown as number
  }

  public stop(): void {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = undefined
    }
    /// / eslint-disable-next-line functional/immutable-data
    // this.attrs.frameIndex =
    //   ~~this.attrs.animations[this.attrs.animation].length / 4;
    this._isRunning = false
  }

  public isRunning() {
    return this._isRunning
  }

  protected getSize() {
    const indexStart = this.frameIndex * 4
    const [width, height] = this._frames.slice(indexStart + 2, indexStart + 4)

    return {
      width,
      height
    }
  }
}