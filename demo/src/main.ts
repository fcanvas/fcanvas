import { Stage, Layer, Shape, Circle } from "../../src/index";

const stage = new Stage({
  container: "app",
});

const layer = new Layer();

const circle = new Circle({
  x: 0,
  y: 0,
  radius: 50,
  // fill: "red"
  stroke: "black",
});
circle.on("mousedown", (event) => {
  console.table({
    name: "mousedown",
    event,
  });
});

layer.add(circle);
stage.add(layer);

layer.draw();

window.layer = layer;
window.circle = circle;
