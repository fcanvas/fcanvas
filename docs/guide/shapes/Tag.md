# Tag Shape

:::tip
This class is a descendant of [Shape](/guide/essentials/Shape) it also inherits all the options that [Shape](/guide/essentials/Shape) provides.
:::
:::tip
This component also supports a return function
:::

To create an arc shape with `fcanvas`, we can instantiate a `Tag` object.

In addition, this shape also provides a few other parameters:

## Optional Options

| Name             | Type                                                                       | Default           | Description                                                                                                     |
| ---------------- | -------------------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------- |
| pointerDirection | `MayBeRef<"up" \| "down" \| "left" \| "right" \| "none">`                  | "none"            | The display direction of the arrow of Tag. If equal `"none"` not display `arrow`                                |
| pointerWidth     | `MayBeRef<number>`                                                         | width of `arrow`  |
| pointerHeight    | `MayBeRef<number>`                                                         | width of `height` |
| cornerRadius     | `MayBeRef<number \| [number, number]  \| [number, number, number, number>` | 0                 | This property is same as [border-radius](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius) in css |
| width            | `MayBeRef<number>`                                                         | auto              | width length                                                                                                    |
| height           | `MayBeRef<number>`                                                         | auto              | height length                                                                                                   |

This component is a wrapper for [Text](/guide/shapes/Text) in [Label](/guide/shapes/Label)
