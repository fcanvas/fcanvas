import "./test/setup-environment"

import { Layer, Stage } from ".."

import { Ellipse } from "./Ellipse"
import { compareLayerWithImage } from "./test/helpers/compareLayerWithImage"

describe("Ellipse", () => {
  // ======================================================
  test("add ellipse", async () => {
    const stage = new Stage({ autoDraw: false })
    const layer = new Layer()
    const ellipse = new Ellipse({
      x: stage.size.width / 2,
      y: stage.size.height / 2,
      radiusX: 70,
      radiusY: 35,
      fill: "green",
      stroke: "black",
      strokeWidth: 8
    })
    layer.add(ellipse)
    stage.add(layer)
    layer.draw()

    expect(await compareLayerWithImage(layer, "ellipse.png")).toBe(true)
  })

  // ======================================================
  test("attrs sync", () => {
    const stage = new Stage({ autoDraw: false })
    const layer = new Layer()
    const ellipse = new Ellipse({
      x: stage.size.width / 2,
      y: stage.size.height / 2,
      radiusX: 70,
      radiusY: 35,
      fill: "green",
      stroke: "black",
      strokeWidth: 8
    })
    layer.add(ellipse)
    stage.add(layer)

    expect(ellipse.clientRect).toEqual({
      x: -74,
      y: -39,
      width: 148,
      height: 78
    })

    ellipse.$.radiusX = 75
    ellipse.$.radiusY = 40

    expect(ellipse.clientRect).toEqual({
      width: 158,
      height: 88,
      x: -79,
      y: -44
    })
  })
})
