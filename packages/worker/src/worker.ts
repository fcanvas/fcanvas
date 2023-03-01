import {
  Circle,
  computed,
  Layer,
  Stage,
  useMouseIsPressed,
  useMousePos
} from "fcanvas"

import { portToThread } from "./port-from-worker"

Object.assign(self, { UIEvent: class {} })
const stage = new Stage()

const layer = new Layer()
stage.add(layer)

const pos = useMousePos(layer)
const mouseIsPressed = useMouseIsPressed(layer)
console.log(pos)
const circle = new Circle({
  x: computed(() => pos.mouseX),
  y: computed(() => pos.mouseY),
  radius: 50,
  stroke: "#fff",
  fill: computed(() => (mouseIsPressed.value ? "red" : "green"))
})
layer.add(circle)

portToThread(stage)
Object.assign(self, { circle })

stage.on("touchend", (event) => {
  console.warn("touchend: ", event)
})
