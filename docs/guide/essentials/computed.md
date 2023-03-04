# Computed

Equivalent documents: https://vuejs.org/guide/essentials/computed.html


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
