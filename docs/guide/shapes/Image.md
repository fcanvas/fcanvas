# Image Shape

:::tip
This class is a descendant of [Shape](/guide/essentials/Shape) it also inherits all the options that [Shape](/guide/essentials/Shape) provides.
:::
:::tip
This component also supports a return function
:::

To create an image with `fcanvas`, we can instantiate a `Image` object with image property.

For image property you can use:

`image` An element to draw into the context. The specification permits any canvas image source, specifically,

- an [HTMLImageElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement),
- an [SVGImageElement](https://developer.mozilla.org/en-US/docs/Web/API/SVGImageElement),
- an [HTMLVideoElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement),
- an [HTMLCanvasElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement),
- an [ImageBitmap](https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap),
- an [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas),
- an [VideoFrame](https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame),
- or `string` is url image loaded. This `url` must have been loaded by `await loadImage('<url>')` before. [refer to loadImage](/guide/functions/other-utils#loadImage)

In addition, this shape also provides a few other parameters:

## Require Options

| Name  | Type                                    | Description                         |
| ----- | --------------------------------------- | ----------------------------------- |
| image | `MayBeRef<CanvasImageSource \| string>` | multiply by a value as stated above |

### Inherit [Shape](/guide/essentials/Shape)

| Name | Type               | Description |
| ---- | ------------------ | ----------- |
| x    | `MayBeRef<number>` | offset x    |
| y    | `MayBeRef<number>` | offset y    |

## Optional Options

| Name   | Type                                                                | Default                                         | Description                                                                                                                       |
| ------ | ------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| crop   | `MayBeRef<{ x: number; y: number; width: number; height: number }>` | undefined                                       | An object that specifies the `x`, `y` coordinates to start cropping and the `width`, `height` dimensions of the image to be crop. |
| width  | `MayBeRef<number>`                                                  | width of `image` or `crop.width` if available   | Final width to display photo                                                                                                      |
| height | `MayBeRef<number>`                                                  | height of `image` or `crop.height` if available | Final height to display photo                                                                                                     |

:::tip
The `crop` feature provided by this component is very simple. If you need more powerful cropping (e.g. `Tile`) use [cropImage](/guide/functions/other-utils#cropImage)
:::

## Demo

:::preview
```ts
import { Stage, Layer, Image, loadImage } from "fcanvas"

const stage = new Stage().mount("#app")
const layer = new Layer().addTo(stage)

const image = new Image({
  x: stage.size.width / 2,
  y: stage.size.height / 2,
  image: await loadImage("https://shin.is-a.dev/favicon.ico")
}).addTo(layer)
```
:::
