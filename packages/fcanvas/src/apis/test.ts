import { ref } from "@vue/reactivity"
import { watch } from "@vue-reactivity/watch"

import { effectScopeFlat } from "./effectScopeFlat"

const effect = effectScopeFlat()

effect.fOn()
const counter = ref(0)
watch(counter, () => console.log("changed"))
effect.fOff()

const effect2 = effectScopeFlat()
effect2.fOn()
const counter3 = ref(0)
watch(counter3, () => console.log("changed"))
effect2.fOff()

effect.fOn()
const counter2 = ref(0)
watch(counter2, () => console.log("changed2"))
effect.fOff()

counter.value++
counter2.value++

effect.stop()

counter.value++
counter2.value++
