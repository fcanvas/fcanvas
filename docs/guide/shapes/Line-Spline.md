# Line-Spline Shape

To create a spline with `fcanvas`, we can instantiate a `Line` object with tension attribute.

To define the path of the line you should use points property. If you have three points with `x` and `y` coordinates you should define points property as: `[x1, y1, x2, y2, x3, y3]`.

Flat array of numbers should work faster and use less memory than array of objects.

## Demo

```ts
import { Stage, Layer, Line } from "fcanvas"

const stage = new Stage().mount("#app")
const layer = new Layer().addTo(stage)

const redLine = new Line({
  points: [5, 70, 140, 23, 250, 60, 300, 20],
  stroke: "red",
  strokeWidth: 15,
  lineCap: "round",
  lineJoin: "round",
  tension: 1
}).addTo(layer)
// dashed line
const greenLine = new Line({
  points: [5, 70, 140, 23, 250, 60, 300, 20],
  stroke: "green",
  strokeWidth: 2,
  lineJoin: "round",
  /*
   * line segments with a length of 33px
   * with a gap of 10px
   */
  dash: [33, 10],
  lineCap: "round",
  tension: 0.5
}).addTo(layer)
// complex dashed and dotted line
const blueLine = new Line({
  points: [5, 70, 140, 23, 250, 60, 300, 20],
  stroke: "blue",
  strokeWidth: 10,
  lineCap: "round",
  lineJoin: "round",
  /*
   * line segments with a length of 29px with a gap
   * of 20px followed by a line segment of 0.001px (a dot)
   * followed by a gap of 20px
   */
  dash: [29, 20, 0.001, 20],
  tension: 0.7
}).addTo(layer)
```

<Preview />
