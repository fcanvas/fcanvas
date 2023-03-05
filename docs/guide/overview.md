---
title: fCanvas Overview
---

# Overview

## How does it work?

Every thing starts from `Stage` that contains several user's layers (`Layer`).

Each layer has two `<canvas>` renderers: a scene renderer and a hit graph renderer.
The scene renderer is what you can see, and the hit graph renderer is a special hidden
canvas that's used for high performance event detection.

Each layer can contain shapes, groups of shapes, or groups of other groups.
The stage, layers, groups, and shapes are virtual nodes, similar to DOM nodes in an HTML page.

Here's an example Node hierarchy:

```
                   Stage
                     |
              +------+------+
              |             |
            Layer         Layer
              |             |
  +-----+-----+-----+     Shape
  |     |           |
Shape  Group       Group
        |           |
        +       +---+---+
        |       |       |
     Shape   Group    Shape
                |
                +
                |
              Shape
```

All nodes can be styled and transformed. Although `fcanvas` has prebuilt shapes available,
such as rectangles, circles, images, sprites, text, lines, polygons, regular polygons, paths, stars, etc.,
you can also create custom shapes by instantiating the `Shape` class and creating a draw function.

Once you have a stage set up with layers and shapes,
you can bind event listeners, transform nodes, run animations,
apply filters, and much more.

Minimal code example:

:::preview
```ts
import { Stage, Layer, Circle } from "fcanvas"
// first we need to create a stage
const stage = new Stage({
  width: 500,
  height: 500
}).mount("#container") // selector of container <div>

// then create layer
const layer = new Layer()

// create our shape
const circle = new Circle({
  x: stage.size.width / 2,
  y: stage.size.height / 2,
  radius: 70,
  fill: "red",
  stroke: "black",
  strokeWidth: 4
})

// add the shape to the layer
layer.add(circle)

// add the layer to the stage
stage.add(layer)

// draw the image, call this if autoDraw=false
// layer.draw();
```
:::

## Basic shapes

fCanvas supports shapes:
[Rect](/guide/shapes/Rect)
[Circle](/guide/shapes/Circle),
[Ellipse](/guide/shapes/Ellipse),
[Line](/guide/shapes/Line),
[Polygon](/guide/shapes/Line-Polygon),
[Spline](/guide/shapes/Line-Spline),
[Blob](/guide/shapes/Line-Blob),
[Image](/guide/shapes/Image)
[Text](/guide/shapes/Text),
[TextPath](/guide/shapes/TextPath),
[Star](/guide/shapes/Star),
[Label](/guide/shapes/Label),
[SVG Path](/guide/shapes/Path),
[RegularPolygon](/guide/shapes/RegularPolygon).
Also you can create
[custom shape](/guide/shapes/Custom):

```ts
const triangle = new Shape({
  sceneFunc(context) {
    context.beginPath()
    context.moveTo(20, 50)
    context.lineTo(220, 80)
    context.quadraticCurveTo(150, 100, 260, 170)
    context.closePath()

    // special fCanvas method
    this.fillStrokeScene()
  },
  fill: "#00D2FF",
  stroke: "black",
  strokeWidth: 4
})
```

<Preview>
layer.add(triangle)
</Preview>

## Styles

Each shape supports the following style properties:

- Fill. Solid color, gradients or images
- Stroke (color, width)
- Shadow (color, offset, opacity, blur)
- Opacity

```ts
const pentagon = new RegularPolygon({
  x: stage.size.width / 2,
  y: stage.size.height / 2,
  sides: 5,
  radius: 70,
  fill: 'red',
  stroke: 'black',
  strokeWidth: 4,
  shadow: {
    x: 20,
    y: 25,
    blur: 40,
    color: "#000"
  }
  opacity : 0.5
});
```

<Preview>
layer.add(triangle)
</Preview>

## Events

With `fcanvas` you can listen to all primitive events (`click`, `dblclick`, `mouseover`, `touchmove`, `dragstart`...)

```ts
circle.on("click", () => {
  console.log("user input")
})
circle.on("mousemove", () => {
  console.log("position change")
})
```

> You can track component value change like `x`, `y`, `color`, `shadow`... but it belongs to [Watchers](/guide/essentials/watchers).

## Filters

`fcanvas` has several filters: blur, invert, noise etc. For all available filters see [Filters](/guide/styling/filter).

## Animation

You can create animations via package `@fcanvas/animate`:

:::preview
```ts
import { Stage, Layer, Circle, Shape } from "fcanvas"
import { installAnimate } from "@fcanvas/animate"
installAnimate(Shape)

const stage = new Stage().mount("#container")
const layer = new Layer()
stage.add(layer)

const circle = new Circle({
  x: 0,
  y: 0,
  radius: 30,
  fill: "red"
})
layer.add(circle)

circle.on("click", () => {
  circle.to({
    x: 100,
    y: 100,
    fill: "blue"
  })
})
```
:::

## Selectors

::: danger
As of version 1.1 the api selectors will be removed to ensure JavaScript's automatic cleaner works properly.
:::

## Serialisation and Deserialization

:::tip
Since version 1.1 these apis are also dropped as it has become much easier with the help of `Proxy`
:::

```ts
const json = JSON.stringify(stage.$)
```

Also you can restore objects from JSON:

```ts
const json = "{x:0,y:0,radius:50}"

const circle = new Circle(JSON.parse(json))
```

## Performance

`fcanvas` has a powerful reactivity system powered by `@vue/reactivity` so it will apply speed optimization techniques from the start:

### Caching

Caching allows you to draw an element into buffer canvas. Then draw element from the canvas. It may improve performance a lot for complex nodes such as text or shapes with shadow and strokes.

It also tries to find out if the properties ever change

```ts
circle.$.x = 100 // re-render
circle.$.x = 100 // not re-render

circle.$.x = 101 // wait change
circle.$.y = 101 // re-render 1
```

However you can also force a `Layer` so that it `re-render` regardless of the change:

```ts
layer.markChange()
```

### Split Layer

As framework supports several `<canvas>` elements you can put objects at your discretion.
For example your application consists from complex background and several moving shapes. You can use one layer for background and another one for shapes.
While updating shapes you don't need to update background canvas.

You can find all available performance tips here:
[Performance](/guide/extra-topics/performance)
