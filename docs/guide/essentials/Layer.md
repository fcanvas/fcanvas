# Layer

`Layer` contains [Shape](./Shape) and [Group](./Group) which represent an actual drawn canvas

In addition, this shape also provides a few other parameters:

## Optional Option


| Name      | Type                                 | Default          | Description                                                                                                                                                                                                                |
| --------- | ------------------------------------ | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| width     | `MayBeRef<string>`                   | = Stage width ?? 300              | width length                                                                                                                                                                                                               |
| height    | `MayBeRef<string>`                   | = Stage height ?? 300              | height length                                                                                                                                                                                                              |
| visible   | `MayBeRef<boolean>`                  | true             | Is the stage displayed?                                                                                                                                                                                                    |
| opacity   | `MayBeRef<number>`                   | 1                | Sets the opacity of the stage                                                                                                                                                                                              |
| clip | `MayBeRef<Rect \| Path2D>` | undefined | The layer will be clipped whether it accepts a `Rect` or [Path2D](https://developer.mozilla.org/en-US/docs/Web/API/Path2D/Path2D)  |
| autoDraw  | `MayBeRef<boolean>`                  | true             | added [Layer](./Layer) will automatically be drawn                                                                                                                                                                         |
| clearBeforeDraw | `MayBeRef<boolean>`                  | true             | clear after draw? |
| offscreen | `MayBeRef<boolean>`                  | false            | if it is `true` the stage will not show anything. the `container` option will be disabled. you don't need to care about this it is automatically installed in different environments like `browser`, `nodejs`, `worker`... |
| filter    | `MayBeRef<"none" \| Filter>`         | "none"           | filter                                                                                                                                                                                                                     |
| x         | `MayBeRef<number>`                   | 0                | x from option [Transform](/guide/styling/transform)                                                                                                                                                                        |
| y         | `MayBeRef<number>`                   | 0                | y from option [Transform](/guide/styling/transform)                                                                                                                                                                        |
| scale     | `MayBeRef<{ x: number; y: number }>` | `{ x: 1, y: 1 }` | scale from option [Transform](/guide/styling/transform)                                                                                                                                                                    |
| rotation  | `MayBeRef<number>`                   | 0                | rotation from option [Transform](/guide/styling/transform)                                                                                                                                                                 |
| offset    | `MayBeRef<{ x: number; y: number }>` | `{ x: 1, y: 1 }` | offset from option [Transform](/guide/styling/transform)                                                                                                                                                                   |
| skewX     | `MayBeRef<number>`                   | 1                | skewX from option [Transform](/guide/styling/transform)                                                                                                                                                                    |
| skewY     | `MayBeRef<number>`                   | 1                | skewY from option [Transform](/guide/styling/transform)                                                                                                                                                                    |

```ts
interface Filter {
  url?: string // string
  blur?: number // px
  brightness?: number // int%
  contrast?: number // 0 -> 100%
  dropShadow?: {
    x?: number
    y?: number
    blur?: number // intpx > 0
    color: string
  }
  greyscale?: number // int%
  hueRotate?: number // 0 -> 360 deg
  invert?: number // int%
  opacity?: number // 0 -> 100%
  saturate?: number // int%
  sepia?: number // int%
}
```

## Get
### $ (as attrs)
A Proxy that contains all the settings allowing to get/set the value of props and react automatically
```tsx
stage.$.clearBeforeDraw = false

console.log(stage.$.clearBeforeDraw) // false
```
### uid
A `uid` `Layer`. Return value is `string`

## Methods

### getBoundingClientRect()
This function returns the size and position of the expression of `Stage` it's the same as [Element.getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
```tsx
getBoundingClientRect(): {
  width: number
  height: number
  x: number
  y: number
}
```

### draw()
Make `Layer` draw once. It returns a `boolean` that checks if the `Layer` needs redraw
```tsx
draw(): boolean
```

### batchDraw()
Smart redraw. This function will redraw `Layer` continuously until `stopDraw()` is called.

If it detects that `Layer` doesn't need to be redrawn it will pause the drawing process and wait until the `Layer` changes and resume drawing.
:::tip
This function is automatically called if `autoDraw !== false`
:::
```tsx
batchDraw(): void
```

### stopDraw()
Stop the continuous redraw called with `batchDraw()`
```tsx
stopDraw(): void
```

### add(node)
Add an element to `Layer`. `node` is [Shape](./Shape) or [Group](./Group)

```tsx
add(node: Shape | Group): ChildNodes
```

### delete(node)
Delete an element to `Layer`. `node` is [Shape](./Shape) or [Group](./Group)

```tsx
delete(node: Shape | Group): boolean
```

### isPressedPoint(x, y)
Check if the point with coordinates `{x,y}` is in `Layer` or not
```tsx
isPressedPoint(x: number, y: number): boolean
```

### addTo(stage)
Where to add `Layer`
```tsx
addTo(stage: Stage): void
```

it is equivalent to
```tsx
stage.add(layer)
```

### destroy()
Destroy `Layer`
```tsx
destroy(): void
```
