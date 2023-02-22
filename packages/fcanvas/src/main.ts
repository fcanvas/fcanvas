import {
  Circle,
  computed,
  Group,
  Layer,
  Stage,
  useMouseIsPressed,
  useMousePos
} from "./"
const stage = new Stage()
stage.mount("#app")

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
  fill: computed(() => (mouseIsPressed.value ? "red" : "transparent"))
})
layer.add(circle)

Object.assign(window, { stage, layer, circle, group: new Group() })
