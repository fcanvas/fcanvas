:::tip
This class is a descendant of [Shape](/shape) it also inherits all the options that [Shape](/shape) provides.
:::
:::tip
This component also supports a return function
:::

To create a regular polygon with `fcanvas`, we can instantiate a `RegularPolygon` object.

In addition, this shape also provides a few other parameters:

Required:
| Name | Type | Description |
| ---- | ---- | ----------- |
| sides | MayBeRef<number> | number of sides of the figure |
| radius | MayBeRef<number> | radius length |
**Inherit [Shape](/shape)**
| x | `MayBeRef<number>` | offset x |
| y | `MayBeRef<number>` | offset y |
---------------------------------------------------------------

Demo:
```ts
import { Stage, Layer, RegularPolygon } from "fcanvas"

const stage = new Stage().mount("#app")
const layer = new Layer().addTo(stage)

const hexagon = new RegularPolygon({
  x: 100,
  y: 150,
  sides: 6,
  radius: 70,
  fill: 'red',
  stroke: 'black',
  strokeWidth: 4,
})
.addTo(layer)
```
<Preview />
