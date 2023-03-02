:::tip
This class is a descendant of [Shape](/shape) it also inherits all the options that [Shape](/shape) provides.
:::
:::tip
This component also supports a return function
:::

To create an arc shape with `fcanvas`, we can instantiate a `Arc` object.


In addition, this shape also provides a few other parameters:

Required:
| Name | Type | Description |
| ---- | ---- | ----------- |
| innerRadius | `MayBeRef<number>` | inner ring radius length |
| outerRadius | `MayBeRef<number>` | outer circumference length |
**Inherit [Shape](/shape)**
| x | `MayBeRef<number>` | offset x |
| y | `MayBeRef<number>` | offset y |
---------------------------------------------------------------

Optional:
| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| angle | `MayBeRef<number>` | 360 degress | How many degrees is the angle from the x-axis? |
| clockwise | `MayBeRef<boolean>` | false | The drawing angle should be clockwise or counterclockwise |
------

Demo:
```ts
import { Stage, Layer, Arc } from "fcanvas"

const stage = new Stage().mount("#app")
const layer = new Layer().addTo(stage)

const arc = new Arc({
  x: stage.size.width / 2,
  y: stage.size.height / 2,
  innerRadius: 40,
  outerRadius: 70,
  angle: 60,
  fill: 'yellow',
  stroke: 'black',
  strokeWidth: 4,
})
.addTo(layer)
```
<Preview />