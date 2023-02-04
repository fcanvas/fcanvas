import type { ShallowRef } from "@vue/reactivity"

export type MayBeShallowRef<T> = T | ShallowRef<T>
