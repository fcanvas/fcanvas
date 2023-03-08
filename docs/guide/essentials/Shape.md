# Shape

`Shape` is the source of display elements like [Arc](/guide/shapes/Arc), [Rect](/guide/shapes/Rect)...

Any method or something that exists in `Shape` also exists in its children

## Requrie Option

| Name | Type               | Description |
| ---- | ------------------ | ----------- |
| x    | `MayBeRef<number>` | x           |
| y    | `MayBeRef<number>` | y           |

## Optional Option

| Name                   | Type                                                                       | Default          | Description                                                                                                                                                                                                                                                         |
| ---------------------- | -------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fillAfterStrokeEnabled | `MayBeRef<boolean>`                                                        | false            | if enabled then `fill()` will be executed before `stroke()`                                                                                                                                                                                                         |
| fillEnabled            | `MayBeRef<boolean>`                                                        | true             | if enabled then `fill()` will be executed                                                                                                                                                                                                                           |
| strokeEnabled          | `MayBeRef<boolean>`                                                        | true             | if enabled then `stroke()` will be executed                                                                                                                                                                                                                         |
| stroke                 | `MayBeRef<string \| CanvasGradient \| CanvasPattern>`                      | "#000"           | Resource to draw it accept hexa color code, rgb, hls, hue... [More](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeStyle)                                                                                                          |
| fill                   | `MayBeRef<string \| CanvasGradient \| CanvasPattern>`                      | "#000"           | Resource to draw it accept hexa color code, rgb, hls, hue... [More](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeStyle)                                                                                                          |
| strokeWidth            | `MayBeRef<number>`                                                         | 1                | border size                                                                                                                                                                                                                                                         |
| hitStrokeWidth         | `MayBeRef<number>`                                                         | 1                |                                                                                                                                                                                                                                                                     |
| strokeHitEnabled       | `MayBeRef<boolean>`                                                        | false            | if enabled then `strokeHit()` will be executed                                                                                                                                                                                                                      |
| perfectDrawEnabled     | `MayBeRef<boolean>`                                                        | true             | use redraw optimization strategy                                                                                                                                                                                                                                    |
| shadowForStrokeEnabled | `MayBeRef<boolean>`                                                        | false            | enable shading for the whole border                                                                                                                                                                                                                                 |
| lineJoin               | `MayBeRef<"bevel" \| "round" \| "miter">`                                  | "miter"          | https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin                                                                                                                                                                                  |
| lineCap                | `MayBeRef<"butt" \| "round" \| "square">`                                  | "butt"           | https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineCap                                                                                                                                                                                   |
| sceneFunc              | (ctx: Context2D) => void                                                   | undefined        | function execute drawing when customizing Shape                                                                                                                                                                                                                     |
| fillPriority           | `MayBeRef<"color" \| "linear-gradient" \| "radial-gradient" \| "pattern">` | auto             | `fill` style when there are many options. By default `Shape` searches in order                                                                                                                                                                                      |
| fillPattern            | `MayBeRef<FillPattern>`                                                    | undefined        | [see below](#fillPattern)                                                                                                                                                                                                                                           |
| fillLinearGradient     | `MayBeRef<FillModelLinearGradient>`                                        | undefined        | [see below](#fillLinearGradient)                                                                                                                                                                                                                                    |
| fillLinearGradient     | `MayBeRef<FillModelLinearGradient>`                                        | undefined        | [see below](#fillLinearGradient)                                                                                                                                                                                                                                    |
| shadowEnabled          | `MayBeRef<boolean>`                                                        | true             | enable shadow                                                                                                                                                                                                                                                       |
| shadow                 | `MayBeRef<Shadow>`                                                         | undefied         | [see below](#shadow)                                                                                                                                                                                                                                                |
| dash                   | `MayBeRef<number[]>`                                                       | undefined        | Sets the line dash pattern used when stroking lines. It uses an array of values that specify alternating lengths of lines and gaps which describe the pattern. Equivalent to: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash |
| dashEnabled            | `MayBeRef<boolean>`                                                        | true             | Set if the line dash pattern should be used                                                                                                                                                                                                                         |
| visible                | `MayBeRef<boolean>`                                                        | true             | show shape                                                                                                                                                                                                                                                          |
| filter                 | `MayBeRef<"none" \| Filter>`                                               | "none"           | filter                                                                                                                                                                                                                                                              |
| x                      | `MayBeRef<number>`                                                         | 0                | x from option [Transform](/guide/styling/transform)                                                                                                                                                                                                                 |
| y                      | `MayBeRef<number>`                                                         | 0                | y from option [Transform](/guide/styling/transform)                                                                                                                                                                                                                 |
| scale                  | `MayBeRef<{ x: number; y: number }>`                                       | `{ x: 1, y: 1 }` | scale from option [Transform](/guide/styling/transform)                                                                                                                                                                                                             |
| rotation               | `MayBeRef<number>`                                                         | 0                | rotation from option [Transform](/guide/styling/transform)                                                                                                                                                                                                          |
| offset                 | `MayBeRef<{ x: number; y: number }>`                                       | `{ x: 1, y: 1 }` | offset from option [Transform](/guide/styling/transform)                                                                                                                                                                                                            |
| skewX                  | `MayBeRef<number>`                                                         | 1                | skewX from option [Transform](/guide/styling/transform)                                                                                                                                                                                                             |
| skewY                  | `MayBeRef<number>`                                                         | 1                | skewY from option [Transform](/guide/styling/transform)                                                                                                                                                                                                             |

## Complex options

### fillPattern {#fillPattern}

This option allows to fill with complex things like images, canvas.

See more at: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createPattern

```ts
interface FillPattern extends TransformOptions {
  image: CanvasImageSource | string
  repeat?: "repeat" | "repeat-x" | "repeat-y" | "no-repeat"
}
```

| Name   | Type                                                            | Description                                                                               |
| ------ | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| image  | `MayBeRef<CanvasImageSource \| string>`                         | this option takes the same parameter as `image` mentioned in [Image](/guide/shapes/Image) |
| repeat | `MayBeRef<"repeat" \| "repeat-x" \| "repeat-y" \| "no-repeat">` | how to repeat the pattern's image                                                         |

:::tip
`fillPattern` accepts any parameters that [Transform](/guide/styling/transform) owns
:::

### fillLinearGradient {#fillLinearGradient}

This option of the Canvas 2D API creates a gradient along the line connecting two given coordinates.

See more at: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient

```ts
interface FillModelLinearGradient {
  start: { x: number; y: number }
  end: { x: number; y: number }
  colorStops: [number, string][]
}
```

| Name       | Type                           | Description                                                                                                                                                                                             |
| ---------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| start      | `MayBeRef<Offset>`             | The `{x; y}` coordinate of the start point.                                                                                                                                                             |
| end        | `MayBeRef<Offset>`             | The `{x; y}` coordinate of the end point.                                                                                                                                                               |
| colorStops | `MayBeRef<[number, string][]>` | method adds a new color stop, defined by an offset and a color, to a given canvas gradient. `[offset, color][]`. See more: https://developer.mozilla.org/en-US/docs/Web/API/CanvasGradient/addColorStop |

### fillRadialGradient {#fillRadialGradient}

This option of the Canvas 2D API creates a radial gradient using the size and coordinates of two circles.

See more at: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createRadialGradient

```ts
interface FillModelRadialGradient {
  start: { x: number; y: number }
  startRadius: number
  end: { x: number; y: number }
  endRadius: number
  colorStops: [number, string][]
}
```

| Name        | Type                           | Description                                                                                                                                                                                             |
| ----------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| start       | `MayBeRef<Offset>`             | The `{x; y}` coordinate of the start point.                                                                                                                                                             |
| startRadius | `MayBeRef<number>`             | The radius of the start circle. Must be non-negative and finite.                                                                                                                                        |
| end         | `MayBeRef<Offset>`             | The `{x; y}` coordinate of the end point.                                                                                                                                                               |
| endRadius   | `MayBeRef<number>`             | The radius of the end circle. Must be non-negative and finite.                                                                                                                                          |
| colorStops  | `MayBeRef<[number, string][]>` | method adds a new color stop, defined by an offset and a color, to a given canvas gradient. `[offset, color][]`. See more: https://developer.mozilla.org/en-US/docs/Web/API/CanvasGradient/addColorStop |

### shadow {#shadow}

This option allows shading an image

```ts
interface Shadow {
  x?: number
  y?: number
  color: string
  blur: number
}
```

| Name  | Type               | Description                                                                                                                                                          |
| ----- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| x     | `MayBeRef<number>` | specifies the distance that shadows will be offset horizontally. [see more](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowOffsetX) |
| y     | `MayBeRef<number>` | specifies the distance that shadows will be offset vertically. [see more](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowOffsetY)   |
| color | `MayBeRef<string>` | specifies the color of shadows. [see more](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowColor)                                    |
| blur  | `MayBeRef<string>` | specifies the blur. [see more](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowBlur)                                                 |

## Get

### $ (as attrs)

A Proxy that contains all the settings allowing to get/set the value of props and react automatically

```ts
shape.$.x = 100

console.log(shape.$.x) // 100
```

### clientRect

Returns a `Rect` object describing the internal size and location

```ts
shape.clientRect // { x: 0, y: 0, width: 100, height: 100 }
```

### bounding (as getBoundingClientRect())

Returns a `Rect` object describing the internal size and generate

```ts
shape.bounding // { x: 10, y: 10, width: 100, height: 100 }
```

## Protected Methods

These functions are only available when you customize or inherit `Shape`

### getFill(ctx)

This function will return a `FillStyle` that can be filled based on the option set to `Shape`

```ts
getFill(ctx: Canvas2D): FillStyle | void
```

### fillScene(ctx: Canvas2D, path?: Path2D)

Fill `Shape` optionally and if `path` exists it will fill as specified by `path`

See more: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fill#specifying_a_path_and_a_fillrule

```ts
fillScene(ctx: Canvas2D, path?: Path2D): void
```

### getStroke(ctx: Canvas2D)

Returns the possible value of `stroke` based on the option of `Shape`

### strokeScene(ctx: Canvas2D)

Draw border

```ts
strokeScene(ctx: Canvas2D): void
```

### fillStrokeScene(ctx: Canvas2D): void

Do `fillScene`, `strokeScene` and optionally shader. It depends on setting `shadowForStrokeEnabled`, `fillAfterStrokeEnabled` to decide the order in which to do these 3 things

```ts
fillStrokeScene(ctx: Canvas2D): void
```

### getSize()

Returns the size of the shape

## Methtods

### getBoundingClientRect()

This function returns the size and position of the expression of `Stage` it's the same as [Element.getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)

```ts
getBoundingClientRect(): {
  width: number
  height: number
  x: number
  y: number
}
```

### draw()

Make `Shape` draw once

### isPressedPoint(x, y)

Check if the point with coordinates `{x,y}` is in `Shape` or not

```ts
isPressedPoint(x: number, y: number): boolean
```

### addTo(layer)

Where to add `Layer`

```ts
addTo(stage: Layer): void
```

it is equivalent to

```ts
layer.add(layer)
```

### destroy()

Destroy `Shape`

```ts
destroy(): void
```
