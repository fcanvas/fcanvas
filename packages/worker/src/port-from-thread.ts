// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../node_modules/typescript/lib/lib.dom.d.ts" />
/* eslint-env browser */

import type { Stage } from "fcanvas"
import { CANVAS_ELEMENT, Layer } from "fcanvas"

import { Code } from "./constants"
import { putMessage } from "./logic/com-main"

const store = new WeakMap<Stage, boolean>()
export async function portToWorker(worker: Worker, stage: Stage) {
  if (store.has(stage)) {
    if (__DEV__)
      console.warn("[fcanvas/worker]: This 'Stage' is already connected.")
    return
  }

  const port2 = await putMessage<
    MessagePort,
    {
      type: Code
    }
  >(worker, {
    type: Code.CREATE_CONNECT
  })
  if (__DEV__) console.log("[fcanvas/worker]: Connected")

  const storeLayers = new Map<string, Layer>()
  port2.onmessage = (
    event: MessageEvent<{
      type: "update_layer"
      value: Record<
        number,
        {
          $: Layer["$"]
          width: number
          height: number
        }
      >
    }>
  ) => {
    if (event.data.type === "update_layer") {
      storeLayers.forEach((layer, uid) => {
        if (!(uid in event.data.value)) {
          storeLayers.delete(uid)
          stage.delete(layer)
        }
      })
      // layer info
      const offscreens: Record<string, OffscreenCanvas> = {}
      const offs: OffscreenCanvas[] = []
      Object.entries(event.data.value).forEach(([uid, item]) => {
        const layerExists = storeLayers.get(uid)
        if (layerExists) {
          Object.assign(layerExists.$, {
            ...item.$,
            width: item.width,
            height: item.height
          })

          return
        }

        const layer = new Layer({
          ...item.$,
          autoDraw: false,
          width: item.width,
          height: item.height
        })
        storeLayers.set(uid, layer)
        stage.add(layer)

        offs.push(
          (offscreens[uid] = (layer[CANVAS_ELEMENT] as HTMLCanvasElement).transferControlToOffscreen())
        )
      })
      port2.postMessage(
        {
          type: "layer_offscreen",
          value: offscreens
        },
        offs
      )
      console.log("layers: ", storeLayers)
    }
  }

  await putMessage(worker, { type: Code.SETUP_DONE })
}
