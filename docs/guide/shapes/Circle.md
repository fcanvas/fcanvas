# Circle Shape

:::tip
This class is a descendant of [Shape](/guide/essentials/Shape) it also inherits all the options that [Shape](/guide/essentials/Shape) provides.
:::
:::tip
This component also supports a return function
:::

To create an circle shape with `fcanvas`, we can instantiate a `Circle` object.

In addition, this shape also provides a few other parameters:

## Require Options

| Name   | Type               | Description   |
| ------ | ------------------ | ------------- |
| radius | `MayBeRef<number>` | radius length |

### Inherit [Shape](/guide/essentials/Shape)

| Name | Type               | Description |
| ---- | ------------------ | ----------- |
| x    | `MayBeRef<number>` | offset x    |
| y    | `MayBeRef<number>` | offset y    |

## Demo

:::preview
```ts
import { Stage, Layer, Circle } from "fcanvas"

const stage = new Stage().mount("#app")
const layer = new Layer().addTo(stage)

const circle = new Circle({
  x: stage.size.width / 2,
  y: stage.size.height / 2,
  radius: 70,
  fill: "red",
  stroke: "black",
  strokeWidth: 4
}).addTo(layer)
```
:::
