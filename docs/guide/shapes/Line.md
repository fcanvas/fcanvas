# Line Shape

:::tip
This class is a descendant of [Shape](/guide/essentials/Shape) it also inherits all the options that [Shape](/guide/essentials/Shape) provides.
:::
:::tip
This component also supports a return function
:::

To create an line shape with `fcanvas`, we can instantiate a `Line` object.

## Simple Line

To define the path of the line you should use `points` property. If you have three points with `x` and `y` coordinates you should define points property as: `[x1, y1, x2, y2, x3, y3]`.

Flat array of numbers should work faster and use less memory than array of objects.

In addition, this shape also provides a few other parameters:

## Require Options

| Name   | Type               | Description                                                                          |
| ------ | ------------------ | ------------------------------------------------------------------------------------ |
| points | MayBeRef<number[]> | Flat array of points coordinates. You should define them as [x1, y1, x2, y2, x3, y3] |

### Inherit [Shape](/guide/essentials/Shape)

| Name | Type               | Description |
| ---- | ------------------ | ----------- |
| x    | `MayBeRef<number>` | offset x    |
| y    | `MayBeRef<number>` | offset y    |

## Optional Options

| Name    | Type                | Default | Description                                                                                                         |
| ------- | ------------------- | ------- | ------------------------------------------------------------------------------------------------------------------- |
| tension | `MayBeRef<number>`  | 0       | Higher values will result in a more curvy line. A value of 0 will result in no interpolation.                       |
| closed  | `MayBeRef<boolean>` | false   | Defines whether or not the line shape is closed, creating a polygon or blob (`quadraticCurveTo`)                    |
| bezier  | `MayBeRef<boolean>` | false   | If no tension is provided but `bezier=true`, we draw the line as a bezier using the passed points (`bezierCurveTo`) |

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
  lineJoin: "round"
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
  dash: [33, 10]
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
  dash: [29, 20, 0.001, 20]
}).addTo(layer)
```

<Preview />
