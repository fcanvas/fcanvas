import { describe, test, expect } from "vitest"
import { Layer } from "./Layer"
import { Stage } from "./Stage"
import { CANVAS_ELEMENT } from "./symbols"

describe("Layer", () => {
  test("auto resize by stage", () => {
    const stage = new Stage({
      width: 300,
      height: 300
    })
    const layer = new Layer()

    expect(layer[CANVAS_ELEMENT].width).toEqual(300)
    expect(layer[CANVAS_ELEMENT].height).toEqual(150)

    stage.add(layer)

    expect(layer[CANVAS_ELEMENT].width).toEqual(300)
    expect(layer[CANVAS_ELEMENT].height).toEqual(300)
  })
})
