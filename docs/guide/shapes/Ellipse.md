# Ellipse Shape

:::tip
This class is a descendant of [Shape](/guide/essentials/Shape) it also inherits all the options that [Shape](/guide/essentials/Shape) provides.
:::
:::tip
This component also supports a return function
:::

To create an ellipse shape with `fcanvas`, we can instantiate a `Ellipse` object.

In addition, this shape also provides a few other parameters:

## Require Options

| Name    | Type               | Description      |
| ------- | ------------------ | ---------------- |
| radiusX | `MayBeRef<number>` | defines x radius |
| radiusY | `MayBeRef<number>` | defines y radius |

### Inherit [Shape](/guide/essentials/Shape)

| Name | Type               | Description |
| ---- | ------------------ | ----------- |
| x    | `MayBeRef<number>` | offset x    |
| y    | `MayBeRef<number>` | offset y    |

## Optional Options

| Name   | Type               | Default   | Description                                       |
| ------ | ------------------ | --------- | ------------------------------------------------- |
| rotate | `MayBeRef<number>` | 0 degress | The rotation of the ellipse, expressed in degress |

:::tip
The `rotate` mentioned above is different from the `rotation` property that inherits from [Shape](/guide/essentials/Shape) even though they manifest the same
:::

## Demo

:::preview

```ts
import { Stage, Layer, Ellipse } from "fcanvas"

const stage = new Stage().mount("#app")
const layer = new Layer().addTo(stage)

const ellipse = new Ellipse({
  x: stage.size.width / 2,
  y: stage.size.height / 2,
  radiusX: 100,
  radiusY: 50,
  fill: "yellow",
  stroke: "black",
  strokeWidth: 4
}).addTo(layer)
```

:::
