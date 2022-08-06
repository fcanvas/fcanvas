import "./test/setup-environment"

import { describe, expect, test } from "vitest"

import { Layer } from "../Layer"
import { Stage } from "../Stage"

import { Arrow } from "./Arrow"
import { compareLayerWithImage } from "./test/helpers/compareLayerWithImage"

describe("Arrow", () => {
  test("do not draw dash for head", async () => {
    const stage = new Stage({ autoDraw: false })
    const layer = new Layer()

    const arrow = new Arrow({
      x: 100,
      y: 100,
      points: [50, 50, 100, 100],
      stroke: "red",
      fill: "blue",
      strokeWidth: 5,
      pointerWidth: 20,
      pointerLength: 20,
      dash: [5, 5]
    })

    layer.add(arrow)
    stage.add(layer)

    layer.draw()

    expect(await compareLayerWithImage(layer, "arrow_red.png")).toEqual(true)
  })

  test("pointer on both directions", async () => {
    const stage = new Stage({ autoDraw: false })
    const layer = new Layer()

    const arrow = new Arrow({
      x: 0,
      y: 0,
      points: [50, 50, 100, 100],
      stroke: "red",
      strokeWidth: 5,
      pointerWidth: 20,
      pointerLength: 20,
      pointerAtBeginning: true,
      pointerAtEnding: true,
      opacity: 0.5
    })

    layer.add(arrow)
    stage.add(layer)

    layer.draw()

    expect(
      await compareLayerWithImage(layer, "arrow_pointer_both.png")
    ).toEqual(true)
  })

  test("dash checks", async () => {
    const stage = new Stage({ autoDraw: false })

    const layer = new Layer({
      width: 300,
      height: 300
    })
    stage.add(layer)

    const width = stage.size.width
    const height = stage.size.height

    // regular line
    const arrow = new Arrow({
      x: stage.size.width / 4,
      y: stage.size.height / 4,
      points: [0, 0, width / 2, height / 2],
      pointerLength: 20,
      pointerWidth: 20,
      fill: "red",
      stroke: "red",
      strokeWidth: 4,
      dash: [10, 5]
    })
    layer.add(arrow)

    // arrow with no end (like a simple line)
    const arrowNoEnd = new Arrow({
      x: stage.size.width / 4 + 50,
      y: stage.size.height / 4,
      points: [0, 0, width / 2, height / 2],
      pointerLength: 20,
      pointerWidth: 20,
      pointerAtEnding: false,
      fill: "blue",
      stroke: "blue",
      strokeWidth: 4,
      dash: [10, 5]
    })
    layer.add(arrowNoEnd)

    const arrowStartButNoEnd = new Arrow({
      x: stage.size.width / 4 + 100,
      y: stage.size.height / 4,
      points: [0, 0, width / 2, height / 2],
      pointerLength: 20,
      pointerWidth: 20,
      pointerAtEnding: false,
      pointerAtBeginning: true,
      fill: "green",
      stroke: "green",
      strokeWidth: 4,
      dash: [10, 5]
    })
    layer.add(arrowStartButNoEnd)
    layer.draw()

    expect(await compareLayerWithImage(layer, "arrow_dash_checks.png")).toEqual(
      true
    )
  })

  test("direction with tension", async () => {
    const stage = new Stage({ autoDraw: false })
    const layer = new Layer()

    const arrow = new Arrow({
      x: 0,
      y: 0,
      points: [50, 50, 100, 50, 100, 100],
      stroke: "red",
      fill: "red",
      tension: 1,
      pointerAtBeginning: true
    })

    layer.add(arrow)
    stage.add(layer)

    layer.draw()

    expect(
      await compareLayerWithImage(layer, "arrow_direction_tension.png")
    ).toEqual(true)
  })

  test("direction with tension 2", async () => {
    const stage = new Stage({ autoDraw: false })
    const layer = new Layer()

    const arrow = new Arrow({
      x: 0,
      y: 0,
      points: [
        79.57486136783733, 63.27171903881701, 87.33826247689463,
        80.73937153419593, 124.99075785582254, 82.29205175600738,
        141.68207024029573, 107.52310536044362, 165.74861367837337,
        104.80591497227356
      ],
      stroke: "red",
      fill: "red",
      tension: 1,
      pointerWidth: 10,
      pointerAtBeginning: true
    })

    layer.add(arrow)
    stage.add(layer)

    layer.draw()

    expect(
      await compareLayerWithImage(layer, "arrow_direction_tension_2.png")
    ).toEqual(true)
  })
})
