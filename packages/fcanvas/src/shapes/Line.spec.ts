/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import "./test/setup-environment"

import { Layer, Line, Stage } from ".."

import { compareLayerWithImage } from "./test/helpers/compareLayerWithImage"

describe("Line", () => {
  // ======================================================
  test("add Line", async () => {
    const stage = new Stage({ autoDraw: false, width: 320 })
    const layer = new Layer().addTo(stage)

    const redLine = new Line({
      points: [5, 70, 140, 23, 250, 60, 300, 20],
      stroke: "red",
      strokeWidth: 15,
      lineCap: "round",
      lineJoin: "round"
    }).addTo(layer)
    // dashed line
    const greenLine = new Line({
      points: [5, 70, 140, 23, 250, 60, 300, 20],
      stroke: "green",
      strokeWidth: 2,
      lineJoin: "round",
      /*
       * line segments with a length of 33px
       * with a gap of 10px
       */
      dash: [33, 10]
    }).addTo(layer)
    // complex dashed and dotted line
    const blueLine = new Line({
      points: [5, 70, 140, 23, 250, 60, 300, 20],
      stroke: "blue",
      strokeWidth: 10,
      lineCap: "round",
      lineJoin: "round",
      /*
       * line segments with a length of 29px with a gap
       * of 20px followed by a line segment of 0.001px (a dot)
       * followed by a gap of 20px
       */
      dash: [29, 20, 0.001, 20]
    }).addTo(layer)

    layer.draw()
    // await nextTick()

    expect(await compareLayerWithImage(layer, "line.png"))
    // save(layer, "line")
  })

  // ======================================================
  test("add Line-Blob", async () => {
    const stage = new Stage({ autoDraw: false, width: 320 })
    const layer = new Layer().addTo(stage)

    const blob = new Line({
      points: [23, 20, 23, 160, 70, 93, 150, 109, 290, 139, 270, 93],
      fill: "#00D2FF",
      stroke: "black",
      strokeWidth: 5,
      closed: true,
      tension: 0.3
    }).addTo(layer)

    layer.draw()
    // await nextTick()

    expect(await compareLayerWithImage(layer, "line-blob.png"))
    // save(layer, "line-blob")
  })

  // ======================================================
  test("add Line-Polygon", async () => {
    const stage = new Stage({ autoDraw: false, width: 320 })
    const layer = new Layer().addTo(stage)

    const poly = new Line({
      points: [23, 20, 23, 160, 70, 93, 150, 109, 290, 139, 270, 93],
      fill: "#00D2FF",
      stroke: "black",
      strokeWidth: 5,
      closed: true
    }).addTo(layer)

    layer.draw()
    // await nextTick()

    expect(await compareLayerWithImage(layer, "line-polygon.png"))
    // save(layer, "line-polygon")
  })

  // ======================================================
  test("add Line-Spline", async () => {
    const stage = new Stage({ autoDraw: false, width: 320 })
    const layer = new Layer().addTo(stage)

    const redLine = new Line({
      points: [5, 70, 140, 23, 250, 60, 300, 20],
      stroke: "red",
      strokeWidth: 15,
      lineCap: "round",
      lineJoin: "round",
      tension: 1
    }).addTo(layer)
    // dashed line
    const greenLine = new Line({
      points: [5, 70, 140, 23, 250, 60, 300, 20],
      stroke: "green",
      strokeWidth: 2,
      lineJoin: "round",
      /*
       * line segments with a length of 33px
       * with a gap of 10px
       */
      dash: [33, 10],
      lineCap: "round",
      tension: 0.5
    }).addTo(layer)
    // complex dashed and dotted line
    const blueLine = new Line({
      points: [5, 70, 140, 23, 250, 60, 300, 20],
      stroke: "blue",
      strokeWidth: 10,
      lineCap: "round",
      lineJoin: "round",
      /*
       * line segments with a length of 29px with a gap
       * of 20px followed by a line segment of 0.001px (a dot)
       * followed by a gap of 20px
       */
      dash: [29, 20, 0.001, 20],
      tension: 0.7
    }).addTo(layer)

    layer.draw()
    // await nextTick()

    expect(await compareLayerWithImage(layer, "line-spline.png"))
    // save(layer, "line-spline")
  })
})
