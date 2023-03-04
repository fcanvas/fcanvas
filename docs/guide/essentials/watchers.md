# Watchers

Equivalent documents: https://vuejs.org/guide/essentials/watchers.html

`fcanvas` react suite provides exactly the same as vue's documentation provided above except that `vue template' syntax is not used

`fcanvas` allows you to directly monitor the value of components via `.$`:

```ts
import { watch, Circle } from "fcanvas"

const circle = new Circle({
   x: 0,
   y: 0,
   radius: 10
})

watch(() => circle.$.x, () => {
   console.log("x changed")
})

circle.$.x++ // emit console.log("x changed")
```
