// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../node_modules/typescript/lib/lib.dom.d.ts" />
/* eslint-env browser */

import { listen, ping, put } from "@fcanvas/communicate"
import type { Stage } from "fcanvas"
import { ADD_EVENT, CANVAS_ELEMENT, Layer, REMOVE_EVENT } from "fcanvas"

import { Code } from "./constants"
import { createFakeEvent } from "./logic/porters/Event"

const store = new WeakMap<Stage, boolean>()
export async function portToWorker(worker: Worker, stage: Stage) {
  if (store.has(stage)) {
    if (__DEV__)
      console.warn("[fcanvas/worker]: This 'Stage' is already connected.")
    return
  }

  const port2 = await put(worker, Code.CREATE_CONNECT)
  port2.start()

  if (__DEV_LIB__) console.log("[fcanvas/worker]: Connected")

  const storeLayers = new Map<string, Layer>()
  // eslint-disable-next-line func-call-spacing
  const listenEvents = new Map<string, (event: Event) => void>()
  listen(
    port2,
    "update_layer",
    (
      value: Record<
        number,
        {
          $: Layer["$"]
          width: number
          height: number
        }
      >
    ) => {
      storeLayers.forEach((layer, uid) => {
        if (!(uid in value)) {
          storeLayers.delete(uid)
          stage.delete(layer)
        }
      })
      // layer info
      const offscreens: Record<string, OffscreenCanvas> = {}
      const offs: OffscreenCanvas[] = []
      Object.entries(value).forEach(([uid, item]) => {
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
        // force update uid
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(layer as unknown as any).uid = uid
        storeLayers.set(uid, layer)
        stage.add(layer)

        offs.push(
          (offscreens[uid] = (
            layer[CANVAS_ELEMENT] as HTMLCanvasElement
          ).transferControlToOffscreen())
        )
      })

      if (__DEV__) console.log("layers: ", storeLayers)
      return {
        return: offscreens,
        transfer: offs
      }
    }
  )
  listen(
    port2,
    "listen_events",
    (
      value: {
        name: string
        offs: string[]
        prevent: boolean
      }[]
    ) => {
      listenEvents.forEach((cb, name) => {
        if (value.some((item) => item.name === name)) {
          listenEvents.delete(name)
          stage[REMOVE_EVENT](name, cb)
        }
      })
      value.forEach(({ name, offs, prevent }) => {
        if (listenEvents.has(name)) return
        listenEvents.set(name, handle)
        stage[ADD_EVENT](name, handle)

        function handle(event: Event) {
          if (prevent) event.preventDefault()

          ping(port2, "emit_event", {
            name: event.type,
            event: createFakeEvent(port2, event),
            info: offs.reduce(
              (r, uid) => {
                const layer = storeLayers.get(uid)
                if (!layer) {
                  if (__DEV__) {
                    console.warn(
                      "[@fcanvas/worker]: Layer '%s' not found.",
                      uid
                    )
                  }
                  return r
                }

                const el = layer[CANVAS_ELEMENT] as HTMLCanvasElement
                const { left, top } = el.getBoundingClientRect()
                const { width, height, scrollWidth, scrollHeight } = el

                r[uid] = { left, top, width, height, scrollWidth, scrollHeight }

                return r
              },
              {} as Record<
                string,
                {
                  left: number
                  top: number
                  width: number
                  height: number
                  scrollWidth: number
                  scrollHeight: number
                }
              >
            )
          })
        }
      })
    }
  )

  await put(worker, Code.SETUP_DONE)
}
