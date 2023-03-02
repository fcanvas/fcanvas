To fill a shape with `fcanvas`, we can set the fill property when we instantiate a shape, or we can use the `fill` attrs.

Konva supports colors, patterns, linear gradients, and radial gradients.

Instructions: Mouseover each pentagon to change its fill. You can also drag and drop the shapes.

```ts
import { Stage, Layer, Arc } from "fcanvas"

const stage = new Stage().mount("#app")
const layer = new Layer().addTo(stage)

const colorPentagon = new RegularPolygon({
  x: 80,
  y: stage.size.height / 2,
  sides: 5,
  radius: 70,
  fill: 'red',
  stroke: 'black',
  strokeWidth: 4,
});

const patternPentagon = new RegularPolygon({
  x: 220,
  y: stage.size.height / 2,
  sides: 5,
  radius: 70,
  fillPattern: {
    image: await loadImage("https://google.com/favicon.ico"),
  },
  stroke: 'black',
  strokeWidth: 4,
});

const linearGradPentagon = new RegularPolygon({
  x: 360,
  y: stage.size.height / 2,
  sides: 5,
  radius: 70,
  fillLinearGradient: {
    start: { x: -50, y: -50 },
    end: { x: 50, y: 50 },
    colorStops: [[0, 'red'], [1, 'yellow']]
  },
  stroke: 'black',
  strokeWidth: 4,
});

const radialGradPentagon = new RegularPolygon({
  x: 500,
  y: stage.size.height / 2,
  sides: 5,
  radius: 70,
  fillRadialGradient: {
    start: { x: 0, y: 0 },
    startRadius: 0,
    end: { x: 0, y: 0 },
    endRadius: 70,
    colorStops: [[0, 'red'], [0.5, 'yellow'], [1, 'blue']],
  },
  stroke: 'black',
  strokeWidth: 4,
});

/*
 * bind listeners
 */
colorPentagon.on('mouseover touchstart', () => {
  colorPentagon.$.fill = ('blue');
});

colorPentagon.on('mouseout touchend', () => {
  colorPentagon.$.fill = ('red');
});

patternPentagon.on('mouseover touchstart', () => {
  patternPentagon.$.fillPattern = {
   image: await loadImage("https://shin.is-a.dev/favicon.ico"),
  }
});

patternPentagon.on('mouseout touchend', () => {
  patternPentagon.$.fillPattern = {
   image: await loadImage("https://google.com/favicon.ico"),
  }
});

linearGradPentagon.on('mouseover touchstart', () => {
  patternPentagon.$.fillLinearGradient = {
   start: { x: -50, y: 0 },
   end: { x: 50, y: 0 },
   colorStops: [[0, "green"], [1, "yellow"]]
  }
});

linearGradPentagon.on('mouseout touchend', () => {
  patternPentagon.$.fillLinearGradient = {
   start: { x: -50, y: 0 },
   end: { x: 50, y: 0 },
   colorStops: [[0, "red"], [1, "yellow"]]
  }
});

radialGradPentagon.on('mouseover touchstart', () => {
  radialGradPentagon.$.fillRadialGradient.colorStops = [
    [0, 'red'],
    [0.5, 'yellow'],
    [1, 'green']
  ]
});

radialGradPentagon.on('mouseout touchend', () => {
  radialGradPentagon.$.fillRadialGradient.colorStops = [
    [0, 'red'],
    [0.5, 'yellow'],
    [1, 'blue']
  ]
});

layer.add(colorPentagon);
layer.add(patternPentagon);
layer.add(linearGradPentagon);
layer.add(radialGradPentagon);
```