// @vitest-environment jsdom

import { createCanvas } from "canvas"
import DOMMatrix from "dommatrix"
import { describe, expect, test } from "vitest"

import { CANVAS_ELEMENT, Circle, Group, Layer, Stage } from ".."

import { compareLayerWithImage } from "./test/helpers/compareLayerWithImage"

// eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-explicit-any
;(self as any).DOMMatrix = DOMMatrix

describe("Circle", () => {
  test("add circle to stage", async () => {
    const stage = new Stage({
      autoDraw: false
    })
    const layer = new Layer()
    stage.add(layer)

    layer.add(
      new Circle({
        x: 0,
        y: 0,
        radius: 150,
        stroke: "black"
      })
    )
    layer.draw()

    expect(await compareLayerWithImage(layer, "circle_150_black.png")).toBe(
      true
    )
  })

  test("clone", () => {
    const circle = new Circle({
      x: 0,
      y: 0,
      radius: 50
    })
    const clone = new Circle(circle.$)

    expect(clone instanceof Circle).toEqual(true)
    expect(circle === clone).toEqual(false)
  })

  // test("add circle with pattern fill", async () => {
  //   const image = (await loadImageFromSystem(
  //     "darth-vader.jpg"
  //   )) as unknown as HTMLImageElement

  //   const stage = new Stage({
  //     autoDraw: false
  //   })
  //   const layer = new Layer()
  //   const group = new Group()
  //   const circle = new Circle({
  //     x: stage.size.width / 2,
  //     y: stage.size.height / 2,
  //     radius: 70,
  //     fillPattern: {
  //       image,
  //       offset: {
  //         x: -5,
  //         y: -5
  //       },
  //       scale: {
  //         x: 0.7,
  //         y: 0.7
  //       }
  //     },
  //     stroke: "black",
  //     strokeWidth: 4
  //   })

  //   group.add(circle)
  //   layer.add(group)
  //   stage.add(layer)

  //   layer.draw()

  //   console.log(layer[CANVAS_ELEMENT].toDataURL())
  // })

  test("add circle with radial gradient fill", () => {
    const stage = new Stage()
    const layer = new Layer()

    layer.add(
      new Circle({
        x: stage.size.width / 2,
        y: stage.size.height / 2,
        radius: 70,
        fillRadialGradient: {
          start: { x: -20, y: -20 },
          end: { x: -60, y: -60 },
          startRadius: 0,
          endRadius: 130,
          colorStops: [0, "red", 0.2, "yellow", 1, "blue"]
        },
        scale: {
          x: 0.5,
          y: 0.5
        }
      })
    )

    stage.add(layer)
    layer.draw()

    console.log(layer[CANVAS_ELEMENT].toDataURL())
  })

  return
  // ======================================================
  test("add shape with linear gradient fill", () => {
    const stage = addStage()
    const layer = new Layer()
    const group = new Group()
    const circle = new Circle({
      x: stage.width() / 2,
      y: stage.height() / 2,
      radius: 70,
      fillLinearGradientStartPoint: { x: -35, y: -35 },
      fillLinearGradientEndPoint: { x: 35, y: 35 },
      fillLinearGradientColorStops: [0, "red", 1, "blue"],
      stroke: "black",
      strokeWidth: 4,
      name: "myCircle",
      draggable: true
    })

    group.add(circle)
    layer.add(group)
    stage.add(layer)

    const canvas = createCanvas()
    const ctx = canvas.getContext("2d")

    const start = { x: -35, y: -35 }
    const end = { x: 35, y: 35 }
    const colorStops = [0, "red", 1, "blue"]
    const grd = ctx.createLinearGradient(start.x, start.y, end.x, end.y)

    // build color stops
    for (let n = 0; n < colorStops.length; n += 2)
      grd.addColorStop(colorStops[n] as number, colorStops[n + 1] as string)

    ctx.beginPath()
    ctx.translate(circle.x(), circle.y())
    ctx.arc(0, 0, 70, 0, Math.PI * 2, false)
    ctx.closePath()

    ctx.fillStyle = grd
    ctx.lineWidth = 4

    ctx.fill()
    ctx.stroke()

    compareLayerAndCanvas(layer, canvas, 200)
  })

  // ======================================================
  test("set opacity after instantiation", () => {
    const stage = addStage()
    const layer = new Layer()
    const group = new Group()
    const circle = new Circle({
      x: stage.width() / 2,
      y: stage.height() / 2,
      radius: 70,
      fill: "red"
    })

    group.add(circle)
    layer.add(group)
    stage.add(layer)

    circle.opacity(0.5)
    layer.draw()

    circle.opacity(1)
    layer.draw()

    const trace = layer.getContext().getTrace()
    assert.equal(
      trace,
      "clearRect(0,0,578,200);save();transform(1,0,0,1,289,100);beginPath();arc(0,0,70,0,6.283,false);closePath();fillStyle=red;fill();restore();clearRect(0,0,578,200);save();transform(1,0,0,1,289,100);globalAlpha=0.5;beginPath();arc(0,0,70,0,6.283,false);closePath();fillStyle=red;fill();restore();clearRect(0,0,578,200);save();transform(1,0,0,1,289,100);beginPath();arc(0,0,70,0,6.283,false);closePath();fillStyle=red;fill();restore();"
    )
  })

  // ======================================================
  test("attrs sync", () => {
    const stage = addStage()
    const layer = new Layer()
    const circle = new Circle({
      x: stage.width() / 2,
      y: stage.height() / 2,
      radius: 70,
      fill: "green",
      stroke: "black",
      strokeWidth: 4
    })

    layer.add(circle)
    stage.add(layer)

    assert.equal(circle.getWidth(), 140)
    assert.equal(circle.getHeight(), 140)

    circle.setWidth(100)
    assert.equal(circle.radius(), 50)
    assert.equal(circle.getHeight(), 100)

    circle.setHeight(120)
    assert.equal(circle.radius(), 60)
    assert.equal(circle.getHeight(), 120)
  })

  // ======================================================
  test("set fill after instantiation", () => {
    const stage = addStage()
    const layer = new Layer()
    const circle = new Circle({
      x: stage.width() / 2,
      y: stage.height() / 2,
      radius: 70,
      fill: "green",
      stroke: "black",
      strokeWidth: 4
    })
    layer.add(circle)

    circle.fill("blue")

    stage.add(layer)

    const trace = layer.getContext().getTrace()
    assert.equal(
      trace,
      "clearRect(0,0,578,200);save();transform(1,0,0,1,289,100);beginPath();arc(0,0,70,0,6.283,false);closePath();fillStyle=blue;fill();lineWidth=4;strokeStyle=black;stroke();restore();"
    )
  })

  test("getSelfRect", () => {
    const stage = addStage()
    const layer = new Layer()
    const circle = new Circle({
      x: 100,
      y: 100,
      radius: 50,
      fill: "green",
      stroke: "black",
      strokeWidth: 4,
      draggable: true
    })

    layer.add(circle)
    stage.add(layer)

    assert.deepEqual(circle.getSelfRect(), {
      x: -50,
      y: -50,
      width: 100,
      height: 100
    })
  })

  test("cache", () => {
    const stage = addStage()
    const layer = new Layer()
    const circle = new Circle({
      x: 100,
      y: 100,
      radius: 50,
      fill: "green",
      stroke: "black",
      strokeWidth: 4
    })

    layer.add(circle)
    stage.add(layer)

    const canvas = createCanvas()
    const context = canvas.getContext("2d")
    context.beginPath()
    context.arc(100, 100, 50, 0, Math.PI * 2, false)
    context.closePath()
    context.fillStyle = "green"
    context.fill()
    context.lineWidth = 4
    context.stroke()
    compareLayerAndCanvas(layer, canvas, 100)
  })
})
