import { watch } from "@vue-reactivity/watch"
import type { ComputedRef, reactive, Ref } from "@vue/reactivity"
import { computed, ref } from "@vue/reactivity"

import { Shape } from "../Shape"
import { getImage } from "../auto-export"
import { cropImage } from "../methods/cropImage"
import { SCOPE } from "../symbols"
import type { CommonShapeAttrs } from "../type/CommonShapeAttrs"
import type { ReactiveType } from "../type/fn/ReactiveType"

interface AnimationFrames {
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
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type PersonalAttrs = {
  // eslint-disable-next-line no-undef
  image: CanvasImageSource | string
  animations: Record<string, number[] | AnimationFrames>
  animation: string
  frameIndex?: number // 0
  frameRate?: number // 17
  infinite?: boolean // true
}

export class Sprite extends Shape<PersonalAttrs> {
  static readonly type = "Sprite"

  // eslint-disable-next-line no-undef
  private readonly _image: ComputedRef<CanvasImageSource>
  private readonly cropImageCache: Map<string, HTMLCanvasElement> = new Map()
  private readonly currentFrames: ComputedRef<
    Exclude<AnimationFrames, string[]>
  >

  private readonly frames: ComputedRef<HTMLCanvasElement[]>
  private readonly currentFrameIndex: Ref<number>
  private readonly currentFrame: ComputedRef<HTMLCanvasElement>

  private _running = false
  private _interval?: ReturnType<typeof setInterval>

  constructor(
    attrs: ReactiveType<
      CommonShapeAttrs<PersonalAttrs> & {
        setup?: (
          attrs: ReturnType<typeof reactive<CommonShapeAttrs<PersonalAttrs>>>
        ) => void
      } & ThisType<Sprite>
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
    this.currentFrames = computed<Exclude<AnimationFrames, string[]>>(() => {
      const frames = this.$.animations[this.$.animation]

      if (Array.isArray(frames)) {
        return {
          frames,
          frameIndex: this.$.frameIndex,
          frameRate: this.$.frameRate
        }
      }

      return {
        frameIndex: this.$.frameIndex,
        frameRate: this.$.frameRate,
        ...frames
      }
    })
    this.frames = computed<HTMLCanvasElement[]>(() => {
      const groups = []
      const { frames } = this.currentFrames.value
      // eslint-disable-next-line functional/no-let
      for (let i = 0; i < frames.length; i += 4) {
        groups.push(
          this.getFrame(frames[i], frames[i + 1], frames[i + 2], frames[i + 3])
        )
      }

      return groups
    })
    this.currentFrameIndex = ref(this.currentFrames.value.frameIndex ?? 0)
    watch(
      () => this.currentFrames.value.frameIndex ?? 0,
      (value) => {
        this.currentFrameIndex.value = value
      }
    )
    this.currentFrame = computed<HTMLCanvasElement>(() => {
      return this.frames.value[this.currentFrameIndex.value]
    })

    this[SCOPE].off()
  }

  get animation() {
    return this.$.animation
  }

  set animation(value: string) {
    // eslint-disable-next-line functional/immutable-data
    this.$.animation = value
  }

  private getFrame(
    x: number,
    y: number,
    width: number,
    height: number
  ): HTMLCanvasElement {
    const key = `${x}.${y}.${width}.${height}`

    const cropImageInCache = this.cropImageCache.get(key)

    if (cropImageInCache) return cropImageInCache

    const cropImageNow = cropImage(this._image.value, x, y, width, height)

    this.cropImageCache.set(key, cropImageNow)

    return cropImageNow
  }

  protected _sceneFunc(context: CanvasRenderingContext2D) {
    if (this.$.fillEnabled !== false || this.$.strokeEnabled !== false) {
      context.beginPath()
      const { width, height } = this.getSize()
      context.rect(0, 0, width, height)
      context.closePath()
      this.fillStrokeScene(context)
    }

    context.drawImage(this.currentFrame.value, 0, 0)
  }

  public start(): void {
    if (this._running) return

    this._running = true

    this._interval = setInterval(() => {
      const frameEnd =
        this.currentFrameIndex.value >= this.frames.value.length - 1

      if (frameEnd) {
        if (this.$.infinite !== false)
          // eslint-disable-next-line functional/immutable-data
          this.currentFrameIndex.value = 0
        else this.stop()

        return
      }

      // eslint-disable-next-line functional/immutable-data
      this.currentFrameIndex.value++
    }, 1000 / (this.currentFrames.value.frameRate ?? 17))
  }

  public stop(): void {
    if (this._interval) {
      clearInterval(this._interval)
      this._interval = undefined
    }

    this._running = false
  }

  protected getSize() {
    const { width, height } = this.currentFrame.value

    return {
      width,
      height
    }
  }
}
