:::tip
This class is a descendant of [Shape](/shape) it also inherits all the options that [Shape](/shape) provides.
:::
:::tip
This component also supports a return function
:::

To create an circle shape with `fcanvas`, we can instantiate a `Circle` object.


In addition, this shape also provides a few other parameters:

Required:
| Name | Type | Description |
| ---- | ---- | ----------- |
| radius | `MayBeRef<number>` | radius length |
**Inherit [Shape](/shape)**
| x | `MayBeRef<number>` | offset x |
| y | `MayBeRef<number>` | offset y |
---------------------------------------------------------------

Demo:
```ts
import { Stage, Layer, Circle } from "fcanvas"

const stage = new Stage().mount("#app")
const layer = new Layer().addTo(stage)

const circle = new Circle({
  x: stage.size.width / 2,
  y: stage.size.height / 2,
  radius: 70,
  fill: 'red',
  stroke: 'black',
  strokeWidth: 4,
})
.addTo(layer)
```
<Preview />