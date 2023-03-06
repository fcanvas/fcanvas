# Arrow Shape

:::tip
This class is a descendant of [Line](/guide/shapes/Line) it also inherits all the options that [Line](/guide/shapes/Line) provides.
:::
:::tip
This component also supports a return function
:::

To create an arrow shape with `fcanvas`, we can instantiate a `Arrow` object.

In addition, this shape also provides a few other parameters:

## Require Options

### Inherit [Line](/guide/shapes/Line)

| Name   | Type               | Description                                                                          |
| ------ | ------------------ | ------------------------------------------------------------------------------------ |
| points | MayBeRef<number[]> | Flat array of points coordinates. You should define them as [x1, y1, x2, y2, x3, y3] |

### Inherit [Shape](/guide/essentials/Shape)

| Name | Type               | Description |
| ---- | ------------------ | ----------- |
| x    | `MayBeRef<number>` | offset x    |
| y    | `MayBeRef<number>` | offset y    |

## Optional Options

| Name               | Type                | Default | Description                                       |
| ------------------ | ------------------- | ------- | ------------------------------------------------- |
| pointerLength      | `MayBeRef<number>`  | 10      | Arrow pointer length.                             |
| pointerWidth       | `MayBeRef<number>`  | 10      | Arrow pointer width.                              |
| pointerAtBeginning | `MayBeRef<boolean>` | false   | Do we need to draw pointer on beginning position? |
| pointerAtEnding    | `MayBeRef<boolean>` | true    | Do we need to draw pointer on ending position?    |

### Inherit [Line](/guide/shapes/Line)

| Name    | Type                | Default | Description                                                                                                         |
| ------- | ------------------- | ------- | ------------------------------------------------------------------------------------------------------------------- |
| tension | `MayBeRef<number>`  | 0       | Higher values will result in a more curvy line. A value of 0 will result in no interpolation.                       |
| closed  | `MayBeRef<boolean>` | false   | Defines whether or not the line shape is closed, creating a polygon or blob (`quadraticCurveTo`)                    |
| bezier  | `MayBeRef<boolean>` | false   | If no tension is provided but `bezier=true`, we draw the line as a bezier using the passed points (`bezierCurveTo`) |

## Demo

:::preview
```ts
import { Stage, Layer, Arrow } from "fcanvas"

const stage = new Stage().mount("#app")
const layer = new Layer().addTo(stage)

const arrow = new Arrow({
  x: stage.size.width / 4,
  y: stage.size.height / 4,
  points: [0, 0, stage.size.width / 2, stage.size.height /2],
  pointerLength: 20,
  pointerWidth: 20,
  fill: 'black',
  stroke: 'black',
  strokeWidth: 4
})
.addTo(layer)
```
:::
