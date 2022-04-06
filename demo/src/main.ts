import { Stage, Layer, Image, loadImage } from "../../src/index";
import Sprite from "./dino-sprite.png";

const stage = new Stage({
  container: "app",
  width: 310,
  height: 310,
});

const layer = new Layer();
stage.add(layer)

layer.add(new Image({
    x: 0,
    y: 0,
    image: await loadImage(Sprite)
}))