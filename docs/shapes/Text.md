:::tip
This class is a descendant of [Shape](/shape) it also inherits all the options that [Shape](/shape) provides.
:::
:::tip
This component also supports a return function
:::

To create an text shape with `fcanvas`, we can instantiate a `Text` object.


In addition, this shape also provides a few other parameters:

Required:
| Name | Type | Description |
| ---- | ---- | ----------- |
| text | `MayBeRef<string>` | text show |
**Inherit [Shape](/shape)**
| x | `MayBeRef<number>` | offset x |
| y | `MayBeRef<number>` | offset y |
---------------------------------------------------------------

Optional:
| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| fontFamily | `MayBeRef<string>` | Font default Browser | Font apply to text |
| fontSize | `MayBeRef<number>` | 12 | Font size |
| fontStyle | `MayBeRef<"normal" \| "bold" \| "italic" \| "italic bold">` | "normal" | display font style |
| fontVariant | `MayBeRef<"normal" \| "small-caps">` | "normal" | can be normal or small-caps |
| textDecoration | `MayBeRef<"line-through" \| "underline" \| "none">` | "none" | underline style |
| align | `MayBeRef<"left" \| "center" \| "right" \| "justify">` | "left" | ext will display the same style as [text-align in CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align) |
| verticalAlign |  `MayBeRef<"top" \| "middle" \| "bottom">` | "bottom" | This is like `align` but for vertical. it's the same as [vertical-align in CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/vertical-align) |
| padding | MayBeRef<number> | 0 | padding text |
| lineHeight | MayBeRef<number> | 1 | It like [line-height in CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/line-height) |
| wrap | `MayBeRef<"word" \| "char" \| "none">` |
| ellipsis | MayBeRef<boolean> | false | if `Text` config is set to `wrap="none"` and `ellipsis=true`, then it will add "..." to the end |
| letterSpacing | MayBeRef<number> | 0 | letter spacing for text |
| textBaseline | MayBeRef<CanvasTextBaseline> | "middle" | This is similar to `verticalAlign` but instead of calculating it itself it uses the canvas api (may improve performance) |
| width | `MayBeRef<number \| "auto">` | "auto" | |
| height | `MayBeRef<number \| "auto">` | "auto" | |
------

Demo:
```ts
import { Stage, Layer, Text, Rect } from "fcanvas"

const stage = new Stage().mount("#app")
const layer = new Layer().addTo(stage)

const simpleText = new Text({
  x: stage.width() / 2,
  y: 15,
  text: 'Simple Text',
  align: 'center',
  fontSize: 30,
  fontFamily: 'Calibri',
  fill: 'green',
})
const complexText = new Text({
  x: 20,
  y: 60,
  text: "COMPLEX TEXT\n\nAll the world's a stage, and all the men and women merely players. They have their exits and their entrances.",
  fontSize: 18,
  fontFamily: 'Calibri',
  fill: '#555',
  width: 300,
  padding: 20,
  align: 'center',
})
const rect = new Rect({
  x: 20,
  y: 60,
  stroke: '#555',
  strokeWidth: 5,
  fill: '#ddd',
  width: 300,
  height: complexText.height(),
  shadowColor: 'black',
  shadowBlur: 10,
  shadowOffsetX: 10,
  shadowOffsetY: 10,
  shadowOpacity: 0.2,
  cornerRadius: 10,
})
// add the shapes to the layer
layer.add(simpleText);
layer.add(rect);
layer.add(complexText);
```
<Preview />