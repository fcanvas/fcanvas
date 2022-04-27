# fcanvas

A next version library fcanvas, Its syntax looks like Konva.js but it uses ES6's Proxy response system and minimizes redrawing.
[https://fcanvas.js.org](https://fcanvas.js.org)

[![Build](https://github.com/tachibana-shin/fcanvas-next/actions/workflows/docs.yml/badge.svg)](https://github.com/tachibana-shin/fcanvas-next/actions/workflows/docs.yml)
[![NPM](https://badge.fury.io/js/fcanvas.svg)](http://badge.fury.io/js/fcanvas)

## Installation

NPM / Yarn:

```bash
yarn add fcanvas
```

CDN:

```html
<script src="https://unpkg.com/fcanvas"></script>
```

## Example

```ts
import { Stage, Layer, Circle, rqaf, stop } from "fcanvas"

const stage = new Stage({
  container: "app",
  width: 300,
  height: 300
})

const layer = new Layer()
stage.add(layer)

const cỉrcle = new Circle({
  x: 0,
  y: 0,
  radius: 20,
  fill: "red"
})

layer.add(circle)

rqaf(() => {
  circle._.x += 1 // auto reactive and re-draw

  if (circle._.x === stage._.width) {
    stop()
  }
})
```

## Demos

- Clock: https://codesandbox.io/s/clock-fcanvas-next-kti3b4
