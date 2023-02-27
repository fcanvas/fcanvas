import {
  Circle,
  computed,
  Layer,
  Stage,
  useMouseIsPressed,
  useMousePos
} from "fcanvas"

import { portToSelf } from "./port-from-worker"

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

portToSelf(stage)
Object.assign(self, { circle })