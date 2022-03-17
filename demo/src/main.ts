import { Stage, Layer, Circle } from "../../src/index";

const stage = new Stage({
  container: "app",
  width: 300,
  height: 300,
});

const layer = new Layer();

const circle = new Circle({
  x: 0,
  y: 0,
  radius: 50,
  fill: "red"
})

layer.add(circle)
stage.add(layer)

window.circle = circle