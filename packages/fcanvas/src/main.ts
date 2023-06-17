import {
  Circle,
  computed,
  Group,
  Layer,
  Rect,
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
  fill: computed(() => (mouseIsPressed.value ? "red" : "transparent")),
  zIndex: 10
})
layer.add(circle)
new Rect({
  x: 0,y: 0,width: 50, height: 50, fill: 'red',
  zIndex: 0
}).addTo(layer)

Object.assign(window, { stage, layer, circle, group: new Group() })
