import { Layer, RegularPolygon, Stage } from "."

const stage = new Stage({ height: 300 }).mount("#app")

const layer = new Layer()
stage.add(layer)

layer.add(
  new RegularPolygon({
    x: stage.size.width / 2,
    y: stage.size.height / 2,
    sides: 5,
    radius: 70,
    fill: "red",
    stroke: "black",
    strokeWidth: 4,
    shadow: {
      x: 20,
      y: 25,
      blur: 40,
      color: "black"
    },
    opacity: 0.5
  })
)
