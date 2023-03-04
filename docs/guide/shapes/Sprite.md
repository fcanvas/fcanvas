# Sprite Shape

:::tip
This class is a descendant of [Shape](/guide/essentials/Shape) it also inherits all the options that [Shape](/guide/essentials/Shape) provides.
:::
:::tip
This component also supports a return function
:::

To create a sprite with `fcanvas`, we can instantiate a `Sprite` object.

In addition, this shape also provides a few other parameters:

## Require Options

| Name       | Type                                                    | Description                                                                          |
| ---------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| image      | `MayBeRef<CanvasImageSource \| string>`                 | This parameter accepts the same data type as `image` of [Image](/guide/shapes/Image) |
| animations | `MayBeRef<Record<string, AnimationFrames \| number[]>>` | animation map                                                                        |
| animation  | `MayBeRef<keyof animations>`                            | animation key                                                                        |

### Inherit [Shape](/guide/essentials/Shape)

| Name | Type               | Description |
| ---- | ------------------ | ----------- |
| x    | `MayBeRef<number>` | offset x    |
| y    | `MayBeRef<number>` | offset y    |

```ts
interface AnimationFrames {
  frames: number[]
  frameIndex?: number
  frameRate?: number
}
```

## Optional Options

| Name       | Type                | Default | Description                               |
| ---------- | ------------------- | ------- | ----------------------------------------- |
| frameIndex | `MayBeRef<number>`  | 0       | Animation frame index                     |
| frameRate  | `MayBeRef<boolean>` | 17      | Animation frame rate                      |
| infinite   | `MayBeRef<boolean>` | true    | Animation will repeat right after the end |

## Demo

```ts
import { Stage, Layer, Sprite, watch } from "fcanvas"

const stage = new Stage().mount("#app")
const layer = new Layer().addTo(stage)

const animations = {
  idle: [
    // x, y, width, height (4 frames)
    2, 2, 70, 119, 71, 2, 74, 119, 146, 2, 81, 119, 2262, 76, 119
  ],
  punch: [
    // x, y, width, height (4 frames)
    2, 138, 74, 122, 76, 138, 84, 122, 346, 138, 120, 122
  ]
}

const blob = new Sprite({
  x: 50,
  y: 50,
  image: imageObj,
  animation: "idle",
  animations,
  frameRate: 7,
  frameIndex: 0
})
// add the shape to the layer
layer.add(blob)
// add the layer to the stage
stage.add(layer)
// start sprite animation
blob.start()

window.addEventListener("click", () => {
  blob.$.animation = "punch"
  const watcher = watch(blob.currentFrameIndex, (index) => {
    if (index === 2) {
      setTimeout(() => {
        watcher()
        blob.$.animation = "idle"
      }, 1000 / 7)
    }
  })
})
```

<Preview />
