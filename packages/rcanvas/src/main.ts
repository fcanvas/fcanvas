import { ref } from "@vue/reactivity"
import { watchEffect } from "vue"

import { Layer } from "./Layer"
import { Stage } from "./Stage"
import { Circle } from "./shapes/Circle"
import { useMouseIsPressed } from "./useApi/useMouseIsPressed"
import { useMousePos } from "./useApi/useMousePos"
import { Rect } from "./shapes/Rect"

const stage = new Stage({
  container: "app"
})
const layer = new Layer()
stage.add(layer)

class CircleCustom extends Rect {
  setup() {
    const { attrs } = this
    const mousePos = useMousePos()
    const mouseIsPressed = useMouseIsPressed()

    watchEffect(() => {
      if (mouseIsPressed.value) {
        // eslint-disable-next-line functional/immutable-data
        attrs.x = mousePos.mouseX
        // eslint-disable-next-line functional/immutable-data
        attrs.y = mousePos.mouseY

        // eslint-disable-next-line functional/immutable-data
        attrs.fill = "red"
      } else {
        // eslint-disable-next-line functional/immutable-data
        attrs.fill = "transparent"
      }
    })
  }
}

const radius = ref(10)
const circle = new CircleCustom({
  x: 100,
  y: 100,
  width: 40,
  height: 40,
  stroke: "black",
  rotation: 80,
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
  },

  setup(attrs) {
    const mousePos = useMousePos()
    const mouseIsPressed = useMouseIsPressed()

    watchEffect(() => {
      if (mouseIsPressed.value) {
        // eslint-disable-next-line functional/immutable-data
        attrs.x = mousePos.mouseX
        // eslint-disable-next-line functional/immutable-data
        attrs.y = mousePos.mouseY

        // eslint-disable-next-line functional/immutable-data
        attrs.fill = "red"
      } else {
        // eslint-disable-next-line functional/immutable-data
        attrs.fill = "transparent"
      }
    })
  }
})

layer.add(circle)

layer.batchDraw()

circle.on("mouseover", () => {
  // eslint-disable-next-line functional/immutable-data
  circle.attrs.fill = "green"
})
circle.on("mouseout", () => {
  // eslint-disable-next-line functional/immutable-data
  circle.attrs.fill = "transparent"
}) // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-explicit-any
;(window as any).circle = circle // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-explicit-any
;(window as any).radius = radius
