import { Arc } from "./shapes/Arc"
import { Arrow } from "./shapes/Arrow"
import { Circle } from "./shapes/Circle"
import { Ellipse } from "./shapes/Ellipse"
import { Line } from "./shapes/Line"
import { Rect } from "./shapes/Rect"

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!

const ctx = canvas.getContext("2d")!

const circle = new Rect({
  x: 10,
  y: 10,
  width: 10,
  height: 30,
  stroke: "black",
  cornerRadius: 20
})

circle.draw(ctx)
