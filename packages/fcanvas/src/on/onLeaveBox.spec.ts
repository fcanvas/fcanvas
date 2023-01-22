import "../shapes/test/setup-environment"

import { Layer, Rect } from ".."
import { Stage } from "../Stage"

import { onLeaveBox } from "./onLeaveBox"

describe("onLeaveBox", () => {
  describe("not immediate", () => {
    test("start within box", async () => {
      const stage = new Stage({ width: 200, height: 200 })

      const layer = new Layer()
      stage.add(layer)

      const rect = new Rect({ x: 200, y: 200 - 30, width: 30, height: 30 })
      layer.add(rect)

      // eslint-disable-next-line functional/no-let
      let entered = false
      onLeaveBox(rect, stage, () => {
        entered = true
      })

      expect(entered).toEqual(false)
      rect.$.x++
      await Promise.resolve()
      expect(entered).toEqual(true)
    })
    test("start without box", async () => {
      const stage = new Stage({ width: 200, height: 200 })

      const layer = new Layer()
      stage.add(layer)

      const rect = new Rect({ x: 201, y: 200 - 30, width: 30, height: 30 })
      layer.add(rect)

      // eslint-disable-next-line functional/no-let
      let entered = false
      onLeaveBox(rect, stage, () => {
        entered = true
      })

      expect(entered).toEqual(false)
      rect.$.x++
      await Promise.resolve()
      expect(entered).toEqual(true)
    })
  })
  describe("immediate", () => {
    test("start within box", async () => {
      const stage = new Stage({ width: 200, height: 200 })

      const layer = new Layer()
      stage.add(layer)

      const rect = new Rect({ x: 200, y: 200 - 30, width: 30, height: 30 })
      layer.add(rect)

      // eslint-disable-next-line functional/no-let
      let entered = false
      onLeaveBox(
        rect,
        stage,
        () => {
          entered = true
        },
        { immediate: true }
      )

      expect(entered).toEqual(false)
      rect.$.x++
      await Promise.resolve()
      expect(entered).toEqual(true)
    })
    test("start without box", async () => {
      const stage = new Stage({ width: 200, height: 200 })

      const layer = new Layer()
      stage.add(layer)

      const rect = new Rect({ x: 201, y: 200 - 30, width: 30, height: 30 })
      layer.add(rect)

      // eslint-disable-next-line functional/no-let
      let entered = false
      onLeaveBox(
        rect,
        stage,
        () => {
          entered = true
        },
        { immediate: true }
      )

      await Promise.resolve()

      expect(entered).toEqual(true)
      rect.$.x--
      expect(entered).toEqual(true)
    })
    test("call once only", async () => {
      const stage = new Stage({ width: 200, height: 200 })

      const layer = new Layer()
      stage.add(layer)

      const rect = new Rect({ x: 201, y: 200 - 30, width: 30, height: 30 })
      layer.add(rect)

      const fn = vi.fn()
      onLeaveBox(rect, stage, fn, { immediate: true })
      rect.$.x--
      await Promise.resolve()
      rect.$.x--
      await Promise.resolve()

      expect(fn.mock.calls.length).toBe(1)
    })
  })
})
