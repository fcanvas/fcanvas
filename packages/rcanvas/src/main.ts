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
  stroke: "black",
  animate: {
    moveX: {
      keyframes: {
        "0%": {
          x: 0
        }
      },
      duration: 1,
      repeat: -1
    }
  }
})

layer.add(circle)

layer.batchDraw()

circle.on("mouseover", () => {
  console.log("click")
})
window.circle = circle
window.radius = radius
