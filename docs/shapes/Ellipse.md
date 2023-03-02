:::tip
This class is a descendant of [Shape](/shape) it also inherits all the options that [Shape](/shape) provides.
:::
:::tip
This component also supports a return function
:::

To create an ellipse shape with `fcanvas`, we can instantiate a `Ellipse` object.


In addition, this shape also provides a few other parameters:

Required:
| Name | Type | Description |
| ---- | ---- | ----------- |
| radius | `MayBeRef<{ x: number, y: number }>` | defines x and y radius |
**Inherit [Shape](/shape)**
| x | `MayBeRef<number>` | offset x |
| y | `MayBeRef<number>` | offset y |
---------------------------------------------------------------

Optional:
| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| rotate | `MayBeRef<number>` | 0 degress | The rotation of the ellipse, expressed in degress |
------
:::tip
The `rotate` mentioned above is different from the `rotation` property that inherits from [Shape](/shape) even though they manifest the same
:::

Demo:
```ts
import { Stage, Layer, Ellipse } from "fcanvas"

const stage = new Stage().mount("#app")
const layer = new Layer().addTo(stage)

const ellipse = new Ellipse({
  x: stage.size.width / 2,
  y: stage.size.height / 2,
  radiusX: 100,
  radiusY: 50,
  fill: 'yellow',
  stroke: 'black',
  strokeWidth: 4,
})
.addTo(layer)
```
<Preview />