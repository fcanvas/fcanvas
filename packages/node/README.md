# @fcanvas/node

Plugin allow use fcanvas in NodeJS

View source code at: https://github.com/fcanvas/fcanvas

[![NPM](https://badge.fury.io/js/@fcanvas%2Fnode.svg)](http://badge.fury.io/js/@fcanvas%2Fnode)
[![Size](https://img.shields.io/bundlephobia/minzip/@fcanvas/node/latest)](https://npmjs.org/package/@fcanvas/node)
[![Download](https://img.shields.io/npm/dm/@fcanvas/node)](https://npmjs.org/package/@fcanvas/node)

### Install
```bash
pnpm add fcanvas @fcanvas/node
```

### Usage
```ts
import { Layer, Circle } from "@fcanvas/node"

const layer = new Layer()
layer.add(new Circle({ x: 100, y: 100, radius: 50, stroke: '#000' }))

layer.to
```

except `Stage` you can use anything from `fcanvas` through `@fcanvas/node`
