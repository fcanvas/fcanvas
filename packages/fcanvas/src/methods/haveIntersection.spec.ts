import { describe, expect, test } from "vitest"

import { BOUNCE_CLIENT_RECT } from "../symbols"
import type { Rect } from "../type/Rect"

import { haveIntersection } from "./haveIntersection"

interface Box {
  [BOUNCE_CLIENT_RECT]: {
    value: Rect
  }
}
function createBox(x: number, y: number, width: number, height: number): Box {
  return {
    [BOUNCE_CLIENT_RECT]: {
      value: {
        x,
        y,
        width,
        height
      }
    }
  }
}

describe("haveIntersection", () => {
  const box1 = createBox(0, 0, 120, 50)

  test("haveIntersection(a, b)", () => {
    expect(haveIntersection(box1, createBox(10, 10, 125, 23))).toEqual(true)
  })
  test("box intersection on border", () => {
    expect(haveIntersection(box1, createBox(120, 50, 125, 23))).toEqual(true)
  })
  test("box not intersection", () => {
    expect(haveIntersection(box1, createBox(120, 51, 125, 23))).toEqual(false)
  })
})
