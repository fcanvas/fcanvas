# Optimizing canvas

The [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) element is one of the most widely used tools for rendering 2D graphics on the web. However, when websites and apps push the Canvas API to its limits, performance begins to suffer. This article provides suggestions for optimizing your use of the canvas element to ensure that your graphics perform well.

:::tip
`fcanvas` has done it all for you to improve performance, but you can still improve it further with the following performance tips
:::

The following is a collection of tips to improve canvas performance.

### [Avoid floating-point coordinates and use integers instead](#avoid_floating-point_coordinates_and_use_integers_instead)

Sub-pixel rendering occurs when you render objects on a canvas without whole values.

```ts
const circle = new Circle({
  x: 0.3,
  y: 0.5,
  radius: 15.9
})
```

This forces the browser to do extra calculations to create the anti-aliasing effect. To avoid this, make sure to round all co-ordinates used in calls to [`drawImage()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage "drawImage()") using [`Math.floor()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor), for example.

### [Don't scale images in `drawImage`](#dont_scale_images_in_drawimage)

:::tip
Since version 0.3 you don't have to worry about this `fcanvas` does it automatically
:::
Cache various sizes of your images on an offscreen canvas when loading as opposed to constantly scaling them in `crop` [Image](/guide/shapes/Image), [ImageRepeat](/guide/shapes/ImageRepeat), [Sprite](/guide/shapes/Sprite)

### [Use multiple layered canvases for complex scenes](#use_multiple_layered_canvases_for_complex_scenes)

In your application, you may find that some objects need to move or change frequently, while others remain relatively static. A possible optimization in this situation is to layer your items using multiple `Layer` elements.

For example, let's say you have a game with a UI on top, the gameplay action in the middle, and a static background on the bottom. In this case, you could split your game into three `Layer` layers. The UI would change only upon user input, the gameplay layer would change with every new frame, and the background would remain generally unchanged.

```ts
const layerMain = new Layer()
const layerBackground = new Layer()
```

### [Use plain CSS for large background images](#use_plain_css_for_large_background_images)

If you have a static background image, you can draw it onto a plain [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div) element using the CSS [`background`](https://developer.mozilla.org/en-US/docs/Web/CSS/background) property and position it under the canvas. This will negate the need to render the background to the canvas on every tick.

### [Scaling canvas using CSS transforms](#scaling_canvas_using_css_transforms)

:::tip
You don't need to worry about this with the new algorithm applied from version 0.3 this becomes meaningless
:::
[CSS transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transforms/Using_CSS_transforms) are faster since they use the GPU. The best case is to not scale the canvas, or have a smaller canvas and scale up rather than a bigger canvas and scale down.

```ts
const scaleX = window.innerWidth / canvas.width
const scaleY = window.innerHeight / canvas.height

const scaleToFit = Math.min(scaleX, scaleY)
const scaleToCover = Math.max(scaleX, scaleY)

stage[DIV_ELEMENT].style.transformOrigin = "0 0" //scale from top left
stage[DIV_ELEMENT].style.transform = `scale(${scaleToFit})`
```

### [Turn off transparency](#turn_off_transparency)

:::tip
You don't need to worry about this with the new algorithm applied from version 0.3 this becomes meaningless
:::

If your application uses canvas and doesn't need a transparent backdrop, set the `alpha` option to `false` when creating a drawing context with [`HTMLCanvasElement.getContext()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext). This information can be used internally by the browser to optimize rendering.

### [Scaling for high resolution displays](#scaling_for_high_resolution_displays)

You may find that canvas items appear blurry on higher-resolution displays. While many solutions may exist, a simple first step is to scale the canvas size up and down simultaneously, using its attributes, styling, and its context's scale.

```ts
// Get the DPR and size of the canvas
const dpr = window.devicePixelRatio
const rect = canvas.getBoundingClientRect()

// Set the "actual" size of the canvas
canvas.width = rect.width * dpr
canvas.height = rect.height * dpr

// Scale the context to ensure correct drawing operations
ctx.scale(dpr, dpr)

// Set the "drawn" size of the canvas
canvas.style.width = `${rect.width}px`
canvas.style.height = `${rect.height}px`
```

### [Using Group](#using_group)
If you have a lot of elements that don't change often you can use [Group](/guide/essentials/Group) to group them together

Reference: [Usage Group](/guide/essentials/Group)

### [Using WebWorker](#using_webworker)

It's a bit odd that WebWorker is here because in general using WebWorker doesn't bring any performance improvement it just keeps your application from getting blocked by heavy tasks.

Reference: [Usage @fcanvas/worker](/guide/plugins/worker)
