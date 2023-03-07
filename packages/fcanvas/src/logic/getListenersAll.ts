import type { APIGroup } from "src/apis/APIGroup"

import type { Layer, Stage } from ".."
import { CHILD_NODE, LISTENERS } from ".."

export type MapListeners = Map<
  string,
  /**
   * so Set because in Layer exists children for Set item. in children LISTENERS is Map<name, Set<func>>
   */ Map<
    Layer | Stage,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Map<Stage | APIGroup<any, any>, Set<(event: Event) => void>>
  >
>

function getListenersAll(
  stage: Stage,
  allListeners: MapListeners,
  isStage: true
): MapListeners
// eslint-disable-next-line no-redeclare
function getListenersAll(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stage: APIGroup<any, any>,
  allListeners: MapListeners,
  isStage: false,
  layer: Layer
): MapListeners
// eslint-disable-next-line no-redeclare
function getListenersAll(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stage: Stage | APIGroup<any, any>,
  allListeners: MapListeners,
  isStage: boolean,
  layer?: Layer
) {
  const key = (isStage ? stage : layer) as Stage | Layer
  stage[LISTENERS]?.forEach((listeners, name) => {
    // eslint-disable-next-line functional/no-let
    let map = allListeners.get(name as string)
    if (!map) allListeners.set(name as string, (map = new Map()))
    // eslint-disable-next-line functional/no-let
    let set = map.get(key)
    if (!set) map.set(key, (set = new Map()))
    set.set(stage, listeners)
  })
  stage[CHILD_NODE]?.forEach((layer) => {
    getListenersAll(layer, allListeners, false, isStage ? layer : stage)
  })

  return allListeners
}

export { getListenersAll }
