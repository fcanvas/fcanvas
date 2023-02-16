import { EffectScope, getCurrentScope } from "@vue/reactivity"

export function effectScopeFlat(detached?: boolean) {
  const effect = new EffectScope(detached) as unknown as {
    active: boolean
    parent?: EffectScope
    on: () => void
    off: () => void
    stop: () => void

    fOn: () => void
    fOff: () => void
  }

  // eslint-disable-next-line functional/no-let
  let currentEffectScope: EffectScope | undefined
  effect.fOn = () => {
    if (!effect.active) return

    currentEffectScope = getCurrentScope()
    effect.on()
  }
  effect.fOff = () => {
    const { parent } = effect

    effect.parent = currentEffectScope
    effect.off()
    effect.parent = parent
  }

  return effect as Omit<typeof effect, "on" | "off">
}
