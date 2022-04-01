import { Stage, Layer, Circle } from "../../src/index";

const stage = new Stage({
  container: "app",
  width: 300,
  height: 300,
});

const layer = new Layer();
stage.add(layer)

layer.add(new Circle({
    x: 150,
    y: 150,
    radius: 150,
    stroke: "black"
}))