import { Stage, Layer, Circle } from "../../src/index";

const stage = new Stage({
  container: "app",
  width: 310,
  height: 310,
});

const layer = new Layer();
stage.add(layer)

layer.add(new Circle({
    x: 151,
    y: 151,
    radius: 150,
    stroke: "black"
}))
