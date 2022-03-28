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
  fill: "red",
  radius: 20,
  raws: {
      speedX: 12
  }
})
circle.raws.speedX
layer.add(circle)
stage.add(layer)