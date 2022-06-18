import type { Group } from "../Group"
import type { Layer } from "../Layer"

export function setNeedReloadParentTrue(parents: Set<Layer | Group>) {
  parents.forEach((parent) => {
    // eslint-disable-next-line functional/immutable-data
    parent.currentNeedReload = true

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((parent as any).parents)
      setNeedReloadParentTrue((parent as Group).parents)
  })
}
