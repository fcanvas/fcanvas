import type { ComputedRef } from "fcanvas"
import { computed, effectScopeFlat, SCOPE } from "fcanvas"
import gsap from "gsap"

import { ANIMATION_STORE } from "./symbols"

type Keyframes<Props extends Record<string, unknown>> = Partial<
  Record<"from" | "to" | `${number}%`, Partial<Props>>
>
export type AnimationP<Props extends Record<string, unknown>> = Record<
  string,
  {
    keyframes: Keyframes<Props>
    duration: number
    delay?: number
    ease?: gsap.EaseFunction | string
    release?: boolean
    reverse?: boolean
    repeat?: number
  }
>

export class Animation<Props extends Record<string, unknown>> {
  private readonly [ANIMATION_STORE]: ComputedRef<
    Readonly<Map<string, gsap.core.Tween>>
  >

  private readonly [SCOPE] = effectScopeFlat()

  constructor(
    attrs: Props & {
      animate: AnimationP<Omit<Props, "animation">>
    }
  ) {
    this[SCOPE].fOn()
    // create gsap to ANIMATION_STORE
    this[ANIMATION_STORE] = computed<Readonly<Map<string, gsap.core.Tween>>>(
      () => {
        const store = new Map<string, gsap.core.Tween>()

        for (const name in attrs.animate) {
          const animation = attrs.animate[name]
          const anim = gsap.to(attrs, {
            keyframes: animation.keyframes,
            duration: animation.duration,
            delay: animation.delay,
            ease: animation.ease,
            repeat: animation.repeat,

            paused: true,
            reversed: animation.reverse,
            onComplete() {
              if (animation.release !== false) anim.restart().pause()
            }
          })
          store.set(name, anim)
        }

        return store
      }
    )
    this[SCOPE].fOff()
  }

  public start(name: string): gsap.core.Tween {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const tween = this[ANIMATION_STORE].value.get(name)!

    tween.play()

    return tween
  }

  public stop(name: string): gsap.core.Tween {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const tween = this[ANIMATION_STORE].value.get(name)!

    tween.pause()

    return tween
  }

  public destroy() {
    this[SCOPE].stop()
  }
}
