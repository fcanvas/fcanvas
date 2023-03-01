import { listen, ping, put } from "@fcanvas/communicate"
import {
  CANVAS_ELEMENT,
  RAW_MAP_LISTENERS,
  STORE_EVENTS,
  toRaw,
  watchEffect
} from "fcanvas"
import type { Layer, Stage } from "fcanvas"

import { Code } from "./constants"
import type { createFakeEvent } from "./logic/porters/Event"
import { resolveFakeEvent } from "./logic/porters/Event"

const store = new WeakMap<Stage, MessageChannel>()
export async function portToSelf(stage: Stage) {
  if (store.has(stage)) {
    if (__DEV__)
      console.warn("[fcanvas/worker]: This 'Stage' is already connected.")
    return
  }

  // eslint-disable-next-line functional/no-let
  let channel: MessageChannel
  listen(self, Code.CREATE_CONNECT, () => {
    channel = new MessageChannel()

    store.set(stage, channel)

    return {
      return: channel.port2,
      transfer: [channel.port2]
    }
  })
  listen(self, Code.SETUP_DONE, () => {
    const storeLayers = new Map<string, Layer>()
    channel.port1.start()

    watchEffect(() => {
      const value = Array.from(stage.children.values()).reduce(
        (r, layer) => {
          storeLayers.set(layer.uid, layer)
          r[layer.uid] = {
            $: toRaw(layer.$),
            width: layer[CANVAS_ELEMENT].width,
            height: layer[CANVAS_ELEMENT].height
          }
          return r
        },
        {} as Record<
          string,
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
      // eslint-disable-next-line promise/catch-or-return
      put(channel.port1, "update_layer", value).then(
        (value: Record<string, OffscreenCanvas>) => {
          Object.entries(value).forEach(([uid, off]) => {
            const layer = storeLayers.get(uid)
            if (!layer) return

            layer[CANVAS_ELEMENT] = off
            layer.markChange()
          })
          console.log("layers in worker: ", storeLayers, value)
          // eslint-disable-next-line no-useless-return
          return
        }
      )
    })

    listen(
      channel.port1,
      "emit_event",
      (value: {
        name: string
        event: ReturnType<typeof createFakeEvent>
        info: Record<
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
      }) => {
        const { name, event, info } = value

        const ev = resolveFakeEvent(channel.port1, event)
        Object.assign(ev, { info })

        stage[STORE_EVENTS].get(name)?.handle(ev as unknown as Event)

        console.log("emit event '%s': ", name, ev, stage)
      }
    )

    watchEffect(() => {
      const value: {
        name: string
        offs: string[]
        prevent: boolean
      }[] = []

      stage[STORE_EVENTS].forEach((_, eventName) => {
        const offs: string[] = []
        // eslint-disable-next-line functional/no-let
        let prevent = false
        for (const dep of _.deps.values()) {
          const els = stage[RAW_MAP_LISTENERS].get(dep)?.keys()

          if (!els) continue

          for (const el of els) {
            if (el === stage) continue

            if (!prevent) prevent = true
            offs.push((el as Layer).uid)
          }
        }

        value.push({
          name: eventName,
          offs,
          prevent
        })
      })
      // Array.from(stage[STORE_HANDLE].keys())

      console.log({ value })

      ping(channel.port1, "listen_events", value)
    })
  })
}
