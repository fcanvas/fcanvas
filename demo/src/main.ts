import { Stage, Layer, Shape } from "../../src/index";

const stage = new Stage({
  container: "app",
});

const layer = new Layer();

const circle = new Shape({
  sceneFunc(context) {
    console.log(context);
    context.arc(50, 50, 50, 0, Math.PI * 2);
  },
  x: 0,
  y: 0,
  // fill: "red"
  stroke: "black",
});

layer.add(circle);
stage.add(layer);

layer.draw();

window.layer = layer;
window.circle = circle;
