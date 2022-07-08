import { ref } from "@vue/reactivity"
import { watchEffect } from "vue"

import { Layer } from "./Layer"
import { Stage } from "./Stage"
import { Circle } from "./shapes/Circle"
import { useMouseIsPressed } from "./useApi/useMouseIsPressed"
import { useMousePos } from "./useApi/useMousePos"

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
const mousePos = useMousePos(layer)
const mouseIsPressed = useMouseIsPressed(layer)
watchEffect(() => {
  if (mouseIsPressed.value) {
    // eslint-disable-next-line functional/immutable-data
    circle.attrs.x = mousePos.mouseX
    // eslint-disable-next-line functional/immutable-data
    circle.attrs.y = mousePos.mouseY

    // eslint-disable-next-line functional/immutable-data
    circle.attrs.fill = "red"
  } else {
    // eslint-disable-next-line functional/immutable-data
    circle.attrs.fill = "transparent"
  }
})

layer.add(circle)

layer.batchDraw()

circle.on("mouseover", () => {
  console.log("click")
}) // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-explicit-any
;(window as any).circle = circle
;// eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-explicit-any
(window as any).radius = radius
