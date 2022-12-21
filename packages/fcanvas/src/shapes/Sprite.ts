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
type PersonalAttrs<
  Animations extends Record<string, AnimationFrames | number[]>
> = {
  // eslint-disable-next-line no-undef
  image: CanvasImageSource | string
  animations: Animations
  animation: string
  frameIndex?: number // 0
  frameRate?: number // 17
  infinite?: boolean // true
}

export class Sprite<
  Animations extends Record<string, AnimationFrames | number[]>,
  LocalPersonalAttrs extends PersonalAttrs<Animations>
> extends Shape<LocalPersonalAttrs> {
  static readonly type = "Sprite"

  // eslint-disable-next-line no-undef
  private readonly _image: ComputedRef<CanvasImageSource>
  private readonly cropImageCache: Map<string, HTMLCanvasElement> = new Map()
  private readonly currentFrames: ComputedRef<
    Required<Exclude<AnimationFrames, string[]>>
  >

  private readonly frames: ComputedRef<HTMLCanvasElement[]>
  private readonly currentFrameIndex: Ref<number>
  private readonly currentFrame: ComputedRef<HTMLCanvasElement>

  private _running = false
  private _timeout?: ReturnType<typeof setInterval>

  constructor(
    attrs: ReactiveType<
      CommonShapeAttrs<LocalPersonalAttrs> & {
        animation: keyof LocalPersonalAttrs["animations"]
      } & {
        setup?: (
          attrs: ReturnType<
            typeof reactive<CommonShapeAttrs<LocalPersonalAttrs>>
          >
        ) => void
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } & ThisType<Sprite<any, any>>
    >
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super(attrs as unknown as any)

    this[SCOPE].on()

    // eslint-disable-next-line no-undef
    this._image = computed<CanvasImageSource>(() => {
      const { image } = this.$

      if (typeof image === "string") return getImage(image)

      return image
    })
    this.currentFrames = computed<Required<Exclude<AnimationFrames, string[]>>>(
      () => {
        const frames = this.$.animations[this.$.animation]

        if (Array.isArray(frames)) {
          return {
            frames,
            frameIndex: this.$.frameIndex ?? 0,
            frameRate: this.$.frameRate ?? 17
          }
        }

        return {
          frameIndex: this.$.frameIndex ?? 0,
          frameRate: this.$.frameRate ?? 17,
          ...frames
        }
      }
    )
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
    this.currentFrameIndex = ref(this.currentFrames.value.frameIndex)
    watch(
      () => this.currentFrames.value.frameIndex,
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
    return this.$.animation as keyof LocalPersonalAttrs["animations"]
  }

  set animation(value: keyof LocalPersonalAttrs["animations"]) {
    this.$.animation = value as string
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

  public start(anim?: keyof LocalPersonalAttrs["animations"]): void {
    if (this._running) return

    if (anim) this.animation = anim

    this._running = true
    clearTimeout(this._timeout)

    const looper = () => {
      const frameEnd =
        this.currentFrameIndex.value >= this.frames.value.length - 1

      if (frameEnd) {
        if (this.$.infinite !== false) this.currentFrameIndex.value = 0
        else this.stop()

        return
      }

      this.currentFrameIndex.value++

      this._timeout = setTimeout(
        looper,
        1000 / this.currentFrames.value.frameRate
      )
    }

    // eslint-disable-next-line promise/catch-or-return
    Promise.resolve().then(looper)
  }

  public stop(): void {
    if (this._timeout) {
      clearTimeout(this._timeout)
      this._timeout = undefined
    }

    this._running = false
  }

  protected getSize() {
    if (!this.currentFrame.value) {
      const anim = this.$.animations[this.$.animation]

      if (Array.isArray(anim)) {
        // default
        const frames = anim
        const { frameIndex = 0 } = this.$

        return {
          width: frames[frameIndex * 4 + 2],
          height: frames[frameIndex * 4 + 2]
        }
      } else {
        const { frames, frameIndex = this.$.frameIndex ?? 0 } = anim

        return {
          width: frames[frameIndex * 4 + 2],
          height: frames[frameIndex * 4 + 2]
        }
      }
    }

    const { width, height } = this.currentFrame.value

    return {
      width,
      height
    }
  }
}
