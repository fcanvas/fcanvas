# Line-Blob Shape

To create a blob with `fcanvas`, we can instantiate a `Line` object with closed = true and tension attributes.

To define the path of the line you should use points property. If you have three points with x and y coordinates you should define points property as: `[x1, y1, x2, y2, x3, y3]`.

Flat array of numbers should work faster and use less memory than array of objects.

## Demo

:::preview
```ts
import { Stage, Layer, Line } from "fcanvas"

const stage = new Stage({ height: 200 }).mount("#app")
const layer = new Layer().addTo(stage)

const blob = new Line({
  points: [23, 20, 23, 160, 70, 93, 150, 109, 290, 139, 270, 93],
  fill: "#00D2FF",
  stroke: "black",
  strokeWidth: 5,
  closed: true,
  tension: 0.3
}).addTo(layer)
```
:::
