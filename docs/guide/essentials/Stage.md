# Stage

Stage constructor. A stage is used to contain multiple layers

`Stage` is essentially a vault where events interact (api events) and contains `Layer`

in the DOM `Stage` manifests as a `<div>` tag

In addition, this shape also provides a few other parameters:

## Optional Option

| Name      | Type                                 | Default          | Description                                                                                                                                                                                                                |
| --------- | ------------------------------------ | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| container | `MayBeRef<string \| HTMLElement>`    | HTMLDivElement   | Specified element to represent [Layer](./Layer) and event interactions                                                                                                                                                     |
| width     | `MayBeRef<string>`                   | 300              | width length                                                                                                                                                                                                               |
| height    | `MayBeRef<string>`                   | 300              | height length                                                                                                                                                                                                              |
| visible   | `MayBeRef<boolean>`                  | true             | Is the stage displayed?                                                                                                                                                                                                    |
| opacity   | `MayBeRef<number>`                   | 1                | Sets the opacity of the stage                                                                                                                                                                                              |
| autoDraw  | `MayBeRef<boolean>`                  | true             | added [Layer](./Layer) will automatically be drawn                                                                                                                                                                         |
| offscreen | `MayBeRef<boolean>`                  | false            | if it is `true` the stage will not show anything. the `container` option will be disabled. you don't need to care about this it is automatically installed in different environments like `browser`, `nodejs`, `worker`... |
| filter    | `MayBeRef<"none" \| Filter>`         | "none"           | option this set [filter](/guide/styling/filter)                                                                                                                                                                            |
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

```ts
stage.$.container = "#app"

console.log(stage.$.container) // "#app"
```

## Computed

### size

This `computed` returns the manifest size of `Stage`

```ts
const { width, height } = stage.size
```

## Methods

### mount(query)

This function is a shortcut to set `container`

```ts
mount(query: string | HTMLElement): this;
```

it is equivalent to:

```ts
stage.$.container = query
```

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

### add(node)

Add [Layer](./Layer) to `Stage`

```ts
add(node: Layer): ChildNodes
```

### destroy()

Destroy `Stage`

```ts
destroy(): void
```
