# Reactivity Fundamentals

Equivalent documents: https://vuejs.org/guide/guide/essentials/reactivity-fundamentals.html

`fcanvas` react suite provides exactly the same as vue's documentation provided above except that `vue template' syntax is not used

`fcanvas` components (`Stage`, `Layer`, `Shape`...) accept setting values ​​as primitives or a return value from react api like `ref `, `reactive`, `computed`...

```ts
import { ref, computed, Circle } from "fcanvas"

const x = ref(0)
const y = computed(() => x.value * 2)

const circle = new Circle({
  x,
  y
})

x.value = 50
```
