# Group

Group allows you to group [Shape](./Shape) together and display/cache simultaneously

Its APIs are similar to [Shape](./Shape) except it has the same `.add(node: Shape)` and `.delete(node: Shape)` functions as [Layer](./Layer)

## Performance improvements

Using `Group` also allows for performance improvements as you don't have to redraw many static elements continuously

If you have a lot of elements that don't change, group them with `Group` so you don't have to redraw those shapes

:::tip
If most of the elements don't change often, create a new [Layer](./Layer) that has an algorithm that pauses drawing when nothing has changed
:::

:::preview
```ts
import { Stage, Layer, Group, Circle } from "fcanvas"

const stage = new Stage().mount("#app")
const layer = new Layer().addTo(stage)

const group = new Group().addTo(layer)
const circle = new Circle({ x: 10, y: 10, radius: 20, fill: "red" }).addTo(
  group
)
```
:::

## Sync 
Because `fcanvas` automatically applies drawing reduction strategies, in many cases when there is a change, `Group` will not redraw immediately, but wait until the batch change is complete.

If you want to get the image immediately in the process you have to call `await nextTick()`

However many cases need sync code and not `Promise` pass 

```ts
Group({ sync: true })
```

 it will sync the drawings real time

## Position of Shape in Group

Position of shapes will be calculated from position 0 of `Group` for example:

:::preview
```ts
import { Stage, Layer, Group, Circle } from "fcanvas"

const stage = new Stage().mount("#app")
const layer = new Layer().addTo(stage)

const group = new Group({ x: 100, y: 100 }).addTo(layer)
const circle = new Circle({ x: 10, y: 10, radius: 20, fill: "red" }).addTo(
  group
)
```
:::

now the position of the displayed `circle` will be `{ 100 + 10; 100 + 10 }`

The landmark value of offset `Shape` is calculated from the position of `Group`
