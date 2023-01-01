import type { BoxClientRect } from "../logic/isBoxClientRect"
import { BOUNDING_CLIENT_RECT } from "../symbols"

import { haveIntersection } from "./haveIntersection"

function createBox(x: number, y: number, width: number, height: number): BoxClientRect {
  return {
    [BOUNDING_CLIENT_RECT]: {
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
