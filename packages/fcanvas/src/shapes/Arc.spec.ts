import "./test/setup-environment"

import { describe, expect, test } from "vitest"

import { Layer } from "../Layer"
import { Stage } from "../Stage"

import { Arc } from "./Arc"
import { compareLayerWithImage } from "./test/helpers/compareLayerWithImage"
import { CANVAS_ELEMENT } from "../symbols"

describe("Arc", () => {
  test("add arc", async () => {
    const stage = new Stage({ autoDraw: false })
    const layer = new Layer()
    const arc = new Arc({
      x: 100,
      y: 100,
      innerRadius: 50,
      outerRadius: 80,
      angle: 90,
      fill: "green",
      stroke: "black",
      strokeWidth: 4
    })

    layer.add(arc)
    stage.add(layer)

    layer.draw()

    expect(
      await compareLayerWithImage(layer, "arc_50-80_fill:green.png")
    ).toEqual(true)
  })

  test("getSelfRect", () => {
    const stage = new Stage({ autoDraw: false })
    const layer = new Layer()
    const arc = new Arc({
      x: 100,
      y: 100,
      innerRadius: 50,
      outerRadius: 80,
      angle: 90,
      fill: "green",
      stroke: "black",
      strokeWidth: 4
    })

    layer.add(arc)
    stage.add(layer)

    expect(arc.getBoundingClientRect()).toEqual({
      width: 164,
      height: 164,
      x: -82,
      y: -82
    })
  })

  test("getSelfRect on clockwise", () => {
    const stage = new Stage({ autoDraw: false })
    const layer = new Layer()
    const arc = new Arc({
      x: 100,
      y: 100,
      innerRadius: 50,
      outerRadius: 80,
      angle: 90,
      fill: "green",
      stroke: "black",
      strokeWidth: 4,
      clockwise: true
    })

    layer.add(arc)
    stage.add(layer)

    expect(arc.getBoundingClientRect()).toEqual({
      width: 164,
      height: 164,
      x: -82,
      y: -82
    })
  })
})
