import type { ComputedRef, Ref } from "@vue/reactivity"
import { computed, ref } from "@vue/reactivity"
import { watch } from "src/fns/watch"

import { Shape } from "../Shape"
import { getImage } from "../auto-export"
import { cropImage } from "../fns/cropImage"
import { SCOPE } from "../symbols"
import type { CommonShapeAttrs } from "../type/CommonShapeAttrs"
import type { TorFnT } from "../type/TorFnT"
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

  private readonly _image: ComputedRef<CanvasImageSource>
  private readonly cropImageCache: Map<
    string,
    HTMLCanvasElement | OffscreenCanvas
  > = new Map()

  private readonly currentFrames: ComputedRef<
    Required<Exclude<AnimationFrames, string[]>>
  >

  private readonly frames: ComputedRef<(HTMLCanvasElement | OffscreenCanvas)[]>
  public readonly currentFrameIndex: Ref<number>
  public readonly currentFrame: ComputedRef<HTMLCanvasElement | OffscreenCanvas>

  private readonly currentDelay: ComputedRef<number>

  private _running = false
  private _timeout?: ReturnType<typeof setInterval>

  constructor(
    attrs: TorFnT<
      ReactiveType<
        CommonShapeAttrs<LocalPersonalAttrs> & {
          animation: keyof LocalPersonalAttrs["animations"]
        }
      >,
      Sprite<Animations, LocalPersonalAttrs>
    >
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super(attrs as unknown as any)

    this[SCOPE].fOn()

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
    this.frames = computed<(HTMLCanvasElement | OffscreenCanvas)[]>(() => {
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
    this.currentFrame = computed<HTMLCanvasElement | OffscreenCanvas>(() => {
      return (
        this.frames.value[this.currentFrameIndex.value] ??
        this.frames.value[
          this.$.infinite !== true ? 0 : this.frames.value.length - 1
        ]
      )
    })
    this.currentDelay = computed(
      () => 1000 / this.currentFrames.value.frameRate
    )

    this[SCOPE].fOff()
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
  ): HTMLCanvasElement | OffscreenCanvas {
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
        if (this.$.infinite !== false) {
          this.currentFrameIndex.value = 0
        } else {
          this.stop()
          return
        }
      } else {
        this.currentFrameIndex.value++
      }

      this._timeout = setTimeout(looper, this.currentDelay.value)
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
    if (!this.currentFrame) {
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
