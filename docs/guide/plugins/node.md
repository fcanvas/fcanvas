# @fcanvas/node

Plugin allow use fcanvas in NodeJS

View source code at: https://github.com/tachibana-shin/fcanvas-next

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
