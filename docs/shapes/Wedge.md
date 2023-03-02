:::tip
This class is a descendant of [Shape](/shape) it also inherits all the options that [Shape](/shape) provides.
:::
:::tip
This component also supports a return function
:::

To create an wedge shape with `fcanvas`, we can instantiate a `Wedge` object.


In addition, this shape also provides a few other parameters:

Required:
| Name | Type | Description |
| ---- | ---- | ----------- |
| angle | `MayBeRef<number>` | How many degrees is the angle from the x-axis? |
| radius | `MayBeRef<number>` | Radius length |
**Inherit [Shape](/shape)**
| x | `MayBeRef<number>` | offset x |
| y | `MayBeRef<number>` | offset y |
---------------------------------------------------------------

Optional:
| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| clockwise | `MayBeRef<boolean>` | false | The drawing angle should be clockwise or counterclockwise |
------

Demo:
```ts
import { Stage, Layer, Wedge } from "fcanvas"

const stage = new Stage().mount("#app")
const layer = new Layer().addTo(stage)

const wedge = wedge = new Wedge({
  x: stage.size.width / 2,
  y: stage.size.height / 2,
  radius: 70,
  angle: 60,
  fill: 'red',
  stroke: 'black',
  strokeWidth: 4,
  rotation: -120,
})
.addTo(layer)
```
<Preview />