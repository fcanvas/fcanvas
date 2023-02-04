import { Group } from "../Group"
import { Circle } from "../shapes/Circle"
import { Rect } from "../shapes/Rect"

import { onCollide } from "./onCollide"
import { withChild } from "./withChild"

const sizeRect = { width: 10, height: 10 }
const sizeCircle = { radius: 10 }

const rect = new Rect({ x: 0, y: 0, ...sizeRect })
const circle = new Circle({ x: 0, y: 0, ...sizeCircle })

const pointInRect = { x: 9, y: 9 }

const rectRawInRect = { ...pointInRect, ...sizeRect }
const rectInRect = new Rect(rectRawInRect)

const circleRawInRect = { ...pointInRect, ...sizeCircle }
const circleInRect = new Circle(circleRawInRect)

const pointInCircle = { x: 4, y: 4 }

const rectRawInCircle = { ...pointInCircle, ...sizeRect }
const rectInCircle = new Rect(rectRawInCircle)

const circleRawInCircle = { ...pointInCircle, ...sizeCircle }
const circleInCircle = new Circle(circleRawInCircle)

describe("onCollide", () => {
  test("realtime", () => {
    const rect2 = new Rect({ x: 11, y: 11, ...sizeRect })
    const fn = vi.fn()

    onCollide(rect, rect2, fn)

    expect(fn.mock.calls.length).toBe(0)

    rect2.$.x -= 1
    rect2.$.y -= 1

    expect(fn.mock.calls.length).toBe(1)
    expect(fn.mock.calls[0][0]).toBe(rect2)
  })

  // eslint-disable-next-line functional/no-let
  let fn: ReturnType<typeof vi.fn>
  beforeEach(() => (fn = vi.fn()))

  function testInside(t: unknown) {
    expect(fn.mock.calls.length).toBe(1)
    expect(fn.mock.lastCall?.[0]).toBe(t)
  }

  describe("1 is rect", () => {
    describe("2 is object", () => {
      test("2 is point", () => {
        onCollide(rect, pointInRect, fn)
        testInside(pointInRect)
      })
      test("2 is rect", () => {
        onCollide(rect, rectInRect, fn)
        testInside(rectInRect)
      })
      test("2 is rect raw", () => {
        onCollide(rect, rectRawInRect, fn)
        testInside(rectRawInRect)
      })
      test("2 is circle", () => {
        onCollide(rect, circleInRect, fn)
        testInside(circleInRect)
      })
      test("2 is circle raw", () => {
        onCollide(rect, circleRawInRect, fn)
        testInside(circleRawInRect)
      })
    })
    describe("2 is array", () => {
      test("2 is point", () => {
        onCollide(rect, [pointInRect], fn)
        testInside(pointInRect)
      })
      test("2 is rect", () => {
        onCollide(rect, [rectInRect], fn)
        testInside(rectInRect)
      })
      test("2 is rect raw", () => {
        onCollide(rect, [rectRawInRect], fn)
        testInside(rectRawInRect)
      })
      test("2 is circle", () => {
        onCollide(rect, [circleInRect], fn)
        testInside(circleInRect)
      })
      test("2 is circle raw", () => {
        onCollide(rect, [circleRawInRect], fn)
        testInside(circleRawInRect)
      })
    })
    test("2 is set", () => {
      onCollide(rect, new Set([pointInRect]), fn)
      testInside(pointInRect)
    })
    test("2 is map", () => {
      onCollide(rect, new Map([["1", pointInRect]]), fn)
      testInside(pointInRect)
    })
  })

  describe("1 is circle", () => {
    describe("2 is object", () => {
      test("2 is point", () => {
        onCollide(circle, pointInCircle, fn)
        testInside(pointInCircle)
      })
      test("2 is rect", () => {
        onCollide(circle, rectInCircle, fn)
        testInside(rectInCircle)
      })
      test("2 is rect raw", () => {
        onCollide(circle, rectRawInCircle, fn)
        testInside(rectRawInCircle)
      })
      test("2 is circle", () => {
        onCollide(circle, circleInCircle, fn)
        testInside(circleInCircle)
      })
      test("2 is circle raw", () => {
        onCollide(circle, circleRawInCircle, fn)
        testInside(circleRawInCircle)
      })
    })
    describe("2 is array", () => {
      test("2 is point", () => {
        onCollide(circle, [pointInCircle], fn)
        testInside(pointInCircle)
      })
      test("2 is rect", () => {
        onCollide(circle, [rectInCircle], fn)
        testInside(rectInCircle)
      })
      test("2 is rect raw", () => {
        onCollide(circle, [rectRawInCircle], fn)
        testInside(rectRawInCircle)
      })
      test("2 is circle", () => {
        onCollide(circle, [circleInCircle], fn)
        testInside(circleInCircle)
      })
      test("2 is circle raw", () => {
        onCollide(circle, [circleRawInCircle], fn)
        testInside(circleRawInCircle)
      })
    })
  })
  describe("cancel onCollide", () => {
    test("call canceller", () => {
      const rect2 = new Rect({ x: 11, y: 11, ...sizeRect })
      const fn = vi.fn()

      const watcher = onCollide(rect, rect2, fn)

      expect(fn.mock.calls.length).toBe(0)

      watcher()
      rect2.$.x--
      rect2.$.y--

      expect(fn.mock.calls.length).toBe(0)
    })
    describe("auto cancel if destroy", () => {
      test("destroy 1", () => {
        const rect1 = new Rect({ x: 0, y: 0, ...sizeRect })
        const rect2 = new Rect({ x: 11, y: 11, ...sizeRect })
        const fn = vi.fn()

        onCollide(rect1, rect2, fn)

        expect(fn.mock.calls.length).toBe(0)

        rect1.destroy()
        rect2.$.x--
        rect2.$.y--

        expect(fn.mock.calls.length).toBe(0)
      })
      test("destroy 2", () => {
        const rect1 = new Rect({ x: 0, y: 0, ...sizeRect })
        const rect2 = new Rect({ x: 11, y: 11, ...sizeRect })
        const fn = vi.fn()

        onCollide(rect1, rect2, fn)

        expect(fn.mock.calls.length).toBe(0)

        rect2.destroy()
        rect2.$.x--
        rect2.$.y--

        expect(fn.mock.calls.length).toBe(0)
      })
    })
  })
  test("use withChildren", async () => {
    const group = new Group({ x: 11, y: 11 })
    group.add(new Rect({ x: 0, y: 0, width: 1, height: 1 }))
    group.add(new Rect({ x: 1, y: 1, width: 1, height: 1 }))
    group.add(new Rect({ x: 2, y: 2, width: 1, height: 1 }))

    const fn = vi.fn()

    expect(fn.mock.calls.length).toBe(0)

    group.$.x--
    group.$.y--

    await Promise.resolve()

    onCollide(rect, withChild(group), fn)

    // console.log(fn.mock.calls)
    expect(fn.mock.calls.length).toBe(1)
    expect(fn.mock.calls[0][0]).toEqual({
      x: 10,
      y: 10,
      width: 1,
      height: 1
    })
  })
  test("call only once", async () => {
    const rect2 = new Rect({ x: 11, y: 11, ...sizeRect })
    const fn = vi.fn()

    onCollide(rect, rect2, fn)

    expect(fn.mock.calls.length).toBe(0)

    rect2.$.x -= 1
    rect2.$.y -= 1

    await new Promise((resolve) => setTimeout(resolve, 1000))

    rect2.$.x--
    rect2.$.y--

    expect(fn.mock.calls.length).toBe(1)
    expect(fn.mock.calls[0][0]).toBe(rect2)
  }, 2_000)
  test("call mutiple if targets", async () => {
    const rect2 = new Rect({ x: 11, y: 11, ...sizeRect })
    const rect3 = new Rect({ x: 11, y: 11, ...sizeRect })
    const fn = vi.fn()

    onCollide(rect, [rect2, rect3], fn)

    expect(fn.mock.calls.length).toBe(0)

    rect2.$.x--
    rect2.$.y--
    await new Promise((resolve) => setTimeout(resolve, 1000))
    rect2.$.x--
    rect2.$.y--

    expect(fn.mock.calls.length).toBe(1)
    expect(fn.mock.calls[0][0]).toBe(rect2)

    rect3.$.x--
    rect3.$.y--
    await new Promise((resolve) => setTimeout(resolve, 1000))
    rect3.$.x--
    rect3.$.y--

    expect(fn.mock.calls.length).toBe(2)
    expect(fn.mock.calls[0][0]).toBe(rect2)
    expect(fn.mock.calls[1][0]).toBe(rect3)
  }, 5_000)
  // mutil call if targets
})
