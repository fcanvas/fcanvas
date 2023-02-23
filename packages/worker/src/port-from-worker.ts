import type { Layer, Stage } from "fcanvas"
import { CANVAS_ELEMENT, toRaw, watchEffect } from "fcanvas"

import { Code } from "./constants"
import { getMessage } from "./logic/com-worker"

const store = new WeakMap<Stage, MessageChannel>()
export async function portToSelf(stage: Stage) {
  if (store.has(stage)) {
    if (__DEV__)
      console.warn("[fcanvas/worker]: This 'Stage' is already connected.")
    return
  }

  // eslint-disable-next-line functional/no-let
  let channel: MessageChannel
  getMessage((data: { type: Code }) => {
    if (data.type === Code.CREATE_CONNECT) {
      channel = new MessageChannel()
      store.set(stage, channel)

      return {
        re: channel.port2,
        transfer: [channel.port2]
      }
    }
    if (data.type === Code.SETUP_DONE) {
      const storeLayers = new Map<string, Layer>()
      channel.port1.onmessage = (
        event: MessageEvent<{
          type: "layer_offscreen"
          value: Record<string, OffscreenCanvas>
        }>
      ) => {
        if (event.data.type === "layer_offscreen") {
          Object.entries(event.data.value).forEach(([uid, off]) => {
            const layer = storeLayers.get(uid)
            if (!layer) return

            layer[CANVAS_ELEMENT] = off
            layer.markChange()
          })
          console.log("layers in worker: ", storeLayers, event.data.value)
        }
      }

      const value = Array.from(stage.children.values()).reduce(
        (r, layer) => {
          storeLayers.set(layer.uid + "", layer)
          r[layer.uid] = {
            $: toRaw(layer.$),
            width: layer[CANVAS_ELEMENT].width,
            height: layer[CANVAS_ELEMENT].height
          }
          return r
        },
        {} as Record<
          number,
          {
            $: Layer["$"]
            width: number
            height: number
          }
        >
      )
      storeLayers.forEach((layer, uid) => {
        if (!(uid in value)) storeLayers.delete(uid)
      })
      watchEffect(() => {
        channel.port1.postMessage({
          type: "update_layer",
          value
        })
      })
    }
  })
}
