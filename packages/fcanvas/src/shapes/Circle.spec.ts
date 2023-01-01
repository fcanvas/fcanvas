import "./test/setup-environment"

import { createCanvas } from "canvas"
import { describe, expect, test } from "vitest"

import { Circle, Group, Layer, Stage } from ".."
import { getBounceClientRect } from "../methods/getBounceClientRect"

import { compareCanvas } from "./test/helpers/compareCanvas"
import { compareLayerWithImage } from "./test/helpers/compareLayerWithImage"

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

  test("add circle with radial gradient fill", async () => {
    const stage = new Stage({
      autoDraw: false
    })
    const layer = new Layer()

    const circle = new Circle({
      x: stage.size.width / 2,
      y: stage.size.height / 2,
      radius: 70,
      stroke: "black",
      fillRadialGradient: {
        start: { x: -20, y: -20 },
        end: { x: -60, y: -60 },
        startRadius: 0,
        endRadius: 130,
        colorStops: [
          [0, "red"],
          [0.2, "yellow"],
          [1, "blue"]
        ]
      }
    })
    layer.add(circle)

    stage.add(layer)
    layer.draw()

    expect(
      await compareLayerWithImage(layer, "circle_70_fillRadial.png")
    ).toEqual(true)
  })

  test("add shape with linear gradient fill", async () => {
    const stage = new Stage({
      autoDraw: false
    })
    const layer = new Layer()

    const circle = new Circle({
      x: stage.size.width / 2,
      y: stage.size.height / 2,
      radius: 70,
      stroke: "black",
      fillLinearGradient: {
        start: { x: -35, y: -35 },
        end: { x: 35, y: 35 },
        colorStops: [
          [0, "red"],
          [1, "blue"]
        ]
      }
    })
    layer.add(circle)

    stage.add(layer)
    layer.draw()

    expect(
      await compareLayerWithImage(layer, "circle_70_fillLinear.png")
    ).toEqual(true)
  })

  test("set opacity after instantiation & reactive", async () => {
    const stage = new Stage({
      autoDraw: false
    })
    const layer = new Layer()
    const group = new Group()
    const circle = new Circle({
      x: stage.size.width / 2,
      y: stage.size.height / 2,
      radius: 70,
      fill: "red"
    })

    group.add(circle)
    layer.add(group)
    stage.add(layer)

    circle.$.opacity = 0.5
    layer.draw()

    circle.$.opacity = 1
    layer.draw()

    expect(
      await compareLayerWithImage(layer, "circle_70_fill:red.png")
    ).toEqual(true)
  })

  test("set fill after instantiation", async () => {
    const stage = new Stage({
      autoDraw: false
    })
    const layer = new Layer()
    const circle = new Circle({
      x: stage.size.width / 2,
      y: stage.size.height / 2,
      radius: 70,
      fill: "green",
      stroke: "black",
      strokeWidth: 4
    })
    layer.add(circle)

    circle.$.fill = "blue"

    stage.add(layer)

    layer.draw()

    expect(
      await compareLayerWithImage(layer, "circle_70_fill:blue.png")
    ).toEqual(true)
  })

  test("getSelfRect", () => {
    const stage = new Stage({
      autoDraw: false
    })
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

    expect(circle.getClientRect()).toEqual(getBounceClientRect(circle))
    expect(getBounceClientRect(circle)).toEqual({
      width: 104,
      height: 104,
      x: -52,
      y: -52
    })
  })

  test("cache", () => {
    const stage = new Stage({
      autoDraw: false
    })
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
    layer.draw()

    const canvas = createCanvas(300, 300)
    const context = canvas.getContext("2d")
    context.beginPath()
    context.arc(100, 100, 50, 0, Math.PI * 2, false)
    context.closePath()

    context.fillStyle = "green"
    context.fill()

    context.lineWidth = 4
    context.stroke()

    expect(
      compareCanvas(layer, canvas as unknown as HTMLCanvasElement)
    ).toEqual(true)
  })
})
