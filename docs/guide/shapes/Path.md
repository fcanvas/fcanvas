# Path Shape

:::tip
This class is a descendant of [Shape](/guide/essentials/Shape) it also inherits all the options that [Shape](/guide/essentials/Shape) provides.
:::
:::tip
This component also supports a return function
:::

To create an SVG path with `fcanvas`, we can instantiate a `Path` object.

Paths are most commonly used when we want to export an SVG Path into an HTML5 Canvas path, or if we want to manifest complex drawings as a data string rather than creating a custom shape.

In addition, this shape also provides a few other parameters:

## Require Options

| Name | Type               | Description     |
| ---- | ------------------ | --------------- |
| data | `MayBeRef<string>` | SVG data string |

### Inherit [Shape](/guide/essentials/Shape)

| Name | Type               | Description |
| ---- | ------------------ | ----------- |
| x    | `MayBeRef<number>` | offset x    |
| y    | `MayBeRef<number>` | offset y    |

:::tip
You can generate data svg with this tool GUI: https://boxy-svg.com/app
:::

## Demo

:::preview
```ts
import { Stage, Layer, Path } from "fcanvas"

const stage = new Stage().mount("#app")
const layer = new Layer().addTo(stage)

const path = new Path({
  x: 50,
  y: 40,
  data: "M213.1,6.7c-32.4-14.4-73.7,0-88.1,30.6C110.6,4.9,67.5-9.5,36.9,6.7C2.8,22.9-13.4,62.4,13.5,110.9C33.3,145.1,67.5,170.3,125,217c59.3-46.7,93.5-71.9,111.5-106.1C263.4,64.2,247.2,22.9,213.1,6.7z",
  fill: "green",
  scaleX: 0.5,
  scaleY: 0.5
}).addTo(layer)
```
:::
