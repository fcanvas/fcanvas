# TextPath Shape

:::tip
This class is a descendant of [Shape](/guide/essentials/Shape) it also inherits all the options that [Shape](/guide/essentials/Shape) provides.
:::
:::tip
This component also supports a return function
:::

To create an text path shape with `fcanvas`, we can instantiate a `TextPath` object.

In addition, this shape also provides a few other parameters:

## Require Options

| Name | Type               | Description   |
| ---- | ------------------ | ------------- |
| text | `MayBeRef<string>` | text show     |
| data | `MayBeRef<string>` | data SVG path |

### Inherit [Shape](/guide/essentials/Shape)

| Name | Type               | Description |
| ---- | ------------------ | ----------- |
| x    | `MayBeRef<number>` | offset x    |
| y    | `MayBeRef<number>` | offset y    |

## Optional Options

| Name           | Type                                                        | Default              | Description                                                                                                              |
| -------------- | ----------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| fontFamily     | `MayBeRef<string>`                                          | Font default Browser | Font apply to text                                                                                                       |
| fontSize       | `MayBeRef<number>`                                          | 12                   | Font size                                                                                                                |
| fontStyle      | `MayBeRef<"normal" \| "bold" \| "italic" \| "italic bold">` | "normal"             | display font style                                                                                                       |
| fontVariant    | `MayBeRef<"normal" \| "small-caps">`                        | "normal"             | can be normal or small-caps                                                                                              |
| textDecoration | `MayBeRef<"line-through" \| "underline" \| "none">`         | "none"               | underline style                                                                                                          |
| align          | `MayBeRef<"left" \| "center" \| "right" \| "justify">`      | "left"               | ext will display the same style as [text-align in CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align)      |
| letterSpacing  | `MayBeRef<number>`                                          | 0                    | letter spacing for text                                                                                                  |
| textBaseline   | `MayBeRef<CanvasTextBaseline>`                              | "middle"             | This is similar to `verticalAlign` but instead of calculating it itself it uses the canvas api (may improve performance) |

## Demo

```ts
import { Stage, Layer, Text, TextPath } from "fcanvas"

const stage = new Stage().mount("#app")
const layer = new Layer().addTo(stage)

const textpath = new TextPath({
  x: 0,
  y: 50,
  fill: "#333",
  fontSize: 16,
  fontFamily: "Arial",
  text: "All the world's a stage, and all the men and women merely players.",
  data: "M10,10 C0,0 10,150 100,100 S300,150 5.0.300"
}).addTo(layer)
```

<Preview />
