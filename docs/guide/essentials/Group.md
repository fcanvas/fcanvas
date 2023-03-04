# Group
Group allows you to group [Shape](./Shape) together and display/cache simultaneously

Its APIs are similar to [Shape](./Shape) except it has the same `.add(node: Shape)` and `.delete(node: Shape)` functions as [Layer](./Layer)


## Performance improvements
Using `Group` also allows for performance improvements as you don't have to redraw many static elements continuously

If you have a lot of elements that don't change, group them with `Group` so you don't have to redraw those shapes

:::tip
If most of the elements don't change often, create a new [Layer](./Layer) that has an algorithm that pauses drawing when nothing has changed
:::

```ts
import { Stage, Layer, Group, Circle } from "fcanvas"

const stage = new Stage().mount("#app")
const layer = new Layer().addto(stage)

const group = new Group().addTo(layer)
const circle = new Circle({ x: 10, y: 10, radius: 20, fill: "red" }).addTo(group)
```

## Position of Shape in Group
Position of shapes will be calculated from position 0 of `Group` for example:

```tsx
import { Stage, Layer, Group, Circle } from "fcanvas"

const stage = new Stage().mount("#app")
const layer = new Layer().addto(stage)

const group = new Group({ x: 100, y: 100 }).addTo(layer)
const circle = new Circle({ x: 10, y: 10, radius: 20, fill: "red" }).addTo(group)
```

now the position of the displayed `circle` will be  `{ 100 + 10; 100 + 10 }`

The landmark value of offset `Shape` is calculated from the position of `Group`
