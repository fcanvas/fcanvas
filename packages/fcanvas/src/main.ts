import { Circle, Layer, Stage } from "./"

const stage = new Stage({
  container: "app",
  width: 300,
  height: 300
})
const layer = new Layer()
stage.add(layer)

layer.add(
  new Circle({
    x: stage.size.width / 2,
    y: stage.size.height / 2,
    radius: 70,
    stroke: "black",
    fillRadialGradient: {
      start: { x: -20, y: -20 },
      end: { x: -60, y: -60 },
      startRadius: 0,
      endRadius: 130,
      colorStops: [
        [0, "red"],
        [0.2, "yellow"],
        [1, "blue"]
      ]
    },
    scale: {
      x: 0.5,
      y: 0.5
    }
  })
)
