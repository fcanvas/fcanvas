:::tip
This class is a descendant of [Shape](/shape) it also inherits all the options that [Shape](/shape) provides.
:::
:::tip
This component also supports a return function
:::

A new need arises that when you need something to draw similar to [background-repeat](https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat) use `ImageRepeat`.

For image property you can use:

`image` An element to draw into the context. The specification permits any canvas image source, specifically,
- an [HTMLImageElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement),
- an [SVGImageElement](https://developer.mozilla.org/en-US/docs/Web/API/SVGImageElement),
- an [HTMLVideoElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement),
- an [HTMLCanvasElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement),
- an [ImageBitmap](https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap),
- an [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas),
- an [VideoFrame](https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame),
- or `string` is url image loaded. This `url` must have been loaded by `await loadImage('<url>')` before. [refer to loadImage](/functions/loadImage)

In addition, this shape also provides a few other parameters:

Required:
| Name | Type | Description |
| ---- | ---- | ----------- |
| image | `MayBeRef<CanvasImageSource | string>` | multiply by a value as stated above |
**Inherit [Shape](/shape)**
| x | `MayBeRef<number>` | offset x |
| y | `MayBeRef<number>` | offset y |
---------------------------------------------------------------

Optional:
| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| scrollWidth | `MayBeRef<number>` | = imageWidth | The width of the element to be visible. for example if `scrollWidth=100` the image will be repeatedly drawn until the total size >= 100 |
| scrollHeight | `MayBeRef<number>` | = imageHeight | The height of the element to be visible. for example if `scrollHeight=100` the image will be repeatedly drawn until the total size >= 100 |
| scrollTop | `MayBeRef<number>` | 0 | position y scrolled to it similar to [background-position](https://developer.mozilla.org/en-US/docs/Web/CSS/background-position) |
| scrollLeft | `MayBeRef<number>` | 0 | position x scrolled to it similar to [background-position](https://developer.mozilla.org/en-US/docs/Web/CSS/background-position) |
| whileDraw | `MayBeRef<boolean>` | false | Is it constantly redrawing and ignoring the cache policy? |
------
:::tip
The `crop` feature provided by this component is very simple. If you need more powerful cropping (e.g. `Tile`) use [cropImage](/functions/cropImage)
:::

Demo:
```ts
import { Stage, Layer, ImageRepeat, loadImage } from "fcanvas"

const stage = new Stage().mount("#app")
const layer = new Layer().addTo(stage)

const image = new ImageRepeat({
  x: stage.size.width / 2,
  y: stage.size.height / 2,
  image: await loadImage("https://google.com/favicon.ico"),
  scrollWidth: 300,
  scrollHeight: 150,
  scrollTop: 20
})
.addTo(layer)
```
<Preview />