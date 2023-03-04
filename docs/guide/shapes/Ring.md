# Ring Shape

:::tip
This class is a descendant of [Arc](/guide/shapes/Arc) it also inherits all the options that [Arc](/guide/shapes/Arc) provides.
:::
:::tip
This component also supports a return function
:::

To create a ring with `fcanvas`, we can instantiate a `Ring` object.

All properties are inherited from [Arc](/guide/shapes/Arc)

## Require Options

### Inherit [Arc](/guide/shapes/Arc)

| Name        | Type               | Description                |
| ----------- | ------------------ | -------------------------- |
| innerRadius | `MayBeRef<number>` | inner ring radius length   |
| outerRadius | `MayBeRef<number>` | outer circumference length |

### Inherit [Shape](/guide/essentials/Shape)

| Name | Type               | Description |
| ---- | ------------------ | ----------- |
| x    | `MayBeRef<number>` | offset x    |
| y    | `MayBeRef<number>` | offset y    |

## Demo

```ts
import { Stage, Layer, Ring } from "fcanvas"

const stage = new Stage().mount("#app")
const layer = new Layer().addTo(stage)

const ring = new Ring({
  x: stage.size.width / 2,
  y: stage.size.height / 2,
  innerRadius: 40,
  outerRadius: 70,
  fill: "yellow",
  stroke: "black",
  strokeWidth: 4
}).addTo(layer)
```

<Preview />
