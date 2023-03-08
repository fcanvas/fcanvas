# Rect Shape

:::tip
This class is a descendant of [Shape](/guide/essentials/Shape) it also inherits all the options that [Shape](/guide/essentials/Shape) provides.
:::
:::tip
This component also supports a return function
:::

To create a rectangle with `fcanvas`, we can instantiate a `Rect` object.

You can define corner radius for `Rect`. It can be simple number or array of numbers `[topLeft, topRight, bottomRight, bottomLeft]`.

In addition, this shape also provides a few other parameters:

## Require Options

| Name   | Type               | Description   |
| ------ | ------------------ | ------------- |
| width  | `MayBeRef<number>` | width length  |
| height | `MayBeRef<number>` | height length |

### Inherit [Shape](/guide/essentials/Shape)

| Name | Type               | Description |
| ---- | ------------------ | ----------- |
| x    | `MayBeRef<number>` | offset x    |
| y    | `MayBeRef<number>` | offset y    |

## Optional Options

| Name         | Type                                                                       | Default | Description                                                                                                     |
| ------------ | -------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------- |
| cornerRadius | `MayBeRef<number \| [number, number] \| [number, number, number, number]>` | 0       | This property is same as [border-radius](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius) in css |

## Demo

:::preview
```ts
import { Stage, Layer, Rect } from "fcanvas"

const stage = new Stage({ height: 200 }).mount("#app")
const layer = new Layer().addTo(stage)

const rect1 = new Rect({
  x: 20,
  y: 20,
  width: 100,
  height: 50,
  fill: "green",
  stroke: "black",
  strokeWidth: 4
}).addTo(layer)
const rect2 = new Rect({
  x: 150,
  y: 40,
  width: 100,
  height: 50,
  fill: "red",
  shadowBlur: 10,
  cornerRadius: 10
}).addTo(layer)
const rect3 = new Rect({
  x: 50,
  y: 120,
  width: 100,
  height: 100,
  fill: "blue",
  cornerRadius: [0, 10, 20, 30]
}).addTo(layer)
```
:::
