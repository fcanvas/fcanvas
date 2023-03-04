# Event

All subject objects inherit DOM primitives like `click`, `mousemove`...

The following objects own this Event API: 
- [Stage](./Stage)
- [Layer](./Layer)
- [Group](./Group)
- [Shape](./Shape)
- and all shape. Example [Arc](/guide/shapes/Arc), [Rect](/guide/shapes/Rect)...


## on()
Listen to events
```ts
on(name: string, cb: (event: Event) => void): void
```

## off()
Remove listen to events
```ts
off(name: string, cb?: (event: Event) => void): void
```

Demo:
```ts
import { Stage, Layer, Circle } from "fcanvas"

const stage = new Stage().mount("#app")
const layer = new Layer().addTo(stage)

const circle = new Circle({
  x: stage.size.width / 2,
  y: stage.size.height / 2,
  fill: "red"
}).addTo(layer)

circle.on("click", () => {
  circle.$.fill = "blue"
})
```
<Preview />
