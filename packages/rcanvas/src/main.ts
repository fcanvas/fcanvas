import { ref } from "@vue/reactivity"

import { Layer } from "./Layer"
import { Stage } from "./Stage"
import { Circle } from "./shapes/Circle"

const stage = new Stage({
  container: "app"
})
const layer = new Layer()
stage.add(layer)

const radius = ref(10)
const circle = new Circle({
  x: 10,
  y: 10,
  radius,
  stroke: "black"
})

layer.add(circle)

layer.batchDraw()

circle.on("mouseover", () => {
  console.log("click")
})

window.radius = radius
