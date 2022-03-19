# fcanvas-next

A next version library fcanvas, Its syntax looks like Konva.js but it uses ES6's Proxy response system and minimizes redrawing.
[View docs](https://tachibana-shin.github.io/fcanvas-next)

[![Build](https://github.com/tachibana-shin/fcanvas-next/actions/workflows/docs.yml/badge.svg)](https://github.com/tachibana-shin/fcanvas-next/actions/workflows/docs.yml)
[![NPM](https://badge.fury.io/js/fcanvas-next.svg)](http://badge.fury.io/js/fcanvas-next)

## Installation

NPM / Yarn:

```bash
yarn add fcanvas-next
```

CDN:

```html
<script src="https://unpkg.com/fcanvas-next"></script>
```

## Example

```ts
import { Stage, Layer, Circle } feom "fcanvas-next"

const stage = new Stage({
  container: "app",
  width: 300,
  height: 300
})

const layer = new Layer()
stage.add(layer)
layer.add(new Circle({
  x: 0,
  y: 0,
  radius: 20,
  fill: "red"
}))
```
