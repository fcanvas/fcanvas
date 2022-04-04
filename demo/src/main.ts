import { Stage, Layer, Circle } from "../../src/index";

const stage = new Stage({
  container: "app",
  width: 400,
  height: 400,
});

const layer = new Layer();
stage.add(layer)

layer.add(new Circle({
    x: 160,
    y: 160,
    radius: 150,
    stroke: "black"
}))
