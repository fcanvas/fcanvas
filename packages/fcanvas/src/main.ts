import { watchEffect } from "@vue-reactivity/watch"
import { ref } from "@vue/reactivity"

import { Layer } from "./Layer"
import { Stage } from "./Stage"
import { Rect } from "./shapes/Rect"
import { useMouseIsPressed } from "./useApi/useMouseIsPressed"
import { useMousePos } from "./useApi/useMousePos"

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
  }
})

layer.add(circle)
