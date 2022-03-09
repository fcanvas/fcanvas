import { Stage, Layer, Shape } from "../../src/index"

const stage = new Stage({
  container: "app"
})

const layer = new Layer()

const circle = new Shape({
  sceneFunc(context) {
    
  },
  x:0,
  y: 0
})

layer.add(circle)
stage.add(layer)

layer.draw()


window.layer = layer;
window.circle = circle