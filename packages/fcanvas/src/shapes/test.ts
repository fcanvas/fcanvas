import { ref } from "@vue/reactivity"
import { watchEffect } from "src/fns/watch"
Object.assign(global, { __DEV__: true })
const count = ref(0)
watchEffect(
  () => {
    console.log(count.value)
  },
  {
    flush: "post"
  }
)

count.value++
count.value++
count.value++
count.value++
count.value++
count.value++
