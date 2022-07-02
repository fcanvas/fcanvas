import { Group } from "./Group"
import { Layer } from "./Layer"
import { Arc } from "./shapes/Arc"
import { Arrow } from "./shapes/Arrow"
import { Circle } from "./shapes/Circle"
import { Ellipse } from "./shapes/Ellipse"
import { Line } from "./shapes/Line"
import { Rect } from "./shapes/Rect"
import { CANVAS_ELEMENT } from "./symbols"

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!

const ctx = canvas.getContext("2d")!

const circle = new Circle({
  x: 20,
  y: 20,
  radius:20,
  stroke: "black",
})

const group = new Group({
  x: 0,
  y: 0
})
group.add(circle)

const main = new Layer()

main.add(group)
document.body.append(main[CANVAS_ELEMENT])
main.batchDraw()

window.group=group
window.c=circle
