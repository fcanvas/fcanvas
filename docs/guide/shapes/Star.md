# Star Shape

:::tip
This class is a descendant of [Shape](/guide/essentials/Shape) it also inherits all the options that [Shape](/guide/essentials/Shape) provides.
:::
:::tip
This component also supports a return function
:::

To create an star shape with `fcanvas`, we can instantiate a `Star` object.

In addition, this shape also provides a few other parameters:

## Require Options

| Name        | Type               | Description                        |
| ----------- | ------------------ | ---------------------------------- |
| numPoints   | `MayBeRef<number>` | How many sides will the star have? |
| innerRadius | `MayBeRef<number>` | inner ring radius length           |
| outerRadius | `MayBeRef<number>` | outer circumference length         |

### Inherit [Shape](/guide/essentials/Shape)

| Name | Type               | Description |
| ---- | ------------------ | ----------- |
| x    | `MayBeRef<number>` | offset x    |
| y    | `MayBeRef<number>` | offset y    |

## Demo

```ts
import { Stage, Layer, Star } from "fcanvas"

const stage = new Stage().mount("#app")
const layer = new Layer().addTo(stage)

const star = new Star({
  x: stage.size.width / 2,
  y: stage.size.height / 2,
  numPoints: 6,
  innerRadius: 40,
  outerRadius: 70,
  fill: "yellow",
  stroke: "black",
  strokeWidth: 4
}).addTo(layer)
```

<Preview />
