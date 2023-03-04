# Other Utils

`fcanvas` provides you with several functions to process logic and write faster

## $

This function is an alias of [computed](/guide/essentials/computed)

```ts
const y = $(() => mousePos.y * 2)
```

equal

```ts
const y = computed(() => mousePos.y * 2)
```

## clamp

Clamp a value between a minimum and maximum value.

- **Type**

```ts
function clamp(value: number, min: number, max: number): number
```

| Name  | Description         |
| ----- | ------------------- |
| value | number to constrain |
| min   | minimum limit       |
| max   | maximum limit       |

```
min <= value <= max
```

- **Return**
  constrained number

- **Examples**

```ts
clamp(12, 0, 100) // 12
```

## cropImage

This function allows an image to be cropped and rotated. Useful when you want to get an image from a `Tiles`

- **Type**

```ts
function cropImage(
  image: CanvasImageSource,
  x = 0,
  y = 0,
  width: number = image.width as number,
  height: number = image.height as number,
  rotate = 0
): OffscreenCanvas
```

| Name   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| image  | source image it accepts a source image canvas as an argument an [HTMLImageElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement), an [SVGImageElement](https://developer.mozilla.org/en-US/docs/Web/API/SVGImageElement), an [HTMLVideoElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement), an [HTMLCanvasElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement), an [ImageBitmap](https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap), an [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas), and [VideoFrame](https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame) |
| x      | x-axis coordinates start to cut                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| y      | y-axis coordinates start to cut                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| width  | How wide is the crop?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| height | How height is the crop?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| rotate | How many degrees to crop the image? for example if the image to be taken is horizontal, specify this value as -90                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

- **Return**
  Returns an [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) containing the cropped image

- **Examples**

```ts
const result = cropImage(image, 0, 0, 10, 10, 0)
```

## getMousePos

Hàm này trả về vị trí chuột (hoặc touch) đã được tính toán về gốc tọa độ của `element`

- **Type**

```ts
interface MousePos {
  x: number
  y: number
  winX: number
  winY: number
  id: number
}

function getMousePos(
  event: TouchEvent | MouseEvent,
  element?: OffscreenCanvas | HTMLCanvasElement,
  uid?: string,
  limit = 1,
  useTouches = false
): MousePos[]
```

| Name       | Description                                                                                                                                                                       |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| event      | the event trigger can be a [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) or [TouchEvent](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent) |
| element    | `canvas` element to reset coordinates                                                                                                                                             |
| uid        | This option to check WebWorker support                                                                                                                                            |
| limit      | Limit scan `touches` and `changedTouches`                                                                                                                                         |
| useTouches | whether to force the use of `touches`. If this function takes `event` from `touchend` it will calculate itself with `changedTouches` this option will prevent that                |

- **Return**
  an array containing the calculated position

- **Examples**

```ts
const pos = getMousePos(event, canvas)
```

## haveIntersection

Check to see if any collision occurs:

- **Type**

```ts
function aveIntersection(el1: Shape, el2: Shape): boolean
```

## inRange

Check if the value is within the allowable range

- **Type**

```ts
function inRange(value: number, start: number, stop: number): booolean
```

- **Return**
  Return `true` if within the allowable range

- **Examples**

```ts
inRange(0, 5, 10) // true
inRange(0, -1. 10) // false
```

## lerp

Calculates a number between two numbers at a specific increment. The amt parameter is the amount to interpolate between the two values where 0.0 is equal to the first point, 0.1 is very near the first point, 0.5 is half-way in between, and 1.0 is equal to the second point. If the value of amt is more than 1.0 or less than 0.0, the number will be calculated accordingly in the ratio of the two given numbers. The lerp() function is convenient for creating motion along a straight path and for drawing dotted lines.

- **Type**

```ts
function lerp(start: number, stop: number, amt: number): number
```

- **Return**
  lerped value

- **Examples**

```ts
lerp(10, 20, 0.5) // 15
```

## loadFont

Loads an opentype font file (.otf, .ttf) from a file or a URL, and returns a `Promise<string>`. This function is asynchronous, meaning it may not finish before the next line in your sketch is executed.

The path to the font should be relative to the HTML file that links in your sketch. Loading fonts from a URL or other remote location may be blocked due to your browser's built-in security.

- **Type**

```ts
function loadFont(
  url: string,
  fontFamily = unCamelCase(basename(url)),
  onProgress?: (this: XMLHttpRequest, event: ProgressEvent) => void,
  onAllReady?: boolean
): Promise<string>
```

| Name       | Description                                 |
| ---------- | ------------------------------------------- |
| url        | url font load                               |
| fontFamily | font name set to document                   |
| onProgress | call in progress load font                  |
| onAllReady | callback for when all load font is finished |

- **Return**
  Return `Promise<string>` await font loaded

## loadImage

Download the image. It returns a Promise containing an object of `HTMLImageElement` - **Type**

```ts
function loadImage(url: string): Promise<HTMLImageElement>
```

:::tip
If call `loadImage` image twice for same url it wont reload again
:::

- **Return**
  Return `Promise<HTMLImageElement>` image loaded

- **Examples**

```ts
const image = await loadImage("https://shin.is-a.dev/favicon.ico")

document.body.appendChild(image)
```

### map

Re-maps a number from one range to another.

In the first example above, the number 25 is converted from a value in the range of 0 to 100 into a value that ranges from the left edge of the window (0) to the right edge (width).

- **Type**

```ts
function map(
  value: number,
  start: number,
  stop: number,
  min: number,
  max: number,
  withinBounds?: boolean
): number
```

| Name         | Description                                              |
| ------------ | -------------------------------------------------------- |
| value        | the incoming value to be converted                       |
| start1       | lower bound of the value's current range                 |
| stop1        | upper bound of the value's current range                 |
| start2       | lower bound of the value's target range                  |
| stop2        | upper bound of the value's target range                  |
| withinBounds | constrain the value to the newly mapped range (Optional) |

- **Return**
  remapped number

- **Examples**

```ts
map(5, 0, 10, 100, 200) // 150
```

## normalize

Normalize the value. this fixes silly errors like `0.1 + 0.2 > 0.3`

- **Type**

```ts
function normalize(n: number, min: number, max: number): number
```

- **Return**
  Return valuer normalized

- **Examples**

```ts
normalize(50, 0, 100) // 50
normalize(125, 0, 100) //25
normalize(-25, 0, 100) // 75
```

## random

Return a random floating-point number.

Takes either 0, 1 or 2 arguments.

If no argument is given, returns a random number from 0 up to (but not including) 1.

If one argument is given and it is a number, returns a random number from 0 up to (but not including) the number.

If one argument is given and it is an array, returns a random element from that array.

If two arguments are given, returns a random number from the first argument up to (but not including) the second argument.

- **Type**

```ts
function random(value: number): number
function random<T>(array: ArrayLike<T>): T
function random(start: number, stop: number): number
```

- **Return**
  Return value randomized

- **Examples**

```ts
random(100) // 0 <= x <= 100
random(["a", "b", "c"]) // x in "a" or "b" or "c"
random(50, 100) // 50 <= x <= 100
```

## randomColor

Returns a random hexadecimal color code from `0x00000` to `0xffffff`

- **Type**

```ts
function randomColor(): string
```

- **Return**
  Color random format hexa

- **Examples**

```ts
randomColor() // Return color. Example #f00a23
```

## range

Create a `Range` of values

- **Type**

```ts
function range(stop: number): Range
function range(start: number, stop: number, step?: number): Range
```

- **Return**
  Return `Range`

- **Examples**

```ts
Array.from(range(1, 10)) // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

:::tip
This function simulates `range` in Python
:::

## sleep

Return a wait promise

- **Type**

```ts
function sleep(ms: number): Promise<void>
```

- **Return**
  Return `Promise<void>`

- **Examples**

```ts
console.log("wait 1s...")
await sleep(1000)
console.log("hello world")
```

## toCanvas

output a `canvas`

- **Type**

```ts
interface OptionsToCanvas {
  x?: number
  y?: number
  width?: number
  height?: number
  pixelRatio?: number
}
function toCanvas(
  fElement: Layer | Shape | Group | Stage,
  config?: OptionsToCanvas
): HTMLCanvasElement
```

- **Return**
  Return `HTMLCanvasElement`

- **Examples**

```ts
const layer = new Layer({
  width: 300,
  height: 150
})
new Rect({
  x: 0,
  y: 0,
  width: 40,
  height: 40,
  fill: "red"
}).addTo(layer)

layer.draw()

console.log(toCanvas(layer).toDataURL())
```

## toReactive

Converts ref to reactive. Also made possible to create a "swapable" reactive object.

- **Type**

```ts
function toReactive<T extends object>(objectRef: T | Ref<T>): T
```

- **Examples**

```ts
const refState = ref({ foo: "bar" })

console.log(refState.value.foo) // => 'bar'

const state = toReactive(refState) // <--

console.log(state.foo) // => 'bar'

refState.value = { bar: "foo" }

console.log(state.foo) // => undefined
console.log(state.bar) // => 'foo'
```
